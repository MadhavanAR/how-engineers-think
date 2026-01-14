/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure sources directory is included in production builds
  // This is important for file-based content loading
  outputFileTracingIncludes: {
    '/api/**': ['./sources/**/*'],
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Turbopack works with most configs out of the box
  },
};

module.exports = nextConfig;
