'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getPreferences,
  savePreferences,
  updatePreference,
  applyTheme,
  type UserPreferences,
} from '@/lib/storage/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(getPreferences());

  useEffect(() => {
    const prefs = getPreferences();
    setPreferences(prefs);
    applyTheme(prefs.theme);
  }, []);

  const update = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      updatePreference(key, value);
      setPreferences(getPreferences());
    },
    []
  );

  const setTheme = useCallback(
    (theme: 'light' | 'dark' | 'auto') => {
      update('theme', theme);
    },
    [update]
  );

  const setFontSize = useCallback(
    (fontSize: 'small' | 'medium' | 'large') => {
      update('fontSize', fontSize);
    },
    [update]
  );

  const setCodeTheme = useCallback(
    (codeTheme: 'default' | 'monokai' | 'dracula' | 'github') => {
      update('codeTheme', codeTheme);
    },
    [update]
  );

  const setAnimations = useCallback(
    (animations: boolean) => {
      update('animations', animations);
    },
    [update]
  );

  return {
    preferences,
    update,
    setTheme,
    setFontSize,
    setCodeTheme,
    setAnimations,
    refresh: () => setPreferences(getPreferences()),
  };
}
