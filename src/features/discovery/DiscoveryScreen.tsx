import React, { useState, useMemo } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, QuestCategory, QuestDuration, QuestDifficulty, QuestType, MoodType } from '../../types/quest';
import { QUESTS_REGISTRY } from '../../data/quests';
import { getRecommendedQuests } from './engine';
import { FolderTree, RefreshCw, Sparkles, Search, RotateCcw, Clock, Zap } from 'lucide-react';

interface DiscoveryScreenProps {
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime') => void;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  onSelectQuest,
  favorites,
  onToggleFavorite,
  onSoundTrigger,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<QuestDuration | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestType | 'either'>('either');
  const [searchQuery, setSearchQuery] = useState('');
  const [seed, setSeed] = useState(0);

  const categories: { id: QuestCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'brain', label: 'Brain Puzzles' },
    { id: 'creative', label: 'Creative' },
    { id: 'cozy', label: 'Cozy & Zen' },
    { id: 'curiosity', label: 'Curiosity' },
    { id: 'real-life', label: 'Offline' },
  ];

  // Invoke discovery engine
  const recommendation = useMemo(() => {
    return getRecommendedQuests(
      QUESTS_REGISTRY,
      {
        category: selectedCategory === 'all' ? null : selectedCategory,
        duration: selectedDuration === 'all' ? null : selectedDuration,
        difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty,
        type: selectedType === 'either' ? null : selectedType,
        searchQuery: searchQuery.trim() || null,
        includeComingSoon: false,
      },
      {
        limit: 8,
        seed,
        preferUnplayed: true,
      }
    );
  }, [selectedCategory, selectedDuration, selectedDifficulty, selectedType, searchQuery, seed]);

  const handleRefresh = () => {
    onSoundTrigger?.('chime');
    setSeed((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    onSoundTrigger?.('click');
    setSelectedCategory('all');
    setSelectedDuration('all');
    setSelectedDifficulty('all');
    setSelectedType('either');
    setSearchQuery('');
  };

  const { featured, suggested, totalMatches, activeFiltersCount } = recommendation;
  const allShown = featured ? [featured, ...suggested.filter((q) => q.id !== featured.id)] : suggested;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Radar Window */}
      <RetroWindow
        title="QUEST_DISCOVERY_RADAR.EXE"
        headerColor="sky"
        shadowSize="lg"
        statusBadge={`${totalMatches} MATCHES`}
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-interface font-bold text-[#211D29]">
                <FolderTree className="w-4 h-4 text-[#F0449B]" />
                <span>ACTIVITY DISCOVERY</span>
              </div>
              <h1 className="font-interface font-bold text-2xl sm:text-3xl text-[#211D29] leading-tight">
                QUEST RADAR
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#57525E] leading-relaxed">
                Filter by interest, duration, or physical versus digital. Find a bite-sized experiment to reset your attention.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#57525E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities or tags..."
                className="w-full pl-9 pr-3 py-2.5 border-2 border-[#211D29] bg-white text-xs font-interface text-[#211D29] placeholder:text-[#57525E] focus:outline-none shadow-retro-sm"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div>
            <span className="block font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] mb-2.5">
              Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 border-2 border-[#211D29] font-interface text-xs font-bold transition-all btn-retro ${
                    selectedCategory === cat.id
                      ? 'bg-[#F0449B] text-white shadow-retro'
                      : 'bg-white text-[#211D29] hover:bg-[#FFE17B] shadow-retro-sm'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters Row */}
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
                  {(['all', '2-5 min', '5-10 min', '10-15 min'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedDuration(dur);
                      }}
                      className={`px-2.5 py-1 border border-[#211D29] text-xs transition-colors ${
                        selectedDuration === dur
                          ? 'bg-[#F0449B] text-white font-bold'
                          : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                      }`}
                    >
                      {dur === 'all' ? 'Any' : dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Switcher */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#211D29]">Difficulty:</span>
                <div className="flex gap-1">
                  {(['all', 'easy', 'medium', 'challenging'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        onSoundTrigger?.('click');
                        setSelectedDifficulty(diff);
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="px-3 py-1 border border-[#211D29] bg-white hover:bg-[#FFE17B] text-xs font-interface font-bold flex items-center gap-1.5 transition-colors shadow-retro-sm"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Shuffle</span>
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1 border border-[#211D29] bg-white hover:bg-[#F0449B] hover:text-white text-xs font-interface font-bold flex items-center gap-1.5 transition-colors shadow-retro-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Grid of Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#211D29]/20 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F0449B]" />
            <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
              RADAR RESULTS
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
              No activities matched your search criteria
            </p>
            <p className="font-body text-xs text-[#57525E]">
              Try clearing filters or search terms to uncover more activities.
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
