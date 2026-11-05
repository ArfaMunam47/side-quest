import React from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest } from '../../types/quest';
import { QUESTS_REGISTRY } from '../../data/quests';
import { TreePine, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RealLifeScreenProps {
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  completedQuests: string[];
  onMarkCompleted: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'chime' | 'fanfare') => void;
}

export const RealLifeScreen: React.FC<RealLifeScreenProps> = ({
  onSelectQuest,
  favorites,
  onToggleFavorite,
  completedQuests,
  onSoundTrigger,
}) => {
  const offlineQuests = QUESTS_REGISTRY.filter((q) => q.type === 'offline');
  const completedCount = completedQuests.filter((id) => offlineQuests.some((q) => q.id === id)).length;

  return (
    <div className="space-y-8 pb-12">
      <RetroWindow
        title="OFFLINE_SANCTUARY.TXT"
        headerColor="yellow"
        shadowSize="lg"
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-5">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-interface font-bold text-[#211D29]">
              <TreePine className="w-4 h-4 text-[#211D29]" />
              <span>MINDFUL REAL-WORLD BREAKS</span>
            </div>
            <h1 className="font-interface font-bold text-2xl sm:text-3xl text-[#211D29] leading-tight">
              REAL-WORLD SIDE QUESTS
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#39264F] leading-relaxed">
              The ultimate anti-scroll alternative is stepping away from the glass.
              These are peaceful, zero-pressure offline prompts you can finish right where you are sitting in 2 to 10 minutes.
            </p>
          </div>

          {/* 100% Honor System Banner */}
          <div className="p-4 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] shadow-retro-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#211D29]" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold font-interface block">The 100% Honor System:</span>
              <span className="font-body text-[#211D29]/90">
                No camera uploads, no location tracking, and no social check-ins. When you finish an activity, click "Mark Completed" on your own word.
              </span>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Grid of offline quests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#211D29]/20 pb-2">
          <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
            AVAILABLE REAL-WORLD PROMPTS
          </h2>
          <span className="text-xs text-[#FFF9EA]/70 font-mono">
            {completedCount} of {offlineQuests.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offlineQuests.map((quest) => {
            const isDone = completedQuests.includes(quest.id);
            return (
              <div key={quest.id} className="relative">
                <QuestCard
                  quest={quest}
                  isFavorite={favorites.includes(quest.id)}
                  onSelect={onSelectQuest}
                  onToggleFavorite={onToggleFavorite}
                  onSoundTrigger={() => onSoundTrigger?.('click')}
                />
                {isDone && (
                  <div className="absolute top-2 right-12 z-10 flex items-center gap-1 bg-[#A8E8C2] text-[#211D29] px-2 py-0.5 border border-[#211D29] text-[10px] font-interface font-bold shadow-retro-sm">
                    <CheckCircle2 className="w-3 h-3 text-[#211D29]" />
                    <span>Done</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
