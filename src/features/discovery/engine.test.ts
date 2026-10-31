import assert from 'node:assert';
import {
  filterQuests,
  getRecommendedQuests,
  getRandomQuest,
  getCuratedFeaturedQuest,
  countActiveFilters,
} from './engine';
import { QUESTS_REGISTRY } from '../../data/quests';

console.log('--- RUNNING SIDE QUEST DISCOVERY ENGINE TESTS ---');

// Test 1: Availability filtering (Excludes 'coming-soon' by default)
{
  const playableOnly = filterQuests(QUESTS_REGISTRY);
  assert.ok(playableOnly.length > 0, 'Should return playable quests');
  assert.ok(
    playableOnly.every((q) => q.availability === 'playable'),
    'All returned quests must have availability === "playable"'
  );

  const withComingSoon = filterQuests(QUESTS_REGISTRY, { includeComingSoon: true });
  assert.ok(
    withComingSoon.length > playableOnly.length,
    'Should include coming-soon quests when includeComingSoon: true'
  );
  assert.ok(
    withComingSoon.some((q) => q.availability === 'coming-soon'),
    'Should find coming-soon items in registry'
  );
  console.log('✓ Test 1: Availability filtering passed');
}

// Test 2: Mood filtering
{
  const thinkQuests = filterQuests(QUESTS_REGISTRY, { mood: 'think' });
  assert.ok(thinkQuests.length > 0, 'Should find quests for "think" mood');
  assert.ok(
    thinkQuests.every((q) => q.moods.includes('think')),
    'All matched quests must contain "think" in their moods'
  );

  const surpriseQuests = filterQuests(QUESTS_REGISTRY, { mood: 'surprise' });
  assert.strictEqual(
    surpriseQuests.length,
    filterQuests(QUESTS_REGISTRY, {}).length,
    '"surprise" mood should not restrict available quests'
  );
  console.log('✓ Test 2: Mood filtering passed');
}

// Test 3: Duration & Difficulty filtering
{
  const quickEasy = filterQuests(QUESTS_REGISTRY, {
    duration: '2-5 min',
    difficulty: 'easy',
  });
  assert.ok(quickEasy.length > 0, 'Should find 2-5 min easy quests');
  assert.ok(
    quickEasy.every((q) => q.duration === '2-5 min' && q.difficulty === 'easy'),
    'All returned quests must be 2-5 min and easy'
  );

  const challenging = filterQuests(QUESTS_REGISTRY, {
    difficulty: 'challenging',
  });
  assert.ok(challenging.length > 0, 'Should find challenging quests');
  assert.ok(
    challenging.every((q) => q.difficulty === 'challenging'),
    'All returned quests must have difficulty === "challenging"'
  );
  console.log('✓ Test 3: Duration & Difficulty filtering passed');
}

// Test 4: Digital and Offline activity separation
{
  const digitalQuests = filterQuests(QUESTS_REGISTRY, { type: 'digital' });
  const offlineQuests = filterQuests(QUESTS_REGISTRY, { type: 'offline' });
  const eitherQuests = filterQuests(QUESTS_REGISTRY, { type: 'either' });

  assert.ok(digitalQuests.length > 0, 'Should have digital quests');
  assert.ok(offlineQuests.length > 0, 'Should have offline quests');
  assert.ok(
    digitalQuests.every((q) => q.type === 'digital'),
    'Digital quests must all have type === "digital"'
  );
  assert.ok(
    offlineQuests.every((q) => q.type === 'offline'),
    'Offline quests must all have type === "offline"'
  );
  assert.strictEqual(
    digitalQuests.length + offlineQuests.length,
    eitherQuests.length,
    'Sum of digital and offline must equal total either'
  );
  console.log('✓ Test 4: Digital and Offline separation passed');
}

// Test 5: Search Query
{
  const searchByTitle = filterQuests(QUESTS_REGISTRY, { searchQuery: 'tarot' });
  assert.ok(searchByTitle.length >= 1, 'Should find Tarot Memory Match');
  assert.strictEqual(searchByTitle[0].id, 'quest-memory-match');

  const searchByTag = filterQuests(QUESTS_REGISTRY, { searchQuery: 'canvas' });
  assert.ok(searchByTag.length >= 1, 'Should find Pixel Studio by canvas tag');
  assert.strictEqual(searchByTag[0].id, 'quest-pixel-studio');
  console.log('✓ Test 5: Search query passed');
}

// Test 6: Empty States and Graceful Fallback Recommendations
{
  // A deliberately impossible combination:
  // e.g. challenging 2-5 min digital quest that doesn't exist in registry
  const impossibleResult = getRecommendedQuests(QUESTS_REGISTRY, {
    difficulty: 'challenging',
    duration: '2-5 min',
    searchQuery: 'nonexistent_xyz_query',
  });

  assert.strictEqual(impossibleResult.totalMatches, 0, 'totalMatches should be 0');
  assert.strictEqual(impossibleResult.isEmpty, true, 'isEmpty must be true');
  assert.strictEqual(impossibleResult.fallbacksUsed, true, 'fallbacksUsed must be true');
  assert.ok(impossibleResult.suggested.length > 0, 'Suggested fallbacks must not be empty');
  assert.ok(impossibleResult.featured !== null, 'Should provide a fallback featured quest');
  assert.ok(impossibleResult.fallbackReason !== undefined, 'Should have a friendly explanation');
  console.log('✓ Test 6: Empty states and graceful fallbacks passed');
}

// Test 7: Non-repetition heuristic in recommendations
{
  const allPlayable = filterQuests(QUESTS_REGISTRY, {});
  const firstId = allPlayable[0].id;

  const resultWithoutExclude = getRecommendedQuests(QUESTS_REGISTRY, {}, { limit: 4 });
  const resultWithExclude = getRecommendedQuests(
    QUESTS_REGISTRY,
    { excludeIds: [firstId] },
    { limit: 4, preferUnplayed: true }
  );

  // The excluded ID should not be the featured item if other options exist
  assert.notStrictEqual(
    resultWithExclude.featured?.id,
    firstId,
    'Excluded ID should not be featured when alternatives exist'
  );
  console.log('✓ Test 7: Non-repetition heuristic passed');
}

// Test 8: Random Quest Selector (Arcade Machine)
{
  const randomPlayable = getRandomQuest(QUESTS_REGISTRY);
  assert.ok(randomPlayable !== null, 'Random quest must return a valid quest');
  assert.strictEqual(randomPlayable?.availability, 'playable', 'Must never return unavailable quest');

  // Verify it respects currentId to avoid immediate double-roll
  const testId = 'quest-memory-match';
  for (let i = 0; i < 10; i++) {
    const rolled = getRandomQuest(QUESTS_REGISTRY, {}, { currentId: testId });
    assert.notStrictEqual(rolled?.id, testId, 'Random roller must not return current quest');
  }

  // Verify it respects filters
  const offlineOnly = getRandomQuest(QUESTS_REGISTRY, { type: 'offline' });
  assert.strictEqual(offlineOnly?.type, 'offline', 'Random offline must be offline');
  console.log('✓ Test 8: Random quest selector passed');
}

// Test 9: Curated Daily Featured Quest
{
  const featuredDay0 = getCuratedFeaturedQuest(QUESTS_REGISTRY, 0);
  const featuredDay1 = getCuratedFeaturedQuest(QUESTS_REGISTRY, 1);
  assert.ok(featuredDay0 !== null && featuredDay1 !== null, 'Featured quest must exist');
  assert.strictEqual(featuredDay0.availability, 'playable');
  console.log('✓ Test 9: Curated daily featured quest passed');
}

// Test 10: Active Filters Counter
{
  assert.strictEqual(countActiveFilters({}), 0);
  assert.strictEqual(
    countActiveFilters({ mood: 'think', duration: '2-5 min', type: 'digital' }),
    3
  );
  assert.strictEqual(countActiveFilters({ mood: 'surprise', duration: 'any', type: 'either' }), 0);
  console.log('✓ Test 10: Active filters counter passed');
}

console.log('--- ALL 10 TESTS PASSED SUCCESSFULLY! ---');
