import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, AccessibilitySettings } from '../types/quest';

const STORAGE_KEY = 'sidequest_preferences_v1';

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'normal',
  reducedMotion: false,
  soundEnabled: true,
  highContrast: false,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  favorites: ['quest-pixel-studio', 'quest-tiny-garden'],
  recentlyPlayed: ['quest-memory-match'],
  completedQuests: [],
  accessibility: DEFAULT_ACCESSIBILITY,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          accessibility: {
            ...DEFAULT_ACCESSIBILITY,
            ...(parsed.accessibility || {}),
          },
        };
      }
    } catch {
      // Storage access blocked or unavailable
    }
    return DEFAULT_PREFERENCES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage errors
    }
  }, [preferences]);

  // Apply accessibility settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    // Font scale
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${preferences.accessibility.fontSize}`);

    // Reduced Motion
    if (preferences.accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // High contrast
    if (preferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [preferences.accessibility]);

  const toggleFavorite = useCallback((questId: string) => {
    setPreferences((prev) => {
      const exists = prev.favorites.includes(questId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((id) => id !== questId)
          : [...prev.favorites, questId],
      };
    });
  }, []);

  const markRecentlyPlayed = useCallback((questId: string) => {
    setPreferences((prev) => {
      const filtered = prev.recentlyPlayed.filter((id) => id !== questId);
      return {
        ...prev,
        recentlyPlayed: [questId, ...filtered].slice(0, 10),
      };
    });
  }, []);

  const markCompleted = useCallback((questId: string) => {
    setPreferences((prev) => {
      if (prev.completedQuests.includes(questId)) return prev;
      return {
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
      };
    });
  }, []);

  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    setPreferences((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        ...updates,
      },
    }));
  }, []);

  const clearAllData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    toggleFavorite,
    markRecentlyPlayed,
    markCompleted,
    updateAccessibility,
    clearAllData,
  };
}
