import React from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, AccessibilitySettings, UserPreferences } from '../../types/quest';
import { QUESTS_REGISTRY } from '../../data/quests';
import { BookmarkCheck, Heart, History, SlidersHorizontal, Trash2, CheckCircle2 } from 'lucide-react';

interface MySpaceScreenProps {
  preferences: UserPreferences;
  onSelectQuest: (quest: Quest) => void;
  onToggleFavorite: (questId: string) => void;
  onUpdateAccessibility: (updates: Partial<AccessibilitySettings>) => void;
  onClearAllData: () => void;
  onOpenAccessibilityModal: () => void;
  onSoundTrigger?: (type?: 'click' | 'chime' | 'fanfare') => void;
}

export const MySpaceScreen: React.FC<MySpaceScreenProps> = ({
  preferences,
  onSelectQuest,
  onToggleFavorite,
  onUpdateAccessibility,
  onClearAllData,
  onOpenAccessibilityModal,
  onSoundTrigger,
}) => {
  const favoriteQuests = QUESTS_REGISTRY.filter((q) =>
    preferences.favorites.includes(q.id)
  );

  const recentQuests = preferences.recentlyPlayed
    .map((id) => QUESTS_REGISTRY.find((q) => q.id === id))
    .filter((q): q is Quest => Boolean(q));

  const completedCount = preferences.completedQuests.length;

  return (
    <div className="space-y-8 pb-12">
      <RetroWindow
        title="guest_locker.usr"
        headerColor="purple"
        shadowSize="lg"
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-interface font-semibold text-[#77717D] mb-1">
                <BookmarkCheck className="w-4 h-4 text-[#F0449B]" />
                <span>SCREEN 08 · PRIVATE GUEST SPACE</span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl text-[#211D29]">
                MY SIDE QUEST LOCKER
              </h1>
              <p className="font-body text-xs text-[#77717D] mt-1">
                Your private sandbox. We don't store your data in the cloud—everything lives right here in your browser.
              </p>
            </div>

            {/* Quick stats badge */}
            <div className="flex gap-2 text-xs font-interface">
              <div className="p-2.5 border-2 border-[#211D29] bg-[#FFE17B] text-center shadow-retro-sm">
                <span className="block font-mono text-base font-bold text-[#211D29]">
                  {preferences.favorites.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#77717D]">
                  Favorites
                </span>
              </div>
              <div className="p-2.5 border-2 border-[#211D29] bg-[#A8E8C2] text-center shadow-retro-sm">
                <span className="block font-mono text-base font-bold text-[#211D29]">
                  {completedCount}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#77717D]">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenAccessibilityModal}
              className="px-3.5 py-1.5 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-[#211D29] text-xs font-interface font-bold btn-retro shadow-retro-sm flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Accessibility & Text Settings</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all saved quests and preferences?')) {
                  onClearAllData();
                  onSoundTrigger?.('chime');
                }
              }}
              className="px-3.5 py-1.5 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#F0449B] hover:text-white text-[#211D29] text-xs font-interface font-bold btn-retro shadow-retro-sm flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>
          </div>
        </div>
      </RetroWindow>

      {/* Favorites Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-[#F0449B] fill-current" />
          <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
            SAVED FAVORITES ({favoriteQuests.length})
          </h2>
        </div>

        {favoriteQuests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isFavorite={true}
                onSelect={onSelectQuest}
                onToggleFavorite={onToggleFavorite}
                onSoundTrigger={() => onSoundTrigger?.('click')}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-[#211D29] bg-[#FFF9EA] text-center shadow-retro">
            <p className="font-interface font-bold text-sm text-[#211D29]">
              No favorites saved yet.
            </p>
            <p className="text-xs text-[#77717D] mt-1">
              Click the little heart icon on any quest card to save it here for quick access.
            </p>
          </div>
        )}
      </div>

      {/* Recently Played / Explored */}
      {recentQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#83C9F5]" />
            <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
              RECENTLY EXPLORED
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isFavorite={preferences.favorites.includes(quest.id)}
                onSelect={onSelectQuest}
                onToggleFavorite={onToggleFavorite}
                onSoundTrigger={() => onSoundTrigger?.('click')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
