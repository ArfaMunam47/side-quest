import React from 'react';
import {
  Monitor,
  Compass,
  FolderTree,
  Sparkles,
  TreePine,
  BookmarkCheck,
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
    label: 'Home',
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
    sublabel: 'Curated activities',
    icon: FolderTree,
  },
  {
    id: 'real-life',
    label: 'Offline Quests',
    driveLetter: 'O:',
    sublabel: 'Real-world mindful breaks',
    icon: TreePine,
    badge: 'Mindful',
  },
  {
    id: 'library',
    label: 'Game Vault',
    driveLetter: 'V:',
    sublabel: '100+ Games Vision',
    icon: Sparkles,
    badge: 'Roadmap',
  },
  {
    id: 'my-space',
    label: 'My Locker',
    driveLetter: 'L:',
    sublabel: 'Favorites & preferences',
    icon: BookmarkCheck,
  },
];

export const RetroSidebar: React.FC<RetroSidebarProps> = ({
  currentScreen,
  onNavigate,
  onSoundTrigger,
}) => {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r-2 border-[#211D29] bg-[#FFF9EA] p-4 justify-between select-none">
      <div className="space-y-4">
        {/* Retro Header Card */}
        <div className="border-2 border-[#211D29] bg-[#FFE17B] p-2.5 shadow-retro-sm">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#211D29]" />
            <span className="font-interface font-bold text-xs uppercase tracking-wider text-[#211D29]">
              Navigation Directory
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Desktop Explorer Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSoundTrigger?.('click');
                  onNavigate(item.id);
                }}
                className={`w-full text-left p-2.5 border-2 border-[#211D29] transition-all flex items-center justify-between btn-retro ${
                  isActive
                    ? 'bg-[#F0449B] text-white shadow-retro'
                    : 'bg-white text-[#211D29] hover:bg-[#FFE17B] shadow-retro-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 border border-[#211D29] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#211D29] ${
                      isActive ? 'bg-[#FFE17B] text-[#211D29]' : 'bg-[#FFF9EA] text-[#211D29]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-interface font-bold text-xs truncate">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] block truncate font-body ${
                        isActive ? 'text-white/80' : 'text-[#57525E]'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 border border-[#211D29] shrink-0 font-bold ${
                      isActive
                        ? 'bg-[#211D29] text-white'
                        : 'bg-[#FFE17B] text-[#211D29]'
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

      {/* Honest Sidebar Footer Note */}
      <div className="border-2 border-[#211D29] bg-[#A8E8C2] p-3 text-xs shadow-retro-sm space-y-1">
        <div className="font-interface font-bold text-[#211D29] flex items-center gap-1.5">
          <span>✦ Anti-Scroll Sanctuary</span>
        </div>
        <p className="text-[11px] text-[#211D29]/90 font-body leading-relaxed">
          Take a quiet mindful moment. Discover an activity and close the app whenever you feel refreshed.
        </p>
      </div>
    </aside>
  );
};
