import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RetroWindow } from '../../../components/windows/RetroWindow';
import { RotateCcw, Lightbulb, CheckCircle2, Sparkles, Trophy, BookOpen } from 'lucide-react';

interface WordHuntGameProps {
  onComplete: () => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

interface PuzzleTheme {
  name: string;
  words: string[];
}

const THEMES: PuzzleTheme[] = [
  {
    name: 'Cozy Afternoon',
    words: ['TEA', 'NOOK', 'RAIN', 'BOOK', 'COZY', 'WARM'],
  },
  {
    name: 'Retro Tech',
    words: ['PIXEL', 'DISK', 'BYTE', 'CHIP', 'CODE', 'GLYPH'],
  },
  {
    name: 'Botanical Sanctuary',
    words: ['FERN', 'MINT', 'DAISY', 'BLOOM', 'SPORE', 'LEAF'],
  },
];

const HIGHLIGHT_COLORS = [
  '#F0449B',
  '#A98BEF',
  '#FFE17B',
  '#A8E8C2',
  '#83C9F5',
  '#E07A5F',
];

export const WordHuntGame: React.FC<WordHuntGameProps> = ({
  onComplete,
  onSoundTrigger,
}) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [gridSize, setGridSize] = useState<8 | 10>(8);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<
    { word: string; cells: [number, number][]; orientation: string }[]
  >([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hintTier, setHintTier] = useState<number>(0);
  const [hintMessage, setHintMessage] = useState<string>('');
  const [highlightedFirstLetter, setHighlightedFirstLetter] = useState<[number, number] | null>(null);

  const currentTheme = THEMES[themeIndex];

  // Generate word grid
  const generatePuzzle = useCallback((size: number, wordsToPlace: string[]) => {
    // Create empty matrix
    const matrix: (string | null)[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));

    const placed: { word: string; cells: [number, number][]; orientation: string }[] = [];

    const directions = [
      { r: 0, c: 1, name: 'Horizontal' },
      { r: 1, c: 0, name: 'Vertical' },
      { r: 1, c: 1, name: 'Diagonal' },
    ];

    for (const word of wordsToPlace) {
      let placedSuccess = false;
      let attempts = 0;

      while (!placedSuccess && attempts < 100) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startR = Math.floor(Math.random() * size);
        const startC = Math.floor(Math.random() * size);

        const endR = startR + dir.r * (word.length - 1);
        const endC = startC + dir.c * (word.length - 1);

        if (endR >= 0 && endR < size && endC >= 0 && endC < size) {
          // Check collision
          let canFit = true;
          const tempCells: [number, number][] = [];

          for (let i = 0; i < word.length; i++) {
            const r = startR + dir.r * i;
            const c = startC + dir.c * i;
            const existing = matrix[r][c];
            if (existing !== null && existing !== word[i]) {
              canFit = false;
              break;
            }
            tempCells.push([r, c]);
          }

          if (canFit) {
            tempCells.forEach(([r, c], i) => {
              matrix[r][c] = word[i];
            });
            placed.push({ word, cells: tempCells, orientation: dir.name });
            placedSuccess = true;
          }
        }
      }
    }

    // Fill remaining cells with random letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const finalGrid: string[][] = matrix.map((row) =>
      row.map((cell) => cell || alphabet[Math.floor(Math.random() * alphabet.length)])
    );

    setGrid(finalGrid);
    setWordPositions(placed);
    setFoundWords([]);
    setSelectedCells([]);
    setHintTier(0);
    setHintMessage('');
    setHighlightedFirstLetter(null);
  }, []);

  useEffect(() => {
    generatePuzzle(gridSize, currentTheme.words);
  }, [gridSize, currentTheme, generatePuzzle]);

  // Keyboard Escape listener to cancel cell selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCells([]);
        setIsSelecting(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCellClick = (r: number, c: number) => {
    onSoundTrigger?.('click');

    if (selectedCells.length === 0) {
      // First cell
      setSelectedCells([[r, c]]);
      setIsSelecting(true);
      return;
    }

    // Second cell clicked: resolve line between first cell and this cell
    const [startR, startC] = selectedCells[0];
    const dr = r - startR;
    const dc = c - startC;

    // Check if horizontal, vertical, or diagonal
    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const isValidLine =
      dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);

    if (isValidLine && length > 1) {
      const lineCells: [number, number][] = [];
      let letters = '';

      for (let i = 0; i < length; i++) {
        const curR = startR + stepR * i;
        const curC = startC + stepC * i;
        lineCells.push([curR, curC]);
        letters += grid[curR][curC];
      }

      // Check if word or reverse matches an unfound word
      const reversed = letters.split('').reverse().join('');
      const matched = wordPositions.find(
        (wp) =>
          !foundWords.includes(wp.word) &&
          (wp.word === letters || wp.word === reversed)
      );

      if (matched) {
        onSoundTrigger?.('chime');
        const nextFound = [...foundWords, matched.word];
        setFoundWords(nextFound);
        setSelectedCells([]);
        setHighlightedFirstLetter(null);
        setHintMessage(`Found "${matched.word}"!`);

        if (nextFound.length === wordPositions.length) {
          onSoundTrigger?.('fanfare');
          onComplete();
        }
      } else {
        onSoundTrigger?.('pop');
        setSelectedCells([]);
      }
    } else {
      setSelectedCells([[r, c]]);
    }
  };

  // 4-Tier Hint System
  const handleUseHint = () => {
    const unfound = wordPositions.filter((wp) => !foundWords.includes(wp.word));
    if (unfound.length === 0) return;

    onSoundTrigger?.('boop');
    const target = unfound[0];
    const nextTier = (hintTier % 4) + 1;
    setHintTier(nextTier);

    if (nextTier === 1) {
      setHintMessage(`Hint Tier 1: Look for the word "${target.word}" (${target.word.length} letters).`);
    } else if (nextTier === 2) {
      setHintMessage(`Hint Tier 2: "${target.word}" is placed ${target.orientation.toUpperCase()}.`);
    } else if (nextTier === 3) {
      const startCol = target.cells[0][1] + 1;
      setHintMessage(`Hint Tier 3: "${target.word}" starts around column ${startCol}.`);
    } else if (nextTier === 4) {
      setHighlightedFirstLetter(target.cells[0]);
      setHintMessage(`Hint Tier 4: First letter "${target.word[0]}" highlighted on the grid!`);
    }
  };

  // Check if cell is part of a found word
  const getCellHighlight = (r: number, c: number) => {
    for (let i = 0; i < wordPositions.length; i++) {
      const wp = wordPositions[i];
      if (foundWords.includes(wp.word)) {
        if (wp.cells.some(([cr, cc]) => cr === r && cc === c)) {
          return HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {hintMessage || (selectedCells.length === 1 ? `Selected first cell. Choose ending cell.` : '')}
      </div>

      {/* Control bar */}
      <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex flex-wrap items-center justify-between gap-4">
        {/* Theme and Stats */}
        <div className="flex items-center gap-3 text-xs font-interface">
          <div className="flex items-center gap-1.5 font-bold text-[#211D29]">
            <BookOpen className="w-4 h-4 text-[#F0449B]" />
            <span>THEME: {currentTheme.name.toUpperCase()}</span>
          </div>
          <span className="text-[#211D29]/30">|</span>
          <div className="font-mono text-[#77717D]">
            FOUND: <strong className="text-[#211D29] font-bold">{foundWords.length}/{wordPositions.length}</strong>
          </div>
        </div>

        {/* Theme & Hint buttons */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              setThemeIndex((t) => (t + 1) % THEMES.length);
            }}
            className="px-2.5 py-1 text-xs border border-[#211D29] bg-white hover:bg-[#FFE17B] font-interface font-semibold text-[#211D29]"
          >
            Next Theme
          </button>

          {/* 4-Tier Hint Button */}
          <button
            type="button"
            onClick={handleUseHint}
            className="px-3 py-1 border-2 border-[#211D29] bg-[#FFE17B] hover:bg-[#A8E8C2] text-[#211D29] text-xs font-interface font-bold btn-retro shadow-retro-sm flex items-center gap-1"
            title="Get gentle hint (up to 4 tiers)"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint {hintTier > 0 ? `(Tier ${hintTier})` : ''}</span>
          </button>

          {/* New Board */}
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('boop');
              generatePuzzle(gridSize, currentTheme.words);
            }}
            className="p-1.5 border-2 border-[#211D29] bg-white hover:bg-[#FFE17B] text-[#211D29] btn-retro shadow-retro-sm"
            title="Generate new letter layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hint Alert Notice */}
      {hintMessage && (
        <div className="p-3 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] text-xs font-interface font-semibold shadow-retro flex items-center justify-between">
          <span>{hintMessage}</span>
          <button
            type="button"
            onClick={() => setHintMessage('')}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Game Board Split: Grid + Target Words List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Letter Grid */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-4 md:p-6 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro-lg overflow-x-auto">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: 'min(420px, 85vw)',
              height: 'min(420px, 85vw)',
            }}
            className="gap-1 border-2 border-[#211D29] bg-[#211D29] p-2 shadow-retro select-none"
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isSelected = selectedCells.some(([sr, sc]) => sr === r && sc === c);
                const highlightColor = getCellHighlight(r, c);
                const isFirstLetterHint =
                  highlightedFirstLetter &&
                  highlightedFirstLetter[0] === r &&
                  highlightedFirstLetter[1] === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    aria-label={`Letter ${letter} at row ${r + 1}, column ${c + 1}`}
                    style={{
                      backgroundColor: isSelected
                        ? '#FFE17B'
                        : highlightColor || '#FFF9EA',
                    }}
                    className={`flex items-center justify-center font-mono font-bold text-base sm:text-lg border border-[#211D29] transition-transform ${
                      isSelected
                        ? 'scale-95 shadow-inner'
                        : isFirstLetterHint
                        ? 'animate-bounce ring-2 ring-[#F0449B]'
                        : 'hover:bg-[#A98BEF]/30'
                    } text-[#211D29]`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
          <span className="text-[11px] font-interface text-[#77717D] mt-3">
            Click first letter, then click last letter of the word to highlight
          </span>
        </div>

        {/* Word Checklist Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro">
            <h3 className="font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] mb-3 border-b border-[#211D29]/15 pb-2">
              Words to Discover ({foundWords.length}/{wordPositions.length})
            </h3>

            <div className="space-y-2">
              {wordPositions.map((wp, idx) => {
                const isFound = foundWords.includes(wp.word);
                const color = HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length];

                return (
                  <div
                    key={wp.word}
                    className={`flex items-center justify-between p-2 border border-[#211D29] font-mono text-xs font-bold transition-all ${
                      isFound
                        ? 'opacity-60 line-through bg-white'
                        : 'bg-white shadow-[1px_1px_0px_#211D29]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-[#211D29]"
                        style={{ backgroundColor: color }}
                      />
                      <span>{wp.word}</span>
                    </div>

                    {isFound && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#211D29]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
