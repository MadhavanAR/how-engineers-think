/**
 * User preferences storage
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  codeTheme: 'default' | 'monokai' | 'dracula' | 'github';
  animations: boolean;
}

const STORAGE_KEY = 'how-engineers-think-preferences';
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 'medium',
  codeTheme: 'default',
  animations: true,
};

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate and merge with defaults
        return {
          ...DEFAULT_PREFERENCES,
          ...(typeof parsed === 'object' && parsed !== null ? parsed : {}),
        };
      } catch (parseError) {
        console.error('Error parsing preferences, resetting:', parseError);
        // Reset corrupted data
        savePreferences(DEFAULT_PREFERENCES);
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }

  return DEFAULT_PREFERENCES;
}

export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    // Apply theme immediately
    applyTheme(preferences.theme);
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const preferences = getPreferences();
  preferences[key] = value;
  savePreferences(preferences);
}

export function applyTheme(theme: 'light' | 'dark' | 'auto'): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark-mode', prefersDark);
  } else {
    root.classList.toggle('dark-mode', theme === 'dark');
  }

  root.classList.toggle('light-mode', theme === 'light');
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const preferences = getPreferences();
  applyTheme(preferences.theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (preferences.theme === 'auto') {
      applyTheme('auto');
    }
  });
}
