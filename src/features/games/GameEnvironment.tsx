import React, { useState } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { Quest, ScreenId } from '../../types/quest';
import { MemoryMatchGame } from './MemoryMatch/MemoryMatchGame';
import { PixelStudioGame } from './PixelStudio/PixelStudioGame';
import { WordHuntGame } from './WordHunt/WordHuntGame';
import { TinyGardenGame } from './TinyGarden/TinyGardenGame';
import { OneLineJournalGame } from './OneLineJournal/OneLineJournalGame';
import {
  ArrowLeft,
  HelpCircle,
  Trophy,
  Heart,
  Sparkles,
  RotateCcw,
  Compass,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface GameEnvironmentProps {
  quest: Quest;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  isFavorite: boolean;
  onToggleFavorite: (questId: string) => void;
  onMarkCompleted: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

export const GameEnvironment: React.FC<GameEnvironmentProps> = ({
  quest,
  onBack,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  onMarkCompleted,
  onSoundTrigger,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<string | null>(null);

  const handleGameComplete = (details?: { moves?: number; pairs?: number }) => {
    onMarkCompleted(quest.id);
    onSoundTrigger?.('fanfare');

    if (details?.moves) {
      setCompletionStats(`Completed in ${details.moves} moves!`);
    } else {
      setCompletionStats(null);
    }
    setIsCompletedModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Game Navigation & Action Bar */}
      <div className="p-3.5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              onBack();
            }}
            className="px-3 py-1.5 border-2 border-[#211D29] bg-white hover:bg-[#FFE17B] text-xs font-interface font-bold btn-retro shadow-retro-sm flex items-center gap-1.5 text-[#211D29]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Playground</span>
          </button>

          <div>
            <h1 className="font-interface font-bold text-base text-[#211D29] leading-tight">
              {quest.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#77717D]">
              <span className="uppercase font-bold text-[#F0449B]">{quest.category}</span>
              <span aria-hidden="true">·</span>
              <span>{quest.duration}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{quest.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Right: Favorite, Instructions & Help */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              onToggleFavorite(quest.id);
            }}
            className={`p-1.5 border-2 border-[#211D29] btn-retro shadow-retro-sm ${
              isFavorite
                ? 'bg-[#F0449B] text-white'
                : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              setShowInstructions(!showInstructions);
            }}
            className={`px-3 py-1.5 border-2 border-[#211D29] text-xs font-interface font-bold btn-retro shadow-retro-sm flex items-center gap-1.5 ${
              showInstructions
                ? 'bg-[#FFE17B] text-[#211D29]'
                : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Instructions</span>
          </button>
        </div>
      </div>

      {/* Instructions Drawer (Collapsible) */}
      {showInstructions && (
        <RetroWindow
          title="HOW_TO_PLAY.TXT"
          headerColor="yellow"
          shadowSize="md"
          onClose={() => setShowInstructions(false)}
        >
          <div className="p-5 bg-[#FFF9EA] space-y-3 text-xs font-body text-[#211D29]">
            <p className="font-semibold">{quest.description}</p>
            <ol className="space-y-1.5 pl-4 list-decimal">
              {quest.instructions.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            {quest.accessibilityNotes && quest.accessibilityNotes.length > 0 && (
              <p className="pt-2 border-t border-[#211D29]/15 text-[11px] font-mono text-[#77717D]">
                Accessibility: {quest.accessibilityNotes.join(' · ')}
              </p>
            )}
          </div>
        </RetroWindow>
      )}

      {/* Main Game Module Canvas */}
      <div className="relative">
        {quest.gameKey === 'memory-match' && (
          <MemoryMatchGame
            onComplete={handleGameComplete}
            onSoundTrigger={onSoundTrigger}
          />
        )}

        {quest.gameKey === 'pixel-studio' && (
          <PixelStudioGame
            onComplete={handleGameComplete}
            onSoundTrigger={onSoundTrigger}
          />
        )}

        {quest.gameKey === 'word-hunt' && (
          <WordHuntGame
            onComplete={handleGameComplete}
            onSoundTrigger={onSoundTrigger}
          />
        )}

        {quest.gameKey === 'tiny-garden' && (
          <TinyGardenGame
            onComplete={handleGameComplete}
            onSoundTrigger={onSoundTrigger}
          />
        )}

        {quest.gameKey === 'one-line-journal' && (
          <OneLineJournalGame
            onComplete={handleGameComplete}
            onSoundTrigger={onSoundTrigger}
          />
        )}
      </div>

      {/* SCREEN 07 — COMPLETION SCREEN MODAL */}
      {isCompletedModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211D29]/75 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md">
            <RetroWindow
              title="QUEST_COMPLETE.EXE"
              headerColor="pink"
              shadowSize="xl"
              onClose={() => setIsCompletedModalOpen(false)}
            >
              <div className="p-6 md:p-8 bg-[#FFF9EA] text-center space-y-5 text-[#211D29]">
                {/* Celebratory Icon */}
                <div className="w-16 h-16 mx-auto border-2 border-[#211D29] bg-[#FFE17B] flex items-center justify-center shadow-retro">
                  <Sparkles className="w-8 h-8 text-[#F0449B] animate-pulse" />
                </div>

                <div>
                  <h2 className="font-display text-xl sm:text-2xl text-[#211D29]">
                    QUEST COMPLETED!
                  </h2>
                  <p className="font-body text-xs text-[#77717D] mt-1.5 leading-relaxed">
                    You stepped away from the algorithmic feed and took time for your curious mind.
                  </p>
                </div>

                {completionStats && (
                  <div className="p-2.5 border border-[#211D29] bg-white font-mono text-xs font-bold text-[#211D29]">
                    {completionStats}
                  </div>
                )}

                {/* Friendly no-guilt message */}
                <div className="p-3 border-2 border-[#211D29] bg-[#A8E8C2] text-xs font-interface text-[#211D29] shadow-retro-sm">
                  <span>✦ Progress saved to your private local locker. No streaks, no pressure.</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setIsCompletedModalOpen(false);
                      onNavigate('arcade');
                    }}
                    className="w-full py-2.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro hover:brightness-105"
                  >
                    Try Another Random Quest
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('click');
                      setIsCompletedModalOpen(false);
                      onBack();
                    }}
                    className="w-full py-2.5 border-2 border-[#211D29] bg-white text-[#211D29] hover:bg-[#FFE17B] font-interface font-bold text-xs btn-retro shadow-retro-sm"
                  >
                    Return to Playground
                  </button>
                </div>
              </div>
            </RetroWindow>
          </div>
        </div>
      )}
    </div>
  );
};
