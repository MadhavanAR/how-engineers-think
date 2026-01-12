'use client';

import { useState, useMemo } from 'react';
import { Source, Lesson } from '@/types';
import Link from 'next/link';

interface SearchBarProps {
  sources: Source[];
}

export default function SearchBar({ sources }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const matches: Array<{ lesson: Lesson; source: Source; matchType: string }> = [];

    sources.forEach(source => {
      source.lessons.forEach(lesson => {
        const titleMatch = lesson.title.toLowerCase().includes(searchTerm);
        const subtitleMatch = lesson.subtitle.toLowerCase().includes(searchTerm);
        const contentMatch =
          lesson.concept.content.toLowerCase().includes(searchTerm) ||
          lesson.scenario.content.toLowerCase().includes(searchTerm);

        if (titleMatch || subtitleMatch || contentMatch) {
          matches.push({
            lesson,
            source,
            matchType: titleMatch ? 'title' : subtitleMatch ? 'subtitle' : 'content',
          });
        }
      });
    });

    return matches.slice(0, 10); // Limit to 10 results
  }, [query, sources]);

  const handleResultClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search lessons..."
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="search-input"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(({ lesson, source, matchType }) => (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="search-result-item"
              onClick={handleResultClick}
            >
              <div className="search-result-title">{lesson.title}</div>
              <div className="search-result-meta">
                {source.name} • {matchType}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">No lessons found</div>
        </div>
      )}
    </div>
  );
}
