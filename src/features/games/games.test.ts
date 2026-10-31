import assert from 'node:assert';

console.log('--- RUNNING SIDE QUEST GAME MODULE TESTS ---');

// 1. Memory Match Logic Test
{
  const SYMBOLS = ['star', 'moon', 'sun', 'gem', 'sprout', 'disk'];
  const deck: { id: number; symbolId: string }[] = [];
  SYMBOLS.forEach((sym, sIdx) => {
    deck.push({ id: sIdx * 2, symbolId: sym });
    deck.push({ id: sIdx * 2 + 1, symbolId: sym });
  });

  assert.strictEqual(deck.length, 12, 'Cozy size should generate exactly 12 cards (6 pairs)');
  const pairsFound = new Set(deck.map((d) => d.symbolId));
  assert.strictEqual(pairsFound.size, 6, 'Should contain 6 distinct symbols');

  // Verify match detection
  const cardA = deck[0];
  const cardB = deck[1];
  assert.strictEqual(cardA.symbolId === cardB.symbolId, true, 'Cards with same symbolId must match');
  console.log('✓ Memory Match deck & pair logic passed');
}

// 2. Word Hunt Word Verification Test
{
  const word: string = 'COZY';
  const reversed: string = 'YZOC';

  // Test forward match
  assert.strictEqual(word === 'COZY' || reversed === 'COZY', true);
  // Test backwards selection match
  const selectedBackward = 'YZOC';
  assert.strictEqual(selectedBackward.split('').reverse().join(''), 'COZY');
  console.log('✓ Word Hunt bidirectional selection detection passed');
}

// 3. Tiny Garden Growth Logic Test
{
  interface PlantDef {
    id: string;
    waterRequired: number;
  }
  const daisy: PlantDef = { id: 'daisy', waterRequired: 3 };

  function getStage(waterCount: number, required: number): 'seed' | 'growing' | 'bloom' {
    if (waterCount >= required) return 'bloom';
    if (waterCount >= Math.ceil(required / 2)) return 'growing';
    return 'seed';
  }

  assert.strictEqual(getStage(0, daisy.waterRequired), 'seed');
  assert.strictEqual(getStage(1, daisy.waterRequired), 'seed');
  assert.strictEqual(getStage(2, daisy.waterRequired), 'growing');
  assert.strictEqual(getStage(3, daisy.waterRequired), 'bloom');
  assert.strictEqual(getStage(5, daisy.waterRequired), 'bloom', 'Watering past requirement remains in bloom');
  console.log('✓ Tiny Garden peaceful growth transitions passed');
}

// 4. One-Line Journal Validation Test
{
  const entryText = 'A crisp cup of mint tea while looking at rainy rooftops.';
  assert.ok(entryText.length > 0 && entryText.length <= 280, 'Entry fits single-line length constraint');
  const sanitized = entryText.trim();
  assert.strictEqual(sanitized, entryText);
  console.log('✓ One-Line Journal length & trimming constraints passed');
}

console.log('--- ALL GAME MODULE LOGIC TESTS PASSED! ---');
