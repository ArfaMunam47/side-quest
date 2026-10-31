import React, { useState } from 'react';
import { RetroWindow } from './RetroWindow';
import { Quest } from '../../types/quest';
import {
  Clock,
  Zap,
  Compass,
  Heart,
  CheckCircle,
  Sparkles,
  ExternalLink,
  TreePine,
  ShieldCheck,
} from 'lucide-react';

interface QuestDetailModalProps {
  quest: Quest | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (questId: string) => void;
  isCompleted: boolean;
  onMarkCompleted: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'chime' | 'fanfare') => void;
  onLaunchGame?: (quest: Quest) => void;
}

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  onClose,
  isFavorite,
  onToggleFavorite,
  isCompleted,
  onMarkCompleted,
  onSoundTrigger,
  onLaunchGame,
}) => {
  const [offlineCompleted, setOfflineCompleted] = useState(isCompleted);

  if (!quest) return null;

  const isOffline = quest.type === 'offline';

  const handleCompleteOffline = () => {
    onSoundTrigger?.('fanfare');
    setOfflineCompleted(true);
    onMarkCompleted(quest.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211D29]/75 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-detail-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col">
        <RetroWindow
          title={`quest_${quest.id}.exe`}
          headerColor={isOffline ? 'yellow' : 'purple'}
          shadowSize="xl"
          onClose={onClose}
          className="max-h-[90vh] flex flex-col"
          footerContent={
            <div className="flex items-center justify-between w-full text-xs">
              <span>{isOffline ? 'Self-Paced Real-World Activity' : 'Playable Digital Module'}</span>
              <span className="font-mono">{quest.availability.toUpperCase()}</span>
            </div>
          }
        >
          <div className="p-6 overflow-y-auto space-y-5 text-[#211D29]">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-interface text-[#77717D] mb-1">
                  <span className="uppercase font-bold text-[#211D29]">
                    {quest.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{quest.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{quest.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{quest.difficulty}</span>
                </div>
                <h2
                  id="quest-detail-title"
                  className="font-interface font-bold text-xl md:text-2xl text-[#211D29]"
                >
                  {quest.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSoundTrigger?.('click');
                  onToggleFavorite(quest.id);
                }}
                className={`p-2 border-2 border-[#211D29] btn-retro shadow-retro-sm ${
                  isFavorite ? 'bg-[#F0449B] text-white' : 'bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B]'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Illustration */}
            <div className="w-full h-48 border-2 border-[#211D29] shadow-retro-sm overflow-hidden bg-retro-stripes">
              <img
                src={quest.thumbnail}
                alt={quest.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div className="p-3.5 border-2 border-[#211D29] bg-[#FFF9EA]">
              <p className="text-sm text-[#39264F] leading-relaxed font-body">
                {quest.description}
              </p>
            </div>

            {/* Instructions list */}
            <div>
              <h4 className="font-interface font-bold text-xs uppercase tracking-wider text-[#211D29] mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#F0449B]" />
                <span>How to do this quest:</span>
              </h4>
              <ol className="space-y-2 text-xs text-[#211D29] font-body">
                {quest.instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-2 border border-[#211D29]/20 bg-white"
                  >
                    <span className="w-5 h-5 shrink-0 rounded-none border border-[#211D29] bg-[#FFE17B] text-[#211D29] font-mono font-bold text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Offline Special Tip */}
            {quest.offlineTip && (
              <div className="p-3 border-2 border-[#211D29] bg-[#FFE17B] text-xs font-interface text-[#211D29] shadow-retro-sm flex items-start gap-2">
                <TreePine className="w-4 h-4 text-[#211D29] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Cozy Offline Tip: </span>
                  <span>{quest.offlineTip}</span>
                </div>
              </div>
            )}

            {/* Accessibility Notes */}
            {quest.accessibilityNotes && quest.accessibilityNotes.length > 0 && (
              <div className="text-[11px] text-[#77717D] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A8E8C2] shrink-0" />
                <span>{quest.accessibilityNotes.join(' · ')}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t-2 border-[#211D29]/15 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-xs font-interface font-bold btn-retro shadow-retro-sm"
              >
                Close Window
              </button>

              {isOffline ? (
                <button
                  type="button"
                  onClick={handleCompleteOffline}
                  className={`px-5 py-2.5 border-2 border-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-2 ${
                    offlineCompleted
                      ? 'bg-[#A8E8C2] text-[#211D29]'
                      : 'bg-[#F0449B] text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{offlineCompleted ? 'Completed! ✦' : 'I Did This Quest!'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#77717D]">
                    Phase 3 Game Engine
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('fanfare');
                      onClose();
                      if (onLaunchGame && quest) {
                        onLaunchGame(quest);
                      }
                    }}
                    className="px-5 py-2.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-2 hover:brightness-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Game Experience</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
};
