import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SlidersHorizontal, Sparkles, UserCheck, HardDrive, Compass, Flame } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full h-11 border-b-2 border-[#211D29] bg-[#FFF9EA] px-3 md:px-4 flex items-center justify-between text-xs select-none">
      {/* Zone 1: Retro OS Brand & System Menu */}
      <div className="flex items-center gap-3">
        {/* Pixel Star Apple-style Logo Button */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group focus-visible:outline-none"
          title="Return to Desktop Home"
        >
          <div className="w-6 h-6 border-2 border-[#211D29] bg-[#F0449B] text-white flex items-center justify-center text-xs font-display shadow-[2px_2px_0px_#211D29] group-hover:bg-[#A98BEF] transition-colors">
            ✦
          </div>
          <span className="font-display text-[11px] text-[#211D29] tracking-tighter hidden sm:inline">
            SIDE QUEST
          </span>
        </button>

        <span className="text-[#211D29]/30" aria-hidden="true">|</span>

        {/* Vintage OS Menu Links */}
        <nav className="hidden lg:flex items-center gap-1 font-interface font-semibold text-xs text-[#211D29]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-2 py-1 hover:bg-[#FFE17B] border border-transparent hover:border-[#211D29] transition-colors ${
              currentScreen === 'home' ? 'bg-[#FFE17B] border-[#211D29] font-bold' : ''
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => onNavigate('moods')}
            className={`px-2 py-1 hover:bg-[#FFE17B] border border-transparent hover:border-[#211D29] transition-colors ${
              currentScreen === 'moods' ? 'bg-[#FFE17B] border-[#211D29] font-bold' : ''
            }`}
          >
            Moods
          </button>
          <button
            type="button"
            onClick={() => onNavigate('discovery')}
            className={`px-2 py-1 hover:bg-[#FFE17B] border border-transparent hover:border-[#211D29] transition-colors ${
              currentScreen === 'discovery' ? 'bg-[#FFE17B] border-[#211D29] font-bold' : ''
            }`}
          >
            Radar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('library')}
            className={`px-2 py-1 hover:bg-[#FFE17B] border border-transparent hover:border-[#211D29] transition-colors ${
              currentScreen === 'library' ? 'bg-[#FFE17B] border-[#211D29] font-bold' : ''
            }`}
          >
            Files
          </button>
        </nav>

        {/* Guest Session Identifier */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 border border-[#211D29] bg-[#A8E8C2] text-[#211D29] font-mono text-[10px] font-bold shadow-[1px_1px_0px_#211D29]">
          <HardDrive className="w-3 h-3 text-[#211D29]" />
          <span>RAM DISK · GUEST</span>
        </div>
      </div>

      {/* Zone 2: Anti-Scroll Philosophy & Retro Digital Clock */}
      <div className="flex items-center gap-3 font-interface text-xs">
        <span className="hidden md:inline text-[#77717D] text-xs">
          Less scrolling <span className="text-[#F0449B] font-bold">·</span> More discovering
        </span>

        {/* Digital Retro Clock Display */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-[#211D29] bg-white shadow-retro-sm">
          <span className="w-2 h-2 rounded-full bg-[#A8E8C2] border border-[#211D29] animate-pulse" />
          <span className="font-mono text-xs tabular-nums font-bold text-[#211D29]">
            {timeStr || '12:00 PM'}
          </span>
        </div>
      </div>

      {/* Zone 3: Hardware Utilities & Quick Actions */}
      <div className="flex items-center gap-2">
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

        {/* Audio Mute/Unmute Synthesizer Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`flex items-center gap-1 px-2 py-1 border-2 border-[#211D29] btn-retro shadow-retro-sm font-mono text-xs font-bold transition-colors ${
            soundEnabled
              ? 'bg-[#A8E8C2] text-[#211D29]'
              : 'bg-[#FFF9EA] text-[#77717D] hover:bg-[#FFE17B]'
          }`}
          title={soundEnabled ? 'Synthesizer Sound FX: ON (Click to Mute)' : 'Synthesizer Sound FX: MUTED (Click to Enable)'}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px]">FX:ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#77717D]" />
              <span className="hidden md:inline text-[10px]">MUTED</span>
            </>
          )}
        </button>

        {/* Accessibility & Display Settings */}
        <button
          type="button"
          onClick={onOpenAccessibility}
          className="p-1.5 sm:px-2.5 sm:py-1 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro-sm flex items-center gap-1"
          title="Accessibility & Typography Settings"
          aria-label="Open accessibility settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">A11y</span>
        </button>

        {/* Arcade Surprise CTA */}
        <button
          type="button"
          onClick={() => onNavigate('arcade')}
          className="flex items-center gap-1 px-3 py-1 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro-sm hover:brightness-105"
          title="Roll random quest"
        >
          <Sparkles className="w-3 h-3 text-[#FFE17B]" />
          <span>Surprise</span>
        </button>
      </div>
    </header>
  );
};
