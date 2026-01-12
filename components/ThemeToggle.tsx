'use client';

import { usePreferences } from '@/hooks/usePreferences';

export default function ThemeToggle() {
  const { preferences, setTheme } = usePreferences();

  const handleToggle = () => {
    if (preferences.theme === 'light') {
      setTheme('dark');
    } else if (preferences.theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (preferences.theme === 'light') return '☀️';
    if (preferences.theme === 'dark') return '🌙';
    return '🌓';
  };

  const getLabel = () => {
    if (preferences.theme === 'light') return 'Light';
    if (preferences.theme === 'dark') return 'Dark';
    return 'Auto';
  };

  return (
    <button
      className="theme-toggle-button"
      onClick={handleToggle}
      aria-label={`Switch theme (currently ${preferences.theme})`}
      title={`Current theme: ${getLabel()}`}
    >
      <span className="theme-icon">{getIcon()}</span>
    </button>
  );
}
