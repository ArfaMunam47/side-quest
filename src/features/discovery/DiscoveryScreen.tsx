import React, { useState, useMemo } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, QuestCategory, QuestDuration, QuestDifficulty, QuestType, MoodType } from '../../types/quest';
import { QUESTS_REGISTRY, MOOD_OPTIONS } from '../../data/quests';
import { getRecommendedQuests } from './engine';
import { FolderTree, RefreshCw, Sparkles, Filter, Play, Search, AlertCircle, RotateCcw } from 'lucide-react';

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
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<QuestDuration | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestType | 'either'>('either');
  const [searchQuery, setSearchQuery] = useState('');
  const [seed, setSeed] = useState(0);

  const categories: { id: QuestCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Files' },
    { id: 'brain', label: 'Brain' },
    { id: 'creative', label: 'Creative' },
    { id: 'cozy', label: 'Cozy' },
    { id: 'curiosity', label: 'Curiosity' },
    { id: 'real-life', label: 'Real-World' },
  ];

  // Invoke discovery engine
  const recommendation = useMemo(() => {
    return getRecommendedQuests(
      QUESTS_REGISTRY,
      {
        category: selectedCategory === 'all' ? null : selectedCategory,
        mood: selectedMood === 'all' ? null : selectedMood,
        duration: selectedDuration === 'all' ? null : selectedDuration,
        difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty,
        type: selectedType === 'either' ? null : selectedType,
        searchQuery: searchQuery.trim() || null,
        includeComingSoon: false,
      },
      {
        limit: 6,
        seed,
        preferUnplayed: true,
      }
    );
  }, [selectedCategory, selectedMood, selectedDuration, selectedDifficulty, selectedType, searchQuery, seed]);

  const handleRefresh = () => {
    onSoundTrigger?.('chime');
    setSeed((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    onSoundTrigger?.('click');
    setSelectedCategory('all');
    setSelectedMood('all');
    setSelectedDuration('all');
    setSelectedDifficulty('all');
    setSelectedType('either');
    setSearchQuery('');
  };

  const { featured, suggested, totalMatches, isEmpty, fallbacksUsed, activeFiltersCount, fallbackReason } = recommendation;

  return (
    <div className="space-y-7 pb-12">
      {/* Top Radar Window with Engine Controls */}
      <RetroWindow
        title="QUEST_RADAR.EXE"
        headerColor="sky"
        shadowSize="lg"
        statusBadge={`${totalMatches} MATCHES`}
        footerContent={
          <div className="flex items-center justify-between w-full font-mono text-[10px]">
            <span>ENGINE: DETERMINISTIC LOCAL ENGINE</span>
            <span>{activeFiltersCount} FILTERS ACTIVE</span>
          </div>
        }
      >
        <div className="p-5 md:p-6 bg-retro-grid space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-interface font-semibold text-[#77717D] mb-0.5">
                <FolderTree className="w-4 h-4 text-[#83C9F5]" />
                <span>SCREEN 03 · DISCOVERY ENGINE</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl text-[#211D29]">
                QUEST DISCOVERY RADAR
              </h1>
              <p className="text-xs text-[#77717D] font-body">
                Curated activities matched to your current energy. No tracking, no infinite scroll.
              </p>
            </div>

            {/* Refresh and Search Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#77717D] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keyword search..."
                  className="w-full pl-8 pr-2.5 py-1.5 border-2 border-[#211D29] bg-white text-xs font-interface text-[#211D29] placeholder:text-[#77717D] focus:outline-none shadow-retro-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="px-3.5 py-1.5 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm flex items-center gap-1.5 shrink-0"
                title="Shuffle recommended batch"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 border-2 border-[#211D29] bg-[#FFF9EA]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSoundTrigger?.('click');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 text-xs font-interface font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#211D29] text-[#FFF9EA] shadow-[1px_1px_0px_#211D29]'
                    : 'text-[#211D29] hover:bg-[#FFE17B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Filter Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-interface">
            {/* Mood Filter */}
            <div>
              <span className="block font-bold text-[#211D29] mb-1">
                Mood Filter:
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    setSelectedMood('all');
                  }}
                  className={`px-2 py-0.5 border border-[#211D29] text-[11px] ${
                    selectedMood === 'all'
                      ? 'bg-[#211D29] text-white font-bold'
                      : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                  }`}
                >
                  All Moods
                </button>
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedMood(m.id);
                    }}
                    className={`px-2 py-0.5 border border-[#211D29] text-[11px] capitalize ${
                      selectedMood === m.id
                        ? 'bg-[#F0449B] text-white font-bold'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <span className="block font-bold text-[#211D29] mb-1">
                Duration:
              </span>
              <div className="flex flex-wrap gap-1">
                {(['all', '2-5 min', '5-10 min', '10-15 min'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedDuration(dur);
                    }}
                    className={`px-2 py-0.5 border border-[#211D29] text-[11px] ${
                      selectedDuration === dur
                        ? 'bg-[#211D29] text-white font-bold'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {dur === 'all' ? 'Any Time' : dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Space (Digital vs Offline) */}
            <div>
              <span className="block font-bold text-[#211D29] mb-1">
                Space:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'either', label: 'Either' },
                  { id: 'digital', label: 'Digital' },
                  { id: 'offline', label: 'Real-World' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setSelectedType(item.id as QuestType | 'either');
                    }}
                    className={`px-2 py-0.5 border border-[#211D29] text-[11px] ${
                      selectedType === item.id
                        ? 'bg-[#211D29] text-white font-bold'
                        : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Status & Reset */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-[#211D29]/15 text-xs text-[#77717D]">
              <span>
                Filtered down to <strong className="text-[#211D29]">{totalMatches}</strong> exact activities
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 font-bold text-[#F0449B] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>
      </RetroWindow>

      {/* Fallback Banner for Empty State with Alternatives */}
      {fallbacksUsed && (
        <div className="p-4 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] shadow-retro flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#211D29] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-interface font-bold text-sm">
                No Exact Matches for this Filter Combination
              </h3>
              <p className="text-xs font-body mt-0.5">
                {fallbackReason || 'We relaxed duration and difficulty constraints to recommend these cozy alternatives.'}
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

      {/* Featured Recommendation from Engine */}
      {featured && (
        <RetroWindow
          title="RECOMMENDED_FLAGSHIP.BOX"
          headerColor="mint"
          shadowSize="md"
          statusBadge={fallbacksUsed ? 'CURATED PICK' : 'TOP MATCH'}
        >
          <div className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-56 aspect-[4/3] border-2 border-[#211D29] shadow-retro overflow-hidden shrink-0 bg-[#39264F]">
              <img
                src={featured.thumbnail}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2 text-xs text-[#77717D] font-interface">
                <span className="font-bold uppercase text-[#211D29]">
                  {featured.category}
                </span>
                <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                <span>{featured.type}</span>
                <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                <span>{featured.duration}</span>
                <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                <span className="capitalize">{featured.difficulty}</span>
              </div>

              <h2 className="font-interface font-bold text-xl text-[#211D29]">
                {featured.title}
              </h2>

              <p className="text-xs text-[#77717D] leading-relaxed font-body">
                {featured.description}
              </p>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('chime');
                    onSelectQuest(featured);
                  }}
                  className="px-5 py-2 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-2 hover:brightness-105"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start This Quest</span>
                </button>
              </div>
            </div>
          </div>
        </RetroWindow>
      )}

      {/* Suggested Quests Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
              {fallbacksUsed ? 'CURATED SUGGESTIONS' : 'MATCHED QUEST DECK'}
            </h2>
            <span className="text-xs text-[#FFF9EA]/60 font-mono">
              · [{suggested.length} ACTIVITIES]
            </span>
          </div>

          <span className="text-xs text-[#FFF9EA]/60 font-interface">
            No infinite scroll · Curated batch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggested.map((quest) => (
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
