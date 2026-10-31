import { Quest, QuestCategory, QuestDifficulty, QuestDuration, QuestType, MoodType } from '../../types/quest';

export interface RecommendationFilter {
  mood?: MoodType | 'surprise' | null;
  duration?: QuestDuration | 'any' | null;
  difficulty?: QuestDifficulty | 'any' | null;
  type?: QuestType | 'either' | null;
  category?: QuestCategory | 'all' | null;
  searchQuery?: string | null;
  excludeIds?: string[];
  includeComingSoon?: boolean;
}

export interface RecommendationResult {
  featured: Quest | null;
  suggested: Quest[];
  totalMatches: number;
  isEmpty: boolean;
  fallbacksUsed: boolean;
  activeFiltersCount: number;
  fallbackReason?: string;
}

/**
 * Counts how many non-default filters are active.
 */
export function countActiveFilters(filter: RecommendationFilter): number {
  let count = 0;
  if (filter.mood && filter.mood !== 'surprise') count++;
  if (filter.duration && filter.duration !== 'any') count++;
  if (filter.difficulty && filter.difficulty !== 'any') count++;
  if (filter.type && filter.type !== 'either') count++;
  if (filter.category && filter.category !== 'all') count++;
  if (filter.searchQuery && filter.searchQuery.trim().length > 0) count++;
  return count;
}

/**
 * Filters quests strictly according to the provided filter parameters.
 * Automatically excludes unavailable ('coming-soon') quests unless includeComingSoon is true.
 */
export function filterQuests(
  registry: Quest[],
  filter: RecommendationFilter = {}
): Quest[] {
  const {
    mood,
    duration,
    difficulty,
    type,
    category,
    searchQuery,
    includeComingSoon = false,
  } = filter;

  return registry.filter((quest) => {
    // 1. Availability check: exclude coming-soon unless requested
    if (!includeComingSoon && quest.availability !== 'playable') {
      return false;
    }

    // 2. Mood filter: 'surprise' allows any mood
    if (mood && mood !== 'surprise' && !quest.moods.includes(mood)) {
      return false;
    }

    // 3. Duration filter
    if (duration && duration !== 'any' && quest.duration !== duration) {
      return false;
    }

    // 4. Difficulty filter
    if (difficulty && difficulty !== 'any' && quest.difficulty !== difficulty) {
      return false;
    }

    // 5. Activity Type (digital vs offline)
    if (type && type !== 'either' && quest.type !== type) {
      return false;
    }

    // 6. Category filter
    if (category && category !== 'all' && quest.category !== category) {
      return false;
    }

    // 7. Search Query match across title, description, category, and tags
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = quest.title.toLowerCase().includes(q);
      const matchDesc = quest.description.toLowerCase().includes(q);
      const matchCategory = quest.category.toLowerCase().includes(q);
      const matchTags = quest.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

      if (!matchTitle && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Reusable recommendation engine that:
 * - Computes matching quests
 * - Prioritizes unplayed/unrecommended quests to prevent unnecessary repetitions
 * - Selects a dedicated featured quest matching the criteria
 * - Provides graceful fallbacks when strict filters return zero matches
 */
export function getRecommendedQuests(
  registry: Quest[],
  filter: RecommendationFilter = {},
  options: {
    limit?: number;
    seed?: number;
    preferUnplayed?: boolean;
  } = {}
): RecommendationResult {
  const { limit = 6, seed = 0, preferUnplayed = true } = options;
  const activeCount = countActiveFilters(filter);
  const excludeSet = new Set(filter.excludeIds || []);

  const exactMatches = filterQuests(registry, filter);

  if (exactMatches.length > 0) {
    // Sort to prioritize items NOT in excludeIds to avoid repetition
    const sorted = [...exactMatches].sort((a, b) => {
      if (preferUnplayed) {
        const aExcluded = excludeSet.has(a.id);
        const bExcluded = excludeSet.has(b.id);
        if (aExcluded !== bExcluded) {
          return aExcluded ? 1 : -1;
        }
      }
      // Deterministic shuffle with seed
      const hashA = (a.id.length * 31 + seed) % 17;
      const hashB = (b.id.length * 31 + seed) % 17;
      return hashA - hashB;
    });

    const featured = sorted[0] || null;
    // Suggested items (avoiding duplicating featured if multiple items exist)
    const suggested = sorted.length > 1 ? sorted.slice(1, limit + 1) : sorted.slice(0, limit);

    return {
      featured,
      suggested,
      totalMatches: exactMatches.length,
      isEmpty: false,
      fallbacksUsed: false,
      activeFiltersCount: activeCount,
    };
  }

  // Fallback branch: strict match returned 0 items
  // Step A: Relax duration and difficulty while keeping mood and type
  const relaxedFilter: RecommendationFilter = {
    mood: filter.mood,
    type: filter.type,
    category: filter.category,
    includeComingSoon: false,
  };

  let fallbackMatches = filterQuests(registry, relaxedFilter);

  // Step B: If still empty, pull any playable quests
  if (fallbackMatches.length === 0) {
    fallbackMatches = filterQuests(registry, { includeComingSoon: false });
  }

  // Prioritize unplayed in fallbacks as well
  const fallbackSorted = [...fallbackMatches].sort((a, b) => {
    const aExcluded = excludeSet.has(a.id);
    const bExcluded = excludeSet.has(b.id);
    if (aExcluded !== bExcluded) {
      return aExcluded ? 1 : -1;
    }
    return 0;
  });

  return {
    featured: fallbackSorted[0] || null,
    suggested: fallbackSorted.slice(0, limit),
    totalMatches: 0,
    isEmpty: true,
    fallbacksUsed: true,
    activeFiltersCount: activeCount,
    fallbackReason: 'No exact matches for your specific filter combination. Showing curated alternatives.',
  };
}

/**
 * Random quest selector (for the Arcade Machine / Quick Roll).
 * - Excludes unavailable quests
 * - Respects active filters
 * - Avoids repeating the current quest or recent history
 */
export function getRandomQuest(
  registry: Quest[],
  filter: RecommendationFilter = {},
  options: {
    currentId?: string;
    excludeIds?: string[];
  } = {}
): Quest | null {
  const matches = filterQuests(registry, { ...filter, includeComingSoon: false });
  if (matches.length === 0) {
    // If no filtered matches exist, fallback to all playable
    const allPlayable = registry.filter((q) => q.availability === 'playable');
    if (allPlayable.length === 0) return null;
    return allPlayable[Math.floor(Math.random() * allPlayable.length)];
  }

  const { currentId, excludeIds = [] } = options;
  const excludeSet = new Set(excludeIds);
  if (currentId) excludeSet.add(currentId);

  // Filter out recent or current quests to avoid immediate repetition
  const nonRepeated = matches.filter((q) => !excludeSet.has(q.id));

  if (nonRepeated.length > 0) {
    return nonRepeated[Math.floor(Math.random() * nonRepeated.length)];
  }

  // If all matching quests were recently seen, pick any match other than the currentId
  const withoutCurrent = matches.filter((q) => q.id !== currentId);
  if (withoutCurrent.length > 0) {
    return withoutCurrent[Math.floor(Math.random() * withoutCurrent.length)];
  }

  return matches[0];
}

/**
 * Returns a deterministic featured quest for the daily spotlight.
 */
export function getCuratedFeaturedQuest(registry: Quest[], dayIndex: number = 0): Quest {
  const playable = registry.filter((q) => q.availability === 'playable');
  if (playable.length === 0) return registry[0];
  const idx = Math.abs(dayIndex) % playable.length;
  return playable[idx];
}
