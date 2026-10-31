import React from 'react';
import {
  Monitor,
  Compass,
  FolderTree,
  Sparkles,
  TreePine,
  BookmarkCheck,
  Dices,
  Flame,
  HardDrive,
  Terminal,
} from 'lucide-react';
import { ScreenId } from '../../types/quest';

interface RetroSidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onSoundTrigger?: (type?: 'click' | 'boop') => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  driveLetter: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Desktop',
    driveLetter: 'C:',
    sublabel: 'Main playground',
    icon: Monitor,
  },
  {
    id: 'moods',
    label: 'Mood Compass',
    driveLetter: 'M:',
    sublabel: 'Pick mental state',
    icon: Compass,
    badge: '6 Moods',
  },
  {
    id: 'discovery',
    label: 'Quest Radar',
    driveLetter: 'R:',
    sublabel: 'Curated deck',
    icon: FolderTree,
  },
  {
    id: 'arcade',
    label: 'Arcade Machine',
    driveLetter: 'A:',
    sublabel: 'Roll the lever',
    icon: Dices,
    badge: 'Coin-Op',
  },
  {
    id: 'library',
    label: 'Quest Files',
    driveLetter: 'F:',
    sublabel: 'Full directory',
    icon: Sparkles,
  },
  {
    id: 'real-life',
    label: 'Offline Quests',
    driveLetter: 'O:',
    sublabel: 'Real-world tasks',
    icon: TreePine,
    badge: 'Real',
  },
  {
    id: 'my-space',
    label: 'My Locker',
    driveLetter: 'L:',
    sublabel: 'Saved & history',
    icon: BookmarkCheck,
  },
];

export const RetroSidebar: React.FC<RetroSidebarProps> = ({
  currentScreen,
  onNavigate,
  onSoundTrigger,
}) => {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r-2 border-[#211D29] bg-[#FFF9EA] p-3.5 justify-between select-none">
      <div className="space-y-3.5">
        {/* Retro Navigator Window Header */}
        <div className="border-2 border-[#211D29] bg-[#FFE17B] p-2 shadow-retro-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#211D29]" />
              <span className="font-interface font-bold text-xs uppercase tracking-wider text-[#211D29]">
                DRIVES & FOLDERS
              </span>
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 border border-[#211D29] bg-white inline-block"></span>
              <span className="w-2 h-2 border border-[#211D29] bg-[#F0449B] inline-block"></span>
            </div>
          </div>
        </div>

        {/* Navigation Drive Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSoundTrigger?.('boop');
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left border-2 border-[#211D29] transition-all duration-100 ${
                  isActive
                    ? 'bg-[#F0449B] text-white shadow-retro translate-x-1'
                    : 'bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B] hover:shadow-retro-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 border border-[#211D29] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#211D29] ${
                      isActive ? 'bg-white text-[#F0449B]' : 'bg-[#FFF9EA] text-[#211D29]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] font-bold opacity-70">
                        {item.driveLetter}\
                      </span>
                      <span className="font-interface font-bold text-xs tracking-tight truncate">
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-white/80' : 'text-[#77717D]'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`ml-1 shrink-0 px-1.5 py-0.2 text-[9px] font-mono font-bold border border-[#211D29] ${
                      isActive
                        ? 'bg-[#FFE17B] text-[#211D29]'
                        : 'bg-[#A8E8C2] text-[#211D29]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Retro Sticky Note & System Footnote */}
      <div className="space-y-3 mt-4">
        {/* Sticky Note with Frosted Tape Accent */}
        <div className="relative p-3.5 border-2 border-[#211D29] bg-[#FFE17B] shadow-retro rotate-[-1deg]">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 tape-accent rotate-1" />
          <div className="flex items-center gap-1.5 text-xs font-interface font-bold text-[#211D29] mb-1">
            <Flame className="w-3.5 h-3.5 text-[#F0449B]" />
            <span>Anti-Scroll Rule</span>
          </div>
          <p className="text-[11px] text-[#211D29] leading-relaxed font-body">
            Free time isn't a race or a metric. Close this tab whenever you feel replenished.
          </p>
        </div>

        {/* Local Storage RAM Footnote */}
        <div className="p-2 border border-[#211D29]/30 bg-white/50 text-[10px] font-mono text-[#77717D] flex items-center justify-between">
          <span>MEM: 100% PRIVATE</span>
          <span className="text-[#A8E8C2] font-bold">● OK</span>
        </div>
      </div>
    </aside>
  );
};
