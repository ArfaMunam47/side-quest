import React from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import {
  Sparkles,
  Gamepad2,
  Hammer,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface LibraryScreenProps {
  onNavigateToQuests: () => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  onNavigateToQuests,
  onSoundTrigger,
}) => {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. Header Overview Window */}
      <RetroWindow
        title="GAME_VAULT_DIRECTORY.EXE"
        headerColor="purple"
        shadowSize="xl"
      >
        <div className="p-6 md:p-8 bg-retro-grid space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#F0449B]">
              <Gamepad2 className="w-4 h-4" />
              <span>LONG-TERM VISION · 100+ GAMES</span>
            </div>

            <h1 className="font-interface font-bold text-3xl sm:text-4xl text-[#211D29] leading-tight">
              THE SIDE QUEST GAME VAULT
            </h1>

            <p className="font-body text-sm text-[#39264F] leading-relaxed">
              We are developing an expansive library of more than 100 original, independently playable games.
              Rather than filling this catalog with fake previews or empty cards, we build, test, and release each game
              one by one.
            </p>
          </div>
        </div>
      </RetroWindow>

      {/* 2. Core Pillars of our Game Studio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro space-y-2">
          <div className="w-8 h-8 border border-[#211D29] bg-[#FFE17B] flex items-center justify-center font-bold text-xs shadow-retro-sm">
            01
          </div>
          <h2 className="font-interface font-bold text-base text-[#211D29]">
            Built One by One
          </h2>
          <p className="font-body text-xs text-[#57525E] leading-relaxed">
            Every game will be crafted as a complete, genuine experience with its own mechanics, instructions, and replayability.
          </p>
        </div>

        <div className="p-5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro space-y-2">
          <div className="w-8 h-8 border border-[#211D29] bg-[#A8E8C2] flex items-center justify-center font-bold text-xs shadow-retro-sm">
            02
          </div>
          <h2 className="font-interface font-bold text-base text-[#211D29]">
            Zero Fake Placeholders
          </h2>
          <p className="font-body text-xs text-[#57525E] leading-relaxed">
            We will never display a game as playable until it has been genuinely engineered, tested, and verified on desktop and mobile.
          </p>
        </div>

        <div className="p-5 border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro space-y-2">
          <div className="w-8 h-8 border border-[#211D29] bg-[#83C9F5] flex items-center justify-center font-bold text-xs shadow-retro-sm">
            03
          </div>
          <h2 className="font-interface font-bold text-base text-[#211D29]">
            Guest-First & Free
          </h2>
          <p className="font-body text-xs text-[#57525E] leading-relaxed">
            No microtransactions, no pay-to-win, and no accounts required. Free, open-source casual fun for everyone.
          </p>
        </div>
      </div>

      {/* 3. Honest Vault Status Box */}
      <div className="border-2 border-[#211D29] bg-[#FFF9EA] p-6 md:p-8 shadow-retro-lg text-center space-y-4">
        <div className="w-14 h-14 mx-auto border-2 border-[#211D29] bg-[#FFE17B] flex items-center justify-center shadow-retro-sm">
          <Hammer className="w-7 h-7 text-[#211D29]" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <h3 className="font-interface font-bold text-xl text-[#211D29]">
            Game Releases in Active Development
          </h3>
          <p className="font-body text-xs text-[#57525E] leading-relaxed">
            Our engineering team is actively building and refining the first batch of games.
            In the meantime, you can explore our collection of relaxing interactive puzzles and mindful offline quests!
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              onNavigateToQuests();
            }}
            className="px-6 py-3 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro hover:brightness-105 inline-flex items-center gap-2"
          >
            <span>Explore Current Quests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
