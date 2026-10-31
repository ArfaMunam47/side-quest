import React, { useState } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest } from '../../types/quest';
import { QUESTS_REGISTRY } from '../../data/quests';
import { TreePine, CheckCircle2, Heart, Sparkles, Smile, ShieldCheck } from 'lucide-react';

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
  onMarkCompleted,
  onSoundTrigger,
}) => {
  const offlineQuests = QUESTS_REGISTRY.filter((q) => q.type === 'offline');

  return (
    <div className="space-y-8 pb-12">
      <RetroWindow
        title="offline_sanctuary.exe"
        headerColor="yellow"
        shadowSize="lg"
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-interface font-semibold text-[#77717D] mb-1">
              <TreePine className="w-4 h-4 text-[#211D29]" />
              <span>SCREEN 09 · OFFLINE SANCTUARY</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl text-[#211D29]">
              REAL-WORLD SIDE QUESTS
            </h1>
            <p className="font-body text-sm text-[#39264F] mt-2 leading-relaxed">
              The ultimate anti-scroll mechanic is stepping away from the glass. These are zero-friction offline activities you can complete right where you are sitting.
            </p>
          </div>

          {/* Honor System Privacy Banner */}
          <div className="p-4 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] shadow-retro-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold font-interface">The 100% Honor System: </span>
              <span>
                No camera uploads, no GPS tracking, and no social clout checks. When you finish an activity, click "I Did This" on your own word.
              </span>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Grid of offline quests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
            AVAILABLE REAL-WORLD PROMPTS
          </h2>
          <span className="text-xs text-[#FFF9EA]/60">
            {completedQuests.filter((id) => offlineQuests.some((q) => q.id === id)).length} of {offlineQuests.length} completed
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
