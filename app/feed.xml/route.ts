import { getAllLessons, getAllSources } from '@/lib/sources';
import { NextResponse } from 'next/server';

// Force dynamic rendering - RSS feed should always be fresh
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// RSS 2.0 XML generator
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const dayNum = date.getUTCDate();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

export async function GET() {
  try {
    const [lessons, sources] = await Promise.all([getAllLessons(), getAllSources()]);

    // Get site URL from environment or default
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const baseUrl = siteUrl.replace(/\/$/, '');

    // Generate RSS items for each lesson
    const items = lessons
      .map(lesson => {
        const source = sources.find(s => s.id === lesson.sourceId);
        // New URL format: /{sourceId}/{lessonSlug}
        const lessonSlug = lesson.id.replace(`${lesson.sourceId}-`, '');
        const lessonUrl = `${baseUrl}/${lesson.sourceId}/${lessonSlug}`;
        const pubDate = new Date(); // You could add a date field to lessons if needed

        // Create description from lesson content
        const description = [lesson.description, lesson.concept?.content, lesson.scenario?.content]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
          .substring(0, 500); // Limit description length

        return `    <item>
      <title>${escapeXml(lesson.title)}${lesson.subtitle ? ` - ${escapeXml(lesson.subtitle)}` : ''}</title>
      <link>${lessonUrl}</link>
      <guid isPermaLink="true">${lessonUrl}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${formatDate(pubDate)}</pubDate>
      ${source ? `<category>${escapeXml(source.name)}</category>` : ''}
    </item>`;
      })
      .join('\n');

    // Generate RSS feed XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>How Engineers Think</title>
    <link>${baseUrl}</link>
    <description>Where 'it works on my machine' meets reality - Engineering lessons and practical examples</description>
    <language>en-US</language>
    <lastBuildDate>${formatDate(new Date())}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>How Engineers Think RSS Feed</generator>
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
