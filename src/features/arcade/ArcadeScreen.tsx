import React, { useState } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, QuestType, QuestDuration } from '../../types/quest';
import { QUESTS_REGISTRY, ARCADE_IMAGE_URL } from '../../data/quests';
import { getRandomQuest } from '../discovery/engine';
import { Dices, Sparkles, RefreshCw, CheckCircle, ArrowRight, History, Settings2 } from 'lucide-react';

interface ArcadeScreenProps {
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  reducedMotion?: boolean;
  onSoundTrigger?: (type?: 'click' | 'chime' | 'fanfare' | 'pop') => void;
}

export const ArcadeScreen: React.FC<ArcadeScreenProps> = ({
  onSelectQuest,
  favorites,
  onToggleFavorite,
  reducedMotion = false,
  onSoundTrigger,
}) => {
  const [filterType, setFilterType] = useState<QuestType | 'either'>('either');
  const [filterDuration, setFilterDuration] = useState<QuestDuration | 'any'>('any');

  const [currentQuest, setCurrentQuest] = useState<Quest>(() => {
    return getRandomQuest(QUESTS_REGISTRY) || QUESTS_REGISTRY[0];
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [rollHistory, setRollHistory] = useState<string[]>([currentQuest.id]);
  const [pullCount, setPullCount] = useState(1);

  const handlePullLever = () => {
    if (isSpinning) return;
    onSoundTrigger?.('pop');
    setIsSpinning(true);

    const spinDuration = reducedMotion ? 150 : 750;

    setTimeout(() => {
      const nextQuest = getRandomQuest(
        QUESTS_REGISTRY,
        {
          type: filterType === 'either' ? null : filterType,
          duration: filterDuration === 'any' ? null : filterDuration,
        },
        {
          currentId: currentQuest.id,
          excludeIds: rollHistory.slice(-5), // Avoid the last 5 rolled quests
        }
      );

      if (nextQuest) {
        setCurrentQuest(nextQuest);
        setRollHistory((prev) => [nextQuest.id, ...prev].slice(0, 10));
        setPullCount((prev) => prev + 1);
      }

      setIsSpinning(false);
      onSoundTrigger?.('fanfare');
    }, spinDuration);
  };

  return (
    <div className="space-y-8 pb-12">
      <RetroWindow
        title="RANDOM_ARCADE_CABINET.ROM"
        headerColor="pink"
        shadowSize="xl"
        statusBadge={`CREDITS: ${99 - pullCount}`}
        footerContent={
          <div className="flex items-center justify-between w-full font-mono text-[10px]">
            <span>COIN-OP ENGINE: DETERMINISTIC PSEUDO-RANDOM</span>
            <span>UNAVAILABLE EXCLUDED: TRUE</span>
          </div>
        }
      >
        <div className="p-6 md:p-8 bg-retro-grid flex flex-col items-center text-center">
          {/* Top Arcade Marquee */}
          <div className="max-w-xl mb-6">
            <span className="font-mono text-xs text-[#F0449B] font-bold tracking-widest uppercase">
              ✦ SIGNATURE QUEST ROLLER ✦
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#211D29] mt-1">
              THE RANDOM MACHINE
            </h1>
            <p className="text-xs text-[#77717D] mt-2 font-body">
              Decision fatigue is real. Pull the retro lever and let fate pick your next bite-sized experiment.
            </p>
          </div>

          {/* Arcade Cabinet & Preset Filters */}
          <div className="w-full max-w-lg p-5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro-lg mb-6 text-left">
            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#211D29]/15 text-xs font-interface">
              <div className="flex items-center gap-1.5 font-bold text-[#211D29]">
                <Settings2 className="w-3.5 h-3.5 text-[#F0449B]" />
                <span>Roller Filters:</span>
              </div>

              {/* Space Preset */}
              <div className="flex gap-1">
                {[
                  { id: 'either', label: 'Any' },
                  { id: 'digital', label: 'Digital' },
                  { id: 'offline', label: 'Offline' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setFilterType(item.id as QuestType | 'either');
                    }}
                    className={`px-2 py-0.5 border border-[#211D29] text-[10px] ${
                      filterType === item.id
                        ? 'bg-[#211D29] text-white font-bold'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Duration Preset */}
              <div className="flex gap-1">
                {(['any', '2-5 min', '5-10 min'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setFilterDuration(dur);
                    }}
                    className={`px-2 py-0.5 border border-[#211D29] text-[10px] ${
                      filterDuration === dur
                        ? 'bg-[#F0449B] text-white font-bold'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {dur === 'any' ? 'Any Time' : dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Cabinet Visual & Lever */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-40 h-40 border-2 border-[#211D29] bg-black shadow-retro-sm overflow-hidden shrink-0">
                <img
                  src={ARCADE_IMAGE_URL}
                  alt="Arcade cabinet machine"
                  className={`w-full h-full object-cover transition-all ${
                    isSpinning && !reducedMotion ? 'animate-pulse scale-105' : ''
                  }`}
                />
                {isSpinning && (
                  <div className="absolute inset-0 bg-[#F0449B]/35 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Pull Lever CTA */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
                <div className="font-mono text-xs text-[#211D29] bg-[#FFE17B] px-2 py-0.5 border border-[#211D29] font-bold">
                  PULLS TODAY: {pullCount}
                </div>

                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={handlePullLever}
                  className={`px-6 py-3.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-sm tracking-wide btn-retro shadow-retro hover:brightness-105 flex items-center gap-2 ${
                    isSpinning ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Dices className={`w-5 h-5 ${isSpinning && !reducedMotion ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'SPINNING CARTRIDGES...' : 'PULL THE LEVER'}</span>
                </button>

                <span className="text-[11px] text-[#77717D] font-mono">
                  Guaranteed playable · No repetition
                </span>
              </div>
            </div>
          </div>

          {/* Result Card Presentation */}
          <div className="w-full max-w-md text-left">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F0449B]" />
                <span>The Machine Selected:</span>
              </span>
              <button
                type="button"
                onClick={handlePullLever}
                disabled={isSpinning}
                className="text-xs font-interface font-bold text-[#F0449B] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reroll Machine</span>
              </button>
            </div>

            <QuestCard
              quest={currentQuest}
              isFavorite={favorites.includes(currentQuest.id)}
              onSelect={onSelectQuest}
              onToggleFavorite={onToggleFavorite}
              onSoundTrigger={() => onSoundTrigger?.('click')}
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onSoundTrigger?.('fanfare');
                  onSelectQuest(currentQuest);
                }}
                className="flex-1 py-2.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro flex items-center justify-center gap-2 hover:brightness-105"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ACCEPT THIS QUEST</span>
              </button>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
};
