import React, { useState } from 'react';
import { Quest } from '../../types/quest';
import { Heart, Clock, Zap, ArrowRight, Sparkles, TreePine, Terminal } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  isFavorite?: boolean;
  onSelect: (quest: Quest) => void;
  onToggleFavorite?: (questId: string) => void;
  onSoundTrigger?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  onSoundTrigger,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSoundTrigger?.();
    onToggleFavorite?.(quest.id);
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSoundTrigger?.();
    onSelect(quest);
  };

  const isOffline = quest.type === 'offline';

  return (
    <div
      onClick={() => {
        onSoundTrigger?.();
        onSelect(quest);
      }}
      className="group relative flex flex-col border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro hover:shadow-retro-lg transition-all duration-150 cursor-pointer overflow-hidden rounded-sm"
    >
      {/* Top File Category Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b-2 border-[#211D29] bg-[#FFF9EA] text-xs font-interface select-none">
        <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-bold text-[#211D29] truncate pr-2">
          {isOffline ? (
            <TreePine className="w-3.5 h-3.5 text-[#211D29] shrink-0" />
          ) : (
            <Terminal className="w-3.5 h-3.5 text-[#F0449B] shrink-0" />
          )}
          <span className="truncate">{quest.category}</span>
          <span aria-hidden="true" className="text-[#211D29]/40">·</span>
          <span className="text-[#57525E] font-medium capitalize">{quest.type}</span>
        </div>

        {/* Favorite Heart Toggle */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`w-6 h-6 flex items-center justify-center border border-[#211D29] shrink-0 transition-colors btn-retro shadow-[1px_1px_0px_#211D29] ${
            isFavorite
              ? 'bg-[#F0449B] text-white'
              : 'bg-white text-[#211D29] hover:bg-[#FFE17B]'
          }`}
          title={isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Artwork Canvas Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#211D29] bg-[#39264F]">
        {!imageError && quest.thumbnail ? (
          <img
            src={quest.thumbnail}
            alt={quest.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-retro-stripes">
            <Sparkles className="w-8 h-8 text-[#FFE17B] mb-1" />
            <span className="font-interface font-bold text-xs text-[#FFF9EA]">
              {quest.title}
            </span>
          </div>
        )}

        {/* Offline Stamp Badge */}
        {isOffline && (
          <div className="absolute top-2 left-2 border border-[#211D29] bg-[#FFE17B] text-[#211D29] px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase shadow-[1px_1px_0px_#211D29]">
            OFFLINE
          </div>
        )}

        {/* Digital Playable Badge */}
        {!isOffline && quest.gameKey && (
          <div className="absolute bottom-2 right-2 border border-[#211D29] bg-[#A8E8C2] text-[#211D29] px-1.5 py-0.5 text-[9px] font-mono font-bold shadow-[1px_1px_0px_#211D29]">
            PLAYABLE
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-interface font-bold text-sm text-[#211D29] group-hover:text-[#F0449B] transition-colors leading-snug">
            {quest.title}
          </h3>
          <p className="mt-1 text-xs text-[#57525E] line-clamp-2 leading-relaxed font-body">
            {quest.description}
          </p>
        </div>

        {/* Unboxed Metadata Line */}
        <div className="pt-2.5 border-t border-[#211D29]/15 flex items-center justify-between text-xs text-[#57525E]">
          <div className="flex items-center gap-1.5 text-[11px] font-interface">
            <span className="flex items-center gap-1 font-semibold text-[#211D29]">
              <Clock className="w-3 h-3 text-[#211D29]" />
              {quest.duration}
            </span>
            <span aria-hidden="true" className="text-[#211D29]/30">·</span>
            <span className="flex items-center gap-1 font-medium capitalize">
              <Zap className="w-3 h-3 text-[#F0449B]" />
              {quest.difficulty}
            </span>
          </div>

          {/* Tactile Action Button */}
          <button
            type="button"
            onClick={handleStartClick}
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-[2px_2px_0px_#211D29] hover:brightness-105"
          >
            <span>{isOffline ? 'View' : 'Play'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
