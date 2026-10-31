import React, { useState, useMemo } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, MoodType, QuestDuration, QuestDifficulty, QuestType } from '../../types/quest';
import { MOOD_OPTIONS, QUESTS_REGISTRY } from '../../data/quests';
import { filterQuests, getRecommendedQuests } from '../discovery/engine';
import { Compass, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';

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

  const { featured, suggested, totalMatches, isEmpty, fallbacksUsed, activeFiltersCount, fallbackReason } = recommendation;
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
        <div className="p-6 bg-retro-grid space-y-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-interface font-semibold text-[#77717D] mb-1">
              <Compass className="w-4 h-4 text-[#F0449B]" />
              <span>SCREEN 02 · MOOD TUNER</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl text-[#211D29]">
              WHAT KIND OF MOOD ARE WE IN?
            </h1>
            <p className="font-body text-sm text-[#77717D] mt-1">
              Pick a vibe to get matching quests. All filters are optional—pick as much or as little as you want.
            </p>
          </div>

          {/* 1. Mood Cards */}
          <div>
            <span className="block font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] mb-2.5">
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
                    className={`p-3 text-left border-2 border-[#211D29] transition-all btn-retro ${
                      isSelected
                        ? 'bg-[#F0449B] text-white shadow-retro translate-x-0.5 translate-y-0.5'
                        : 'bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B] shadow-retro-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-interface font-bold text-sm">
                        {mood.label}
                      </span>
                      <span
                        className="w-3 h-3 rounded-full border border-[#211D29]"
                        style={{ backgroundColor: mood.color }}
                      ></span>
                    </div>
                    <span
                      className={`text-[10px] block leading-tight ${
                        isSelected ? 'text-white/85' : 'text-[#77717D]'
                      }`}
                    >
                      {mood.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Optional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-[#211D29]/15">
            {/* Duration */}
            <div>
              <span className="block font-interface font-bold text-xs text-[#211D29] mb-2">
                Duration (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['2-5 min', '5-10 min', '10-15 min'] as QuestDuration[]).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedDuration(selectedDuration === dur ? null : dur);
                    }}
                    className={`px-2.5 py-1 text-xs border border-[#211D29] font-interface font-medium transition-colors ${
                      selectedDuration === dur
                        ? 'bg-[#211D29] text-white'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <span className="block font-interface font-bold text-xs text-[#211D29] mb-2">
                Difficulty (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['easy', 'medium', 'challenging'] as QuestDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedDifficulty(selectedDifficulty === diff ? null : diff);
                    }}
                    className={`px-2.5 py-1 text-xs border border-[#211D29] font-interface font-medium capitalize transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-[#211D29] text-white'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Type */}
            <div>
              <span className="block font-interface font-bold text-xs text-[#211D29] mb-2">
                Space (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'either', label: 'Either' },
                  { id: 'digital', label: 'Digital Game' },
                  { id: 'offline', label: 'Real World' },
                ].map((typeItem) => (
                  <button
                    key={typeItem.id}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedType(typeItem.id as QuestType | 'either');
                    }}
                    className={`px-2.5 py-1 text-xs border border-[#211D29] font-interface font-medium transition-colors ${
                      selectedType === typeItem.id
                        ? 'bg-[#211D29] text-white'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {typeItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters & Count */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#77717D]">
              Showing <strong className="text-[#211D29]">{totalMatches}</strong> exact activities
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-interface font-semibold text-[#F0449B] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>
      </RetroWindow>

      {/* Fallback Banner if no exact matches */}
      {fallbacksUsed && (
        <div className="p-4 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] shadow-retro flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#211D29] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-interface font-bold text-sm">
                No Exact Matches for this Specific Filter Combination
              </h3>
              <p className="text-xs font-body mt-0.5">
                {fallbackReason || 'We relaxed some constraints to recommend these curated activities.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-1 border-2 border-[#211D29] bg-white hover:bg-[#F0449B] hover:text-white text-xs font-interface font-bold btn-retro shrink-0 shadow-retro-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Matched Quests Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
            {fallbacksUsed ? 'CURATED ALTERNATIVES' : 'MATCHED ACTIVITIES'}
          </h2>
          <span className="text-xs text-[#FFF9EA]/60 font-mono">
            · [{allShown.length} ACTIVITIES]
          </span>
        </div>

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
      </div>
    </div>
  );
};
