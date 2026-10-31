import React, { useState, useMemo } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, QuestCategory } from '../../types/quest';
import { QUESTS_REGISTRY } from '../../data/quests';
import { filterQuests } from '../discovery/engine';
import { Sparkles, Search, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface LibraryScreenProps {
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime') => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  onSelectQuest,
  favorites,
  onToggleFavorite,
  onSoundTrigger,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty'>('title');

  const categories: { id: QuestCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Files', count: QUESTS_REGISTRY.length },
    {
      id: 'brain',
      label: 'Brain Quests',
      count: QUESTS_REGISTRY.filter((q) => q.category === 'brain').length,
    },
    {
      id: 'creative',
      label: 'Creative Quests',
      count: QUESTS_REGISTRY.filter((q) => q.category === 'creative').length,
    },
    {
      id: 'cozy',
      label: 'Cozy Quests',
      count: QUESTS_REGISTRY.filter((q) => q.category === 'cozy').length,
    },
    {
      id: 'curiosity',
      label: 'Curiosity Quests',
      count: QUESTS_REGISTRY.filter((q) => q.category === 'curiosity').length,
    },
    {
      id: 'real-life',
      label: 'Real-Life Quests',
      count: QUESTS_REGISTRY.filter((q) => q.category === 'real-life').length,
    },
  ];

  // Use the engine filterQuests
  const filteredQuests = useMemo(() => {
    const list = filterQuests(QUESTS_REGISTRY, {
      category: activeCategory === 'all' ? null : activeCategory,
      searchQuery: searchQuery.trim() || null,
      includeComingSoon: true, // In full archive, show all registered files
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      if (sortBy === 'difficulty') return a.difficulty.localeCompare(b.difficulty);
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      <RetroWindow
        title="QUEST_ARCHIVE_EXPLORER.EXE"
        headerColor="yellow"
        shadowSize="lg"
        statusBadge={`${filteredQuests.length} OF ${QUESTS_REGISTRY.length} ITEMS`}
      >
        <div className="p-6 bg-retro-grid space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-interface font-semibold text-[#77717D] mb-1">
                <Sparkles className="w-4 h-4 text-[#F0449B]" />
                <span>SCREEN 05 · COMPLETE CATALOG</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl text-[#211D29]">
                QUEST ARCHIVE DIRECTORY
              </h1>
              <p className="text-xs text-[#77717D] mt-1 font-body">
                Explore our full library of interactive digital toys and mindful offline prompts.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#77717D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, tag, or topic..."
                className="w-full pl-9 pr-3 py-2 border-2 border-[#211D29] bg-white text-xs font-interface text-[#211D29] placeholder:text-[#77717D] focus:outline-none shadow-retro-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSoundTrigger?.('click');
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 border-2 border-[#211D29] font-interface text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#F0449B] text-white shadow-retro'
                    : 'bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 text-[10px] opacity-80">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="pt-2 border-t border-[#211D29]/15 flex items-center justify-between text-xs text-[#77717D]">
            <span>
              Showing <strong className="text-[#211D29]">{filteredQuests.length}</strong> of {QUESTS_REGISTRY.length} registered activities
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#211D29]" />
              <span className="font-semibold text-[#211D29]">Sort by:</span>
              {(['title', 'duration', 'difficulty'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    setSortBy(s);
                  }}
                  className={`capitalize px-2 py-0.5 border border-[#211D29] ${
                    sortBy === s
                      ? 'bg-[#211D29] text-white font-bold'
                      : 'bg-white hover:bg-[#FFE17B]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredQuests.map((quest) => (
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
        <div className="p-8 border-2 border-[#211D29] bg-[#FFF9EA] text-center shadow-retro">
          <p className="font-interface font-bold text-base text-[#211D29]">
            No quests matched your search query "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 px-4 py-2 border-2 border-[#211D29] bg-[#FFE17B] text-xs font-interface font-bold btn-retro shadow-retro-sm"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
