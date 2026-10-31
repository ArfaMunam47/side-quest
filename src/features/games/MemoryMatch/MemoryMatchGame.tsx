import React, { useState, useEffect, useCallback } from 'react';
import { RetroWindow } from '../../../components/windows/RetroWindow';
import { RotateCcw, Sparkles, Trophy, Eye, Volume2 } from 'lucide-react';

interface MemoryCard {
  id: number;
  symbolId: string;
  label: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS_POOL = [
  { id: 'star', label: 'Cosmic Star', icon: '✦', color: '#FFE17B' },
  { id: 'moon', label: 'Crescent Moon', icon: '☽', color: '#83C9F5' },
  { id: 'sun', label: 'Solar Bloom', icon: '☼', color: '#F0449B' },
  { id: 'gem', label: 'Magic Gem', icon: '◈', color: '#A98BEF' },
  { id: 'sprout', label: 'Lucky Clover', icon: '✤', color: '#A8E8C2' },
  { id: 'disk', label: 'Retro Disk', icon: '💾', color: '#83C9F5' },
  { id: 'potion', label: 'Elixir Bottle', icon: '⚱', color: '#F0449B' },
  { id: 'key', label: 'Brass Key', icon: '🗝', color: '#FFE17B' },
  { id: 'cat', label: 'Cosmic Cat', icon: 'ฅ^•ﻌ•^ฅ', color: '#A8E8C2' },
  { id: 'planet', label: 'Ringed Planet', icon: '🪐', color: '#A98BEF' },
  { id: 'mushroom', label: 'Forest Cap', icon: '🍄', color: '#F0449B' },
  { id: 'heart', label: 'Pixel Heart', icon: '♥', color: '#F0449B' },
];

interface MemoryMatchGameProps {
  onComplete: (stats: { moves: number; pairs: number }) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

type BoardSize = 'cozy' | 'classic' | 'expanded';

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onComplete,
  onSoundTrigger,
}) => {
  const [boardSize, setBoardSize] = useState<BoardSize>('cozy'); // 6 pairs (12 cards)
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const numPairs = boardSize === 'cozy' ? 6 : boardSize === 'classic' ? 8 : 10;

  const initGame = useCallback((size: BoardSize) => {
    const pairsCount = size === 'cozy' ? 6 : size === 'classic' ? 8 : 10;
    const selectedPool = SYMBOLS_POOL.slice(0, pairsCount);

    const deck: MemoryCard[] = [];
    selectedPool.forEach((symbol, sIdx) => {
      deck.push({
        id: sIdx * 2,
        symbolId: symbol.id,
        label: symbol.label,
        icon: symbol.icon,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: sIdx * 2 + 1,
        symbolId: symbol.id,
        label: symbol.label,
        icon: symbol.icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsWon(false);
    setAnnouncement(`New ${size} game started with ${pairsCount} pairs.`);
  }, []);

  useEffect(() => {
    initGame(boardSize);
  }, [boardSize, initGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2) return;
    const targetCard = cards[index];
    if (targetCard.isFlipped || targetCard.isMatched) return;

    onSoundTrigger?.('click');

    const nextCards = [...cards];
    nextCards[index].isFlipped = true;
    setCards(nextCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const cardA = nextCards[firstIdx];
      const cardB = nextCards[secondIdx];

      if (cardA.symbolId === cardB.symbolId) {
        // Matched!
        setTimeout(() => {
          onSoundTrigger?.('chime');
          const updated = [...cards];
          updated[firstIdx].isMatched = true;
          updated[secondIdx].isMatched = true;
          setCards(updated);
          setFlippedIndices([]);
          const newPairs = matchedPairs + 1;
          setMatchedPairs(newPairs);
          setAnnouncement(`Pair found! ${cardA.label}. Total matched: ${newPairs} of ${numPairs}.`);

          if (newPairs === numPairs) {
            setIsWon(true);
            onSoundTrigger?.('fanfare');
            setAnnouncement('Congratulations! All pairs matched!');
            onComplete({ moves: moves + 1, pairs: numPairs });
          }
        }, 400);
      } else {
        // Not a match
        setAnnouncement(`Flipped ${cardA.label} and ${cardB.label}. Not a match.`);
        setTimeout(() => {
          onSoundTrigger?.('pop');
          const reset = [...cards];
          reset[firstIdx].isFlipped = false;
          reset[secondIdx].isFlipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 900);
      }
    } else {
      setAnnouncement(`Flipped ${targetCard.label}. Pick a second card.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Control Bar Window */}
      <div className="p-4 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex flex-wrap items-center justify-between gap-4">
        {/* Game Stats */}
        <div className="flex items-center gap-4 text-xs font-interface">
          <div className="flex items-center gap-1.5 font-bold text-[#211D29]">
            <Trophy className="w-4 h-4 text-[#F0449B]" />
            <span>PAIRS: {matchedPairs}/{numPairs}</span>
          </div>
          <span className="text-[#211D29]/30">|</span>
          <div className="font-mono text-[#77717D]">
            MOVES: <strong className="text-[#211D29] font-bold">{moves}</strong>
          </div>
          <span className="text-[#211D29]/30">|</span>
          <div className="text-[11px] text-[#A8E8C2] bg-[#211D29] px-2 py-0.5 font-mono font-bold">
            UNTIMED ZEN MODE
          </div>
        </div>

        {/* Board Size Toggles & Restart */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-interface font-bold text-[#77717D]">
            Size:
          </span>
          {(['cozy', 'classic', 'expanded'] as BoardSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                onSoundTrigger?.('click');
                setBoardSize(size);
              }}
              className={`px-2.5 py-1 text-xs border border-[#211D29] font-interface capitalize transition-colors ${
                boardSize === size
                  ? 'bg-[#211D29] text-white font-bold'
                  : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
              }`}
            >
              {size} ({size === 'cozy' ? '12' : size === 'classic' ? '16' : '20'})
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('boop');
              initGame(boardSize);
            }}
            className="ml-2 px-3 py-1 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm flex items-center gap-1.5"
            title="Restart current board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 p-4 md:p-6 border-2 border-[#211D29] bg-[#39264F] shadow-retro-lg ${
          boardSize === 'cozy'
            ? 'grid-cols-3 sm:grid-cols-4 max-w-2xl mx-auto'
            : boardSize === 'classic'
            ? 'grid-cols-4 max-w-3xl mx-auto'
            : 'grid-cols-4 sm:grid-cols-5 max-w-4xl mx-auto'
        }`}
      >
        {cards.map((card, idx) => {
          const isOpen = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              type="button"
              disabled={card.isMatched || flippedIndices.length >= 2}
              onClick={() => handleCardClick(idx)}
              aria-label={
                card.isMatched
                  ? `${card.label}, matched pair`
                  : card.isFlipped
                  ? `${card.label}, face up`
                  : `Card ${idx + 1}, face down`
              }
              className={`aspect-[3/4] relative flex items-center justify-center border-2 border-[#211D29] text-center select-none transition-all duration-200 ${
                isOpen
                  ? card.isMatched
                    ? 'bg-[#A8E8C2] text-[#211D29] shadow-none scale-95 opacity-90'
                    : 'bg-[#FFF9EA] text-[#211D29] shadow-retro-sm'
                  : 'bg-[#A98BEF] hover:bg-[#FFE17B] text-[#211D29] shadow-retro btn-retro cursor-pointer'
              }`}
            >
              {isOpen ? (
                <div className="flex flex-col items-center justify-center p-2">
                  <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-[1px_1px_0px_#211D29]">
                    {card.icon}
                  </span>
                  <span className="text-[10px] font-interface font-bold leading-tight">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-retro-stripes">
                  <div className="w-8 h-8 rounded-full border border-[#211D29] bg-[#FFF9EA] flex items-center justify-center font-display text-[10px] shadow-[1px_1px_0px_#211D29]">
                    ?
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
