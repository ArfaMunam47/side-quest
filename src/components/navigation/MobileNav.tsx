import React from 'react';
import { Monitor, Compass, FolderTree, TreePine, Sparkles, BookmarkCheck } from 'lucide-react';
import { ScreenId } from '../../types/quest';

interface MobileNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onSoundTrigger?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentScreen,
  onNavigate,
  onSoundTrigger,
}) => {
  const items: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Monitor },
    { id: 'moods', label: 'Moods', icon: Compass },
    { id: 'discovery', label: 'Radar', icon: FolderTree },
    { id: 'real-life', label: 'Offline', icon: TreePine },
    { id: 'library', label: 'Vault', icon: Sparkles },
    { id: 'my-space', label: 'Locker', icon: BookmarkCheck },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#FFF9EA] border-t-2 border-[#211D29] flex items-stretch justify-around px-1 select-none shadow-lg"
      aria-label="Mobile Bottom Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSoundTrigger?.();
              onNavigate(item.id);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 border-r border-[#211D29]/20 last:border-r-0 transition-colors ${
              isActive ? 'bg-[#F0449B] text-white font-bold' : 'text-[#211D29] hover:bg-[#FFE17B]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#211D29]'}`} />
            <span className="text-[10px] font-interface tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
