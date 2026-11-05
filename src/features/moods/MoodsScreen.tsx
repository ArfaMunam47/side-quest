import React, { useState, useMemo } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, MoodType, QuestDuration, QuestDifficulty, QuestType } from '../../types/quest';
import { MOOD_OPTIONS, QUESTS_REGISTRY } from '../../data/quests';
import { getRecommendedQuests } from '../discovery/engine';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';

interface MoodsScreenProps {
  initialMood?: MoodType;
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime') => void;
}

export const MoodsScreen: React.FC<MoodsScreenProps> = ({
  initialMood,
  onSelectQuest,
  favorites,
  onToggleFavorite,
  onSoundTrigger,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(initialMood || null);
  const [selectedDuration, setSelectedDuration] = useState<QuestDuration | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | null>(null);
  const [selectedType, setSelectedType] = useState<QuestType | 'either'>('either');

  const handleResetFilters = () => {
    onSoundTrigger?.('click');
    setSelectedMood(null);
    setSelectedDuration(null);
    setSelectedDifficulty(null);
    setSelectedType('either');
  };

  // Run discovery engine recommendation
  const recommendation = useMemo(() => {
    return getRecommendedQuests(
      QUESTS_REGISTRY,
      {
        mood: selectedMood,
        duration: selectedDuration,
        difficulty: selectedDifficulty,
        type: selectedType === 'either' ? null : selectedType,
        includeComingSoon: false,
      },
      {
        limit: 8,
        preferUnplayed: true,
      }
    );
  }, [selectedMood, selectedDuration, selectedDifficulty, selectedType]);

  const { featured, suggested, totalMatches, activeFiltersCount } = recommendation;
  const allShown = featured ? [featured, ...suggested.filter((q) => q.id !== featured.id)] : suggested;

  return (
    <div className="space-y-8 pb-12">
      {/* Header window */}
      <RetroWindow
        title="MOOD_COMPASS.CONFIG"
        headerColor="purple"
        shadowSize="lg"
        statusBadge={selectedMood ? `MOOD: ${selectedMood.toUpperCase()}` : 'ALL MOODS'}
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-interface font-bold text-[#F0449B]">
              <Compass className="w-4 h-4" />
              <span>MOOD COMPASS</span>
            </div>
            <h1 className="font-interface font-bold text-2xl sm:text-3xl text-[#211D29] leading-tight">
              WHAT KIND OF MOOD ARE WE IN?
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#57525E] leading-relaxed">
              Pick a state of mind to get matching quests. All filters are optional — pick as much or as little as you want.
            </p>
          </div>

          {/* 1. Mood Cards */}
          <div>
            <span className="block font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] mb-3">
              Select Your State of Mind:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedMood(isSelected ? null : mood.id);
                    }}
                    className={`p-3.5 text-left border-2 border-[#211D29] transition-all btn-retro flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-[#F0449B] text-white shadow-retro'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B] shadow-retro-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-3 h-3 rounded-full border border-[#211D29]"
                        style={{ backgroundColor: mood.color }}
                      />
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-interface font-bold text-sm block">
                        {mood.label}
                      </span>
                      <span
                        className={`text-[10px] font-body line-clamp-1 block mt-0.5 ${
                          isSelected ? 'text-white/90' : 'text-[#57525E]'
                        }`}
                      >
                        {mood.tagline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Secondary Filter Selectors */}
          <div className="pt-4 border-t-2 border-[#211D29]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-interface">
            <div className="flex flex-wrap items-center gap-4">
              {/* Type Switcher */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#211D29]">Type:</span>
                <div className="flex gap-1">
                  {[
                    { id: 'either', label: 'Any' },
                    { id: 'digital', label: 'Digital' },
                    { id: 'offline', label: 'Offline' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedType(t.id as QuestType | 'either');
                      }}
                      className={`px-2.5 py-1 border border-[#211D29] text-xs transition-colors ${
                        selectedType === t.id
                          ? 'bg-[#211D29] text-white font-bold'
                          : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Switcher */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#211D29]">Time:</span>
                <div className="flex gap-1">
                  {(['2-5 min', '5-10 min', '10-15 min'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedDuration(selectedDuration === dur ? null : dur);
                      }}
                      className={`px-2.5 py-1 border border-[#211D29] text-xs transition-colors ${
                        selectedDuration === dur
                          ? 'bg-[#F0449B] text-white font-bold'
                          : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Switcher */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#211D29]">Difficulty:</span>
                <div className="flex gap-1">
                  {(['easy', 'medium', 'challenging'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedDifficulty(selectedDifficulty === diff ? null : diff);
                      }}
                      className={`capitalize px-2.5 py-1 border border-[#211D29] text-xs transition-colors ${
                        selectedDifficulty === diff
                          ? 'bg-[#FFE17B] text-[#211D29] font-bold'
                          : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1 border border-[#211D29] bg-white hover:bg-[#F0449B] hover:text-white text-xs font-interface font-bold flex items-center gap-1.5 transition-colors shadow-retro-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>
      </RetroWindow>

      {/* Results Header & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#211D29]/20 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F0449B]" />
            <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
              MATCHING EXPERIENCES
            </h2>
            <span className="text-xs text-[#FFF9EA]/70 font-mono">
              ({totalMatches} available)
            </span>
          </div>
        </div>

        {allShown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allShown.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isFavorite={favorites.includes(quest.id)}
                onSelect={onSelectQuest}
                onToggleFavorite={onToggleFavorite}
                onSoundTrigger={() => onSoundTrigger?.('click')}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-[#211D29] bg-[#FFF9EA] text-center shadow-retro space-y-3">
            <p className="font-interface font-bold text-base text-[#211D29]">
              No quests matched all selected filters
            </p>
            <p className="font-body text-xs text-[#57525E]">
              Try clearing a filter or picking another mood to explore more activities.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 border-2 border-[#211D29] bg-[#FFE17B] text-xs font-interface font-bold btn-retro shadow-retro-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
