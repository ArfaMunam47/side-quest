import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ScreenId } from '../../types/quest';

interface DesktopBarProps {
  currentScreen: ScreenId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAccessibility: () => void;
  onNavigate: (screen: ScreenId) => void;
  favoritesCount: number;
}

export const DesktopBar: React.FC<DesktopBarProps> = ({
  currentScreen,
  soundEnabled,
  onToggleSound,
  onOpenAccessibility,
  onNavigate,
  favoritesCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-12 border-b-2 border-[#211D29] bg-[#FFF9EA] px-3 md:px-5 flex items-center justify-between text-xs select-none shadow-sm">
      {/* Brand & Top Navigation */}
      <div className="flex items-center gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group focus-visible:outline-none"
          title="Return to Side Quest Home"
        >
          <div className="w-7 h-7 border-2 border-[#211D29] bg-[#F0449B] text-white flex items-center justify-center text-xs font-display shadow-[2px_2px_0px_#211D29] group-hover:bg-[#A98BEF] transition-colors">
            ✦
          </div>
          <span className="font-interface font-bold text-sm text-[#211D29] tracking-tight hidden sm:inline">
            SIDE QUEST
          </span>
        </button>

        <span className="text-[#211D29]/20 hidden lg:inline" aria-hidden="true">|</span>

        {/* Clean Editorial Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-interface text-xs text-[#211D29]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 border border-transparent transition-all rounded-sm font-semibold ${
              currentScreen === 'home'
                ? 'bg-[#FFE17B] border-[#211D29] font-bold shadow-[1px_1px_0px_#211D29]'
                : 'hover:bg-[#FFE17B]/60'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('moods')}
            className={`px-3 py-1.5 border border-transparent transition-all rounded-sm font-semibold ${
              currentScreen === 'moods'
                ? 'bg-[#FFE17B] border-[#211D29] font-bold shadow-[1px_1px_0px_#211D29]'
                : 'hover:bg-[#FFE17B]/60'
            }`}
          >
            Moods
          </button>
          <button
            type="button"
            onClick={() => onNavigate('discovery')}
            className={`px-3 py-1.5 border border-transparent transition-all rounded-sm font-semibold ${
              currentScreen === 'discovery'
                ? 'bg-[#FFE17B] border-[#211D29] font-bold shadow-[1px_1px_0px_#211D29]'
                : 'hover:bg-[#FFE17B]/60'
            }`}
          >
            Quest Radar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('real-life')}
            className={`px-3 py-1.5 border border-transparent transition-all rounded-sm font-semibold ${
              currentScreen === 'real-life'
                ? 'bg-[#FFE17B] border-[#211D29] font-bold shadow-[1px_1px_0px_#211D29]'
                : 'hover:bg-[#FFE17B]/60'
            }`}
          >
            Offline
          </button>
          <button
            type="button"
            onClick={() => onNavigate('library')}
            className={`px-3 py-1.5 border border-transparent transition-all rounded-sm font-semibold ${
              currentScreen === 'library'
                ? 'bg-[#FFE17B] border-[#211D29] font-bold shadow-[1px_1px_0px_#211D29]'
                : 'hover:bg-[#FFE17B]/60'
            }`}
          >
            Game Vault
          </button>
        </nav>
      </div>

      {/* Philosophy Tagline */}
      <div className="hidden md:flex items-center gap-2 font-interface text-xs text-[#57525E]">
        <span>Less scrolling</span>
        <span className="text-[#F0449B] font-bold">·</span>
        <span className="text-[#211D29] font-semibold">More discovering</span>
      </div>

      {/* Utilities: Clock, Favorites, Sound, Accessibility */}
      <div className="flex items-center gap-2.5">
        {/* Retro Digital Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#211D29] bg-white shadow-retro-sm">
          <span className="w-2 h-2 rounded-full bg-[#A8E8C2] border border-[#211D29]" />
          <span className="font-mono text-xs tabular-nums font-bold text-[#211D29]">
            {timeStr || '12:00 PM'}
          </span>
        </div>

        {/* Saved Favorites Shortcut */}
        <button
          type="button"
          onClick={() => onNavigate('my-space')}
          className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm"
          title="Open My Space & Saved Favorites"
        >
          <span className="hidden sm:inline">Locker</span>
          <span className="px-1.5 py-0.2 bg-[#F0449B] text-white border border-[#211D29] text-[10px] font-mono font-bold">
            {favoritesCount}
          </span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`flex items-center gap-1 px-2.5 py-1 border-2 border-[#211D29] btn-retro shadow-retro-sm font-interface text-xs font-bold transition-colors ${
            soundEnabled
              ? 'bg-[#A8E8C2] text-[#211D29]'
              : 'bg-white text-[#57525E] hover:bg-[#FFE17B]'
          }`}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          aria-label={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>

        {/* Accessibility Preferences Dialog Button */}
        <button
          type="button"
          onClick={onOpenAccessibility}
          className="p-1.5 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-[#211D29] btn-retro shadow-retro-sm"
          title="Accessibility Preferences (Font scaling, contrast, reduced motion)"
          aria-label="Open Accessibility Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#211D29]" />
        </button>
      </div>
    </header>
  );
};
