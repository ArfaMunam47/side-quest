import React, { useState } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { ScreenId, MoodType, Quest } from '../../types/quest';
import {
  MOOD_OPTIONS,
  MASCOT_IMAGE_URL,
  QUESTS_REGISTRY,
} from '../../data/quests';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Play,
  Terminal,
  Cpu,
  Brain,
  Palette,
  Coffee,
  Sun,
  Gamepad2,
  TreePine,
  Shield,
  Heart,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, filterMood?: MoodType) => void;
  onSelectQuest: (quest: Quest) => void;
  favorites: string[];
  onToggleFavorite: (questId: string) => void;
  onSoundTrigger?: (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectQuest,
  favorites,
  onToggleFavorite,
  onSoundTrigger,
}) => {
  const [mascotPoked, setMascotPoked] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const mascotDialogues = [
    "Hey! Put that infinite feed down. Let's do something fun.",
    "Did you know drawing a tiny weird monster takes under 3 minutes?",
    "Water our digital greenhouse today — no plant ever withers here.",
    "No algorithmic doom here. Just small curious moments.",
    "Your attention is valuable. Spend it on things you remember.",
  ];

  const handlePokeMascot = () => {
    onSoundTrigger?.('pop');
    setMascotPoked(true);
    setDialogueIndex((prev) => (prev + 1) % mascotDialogues.length);
    setTimeout(() => setMascotPoked(false), 300);
  };

  const getMoodIcon = (id: MoodType) => {
    switch (id) {
      case 'think': return <Brain className="w-4 h-4 text-[#211D29]" />;
      case 'create': return <Palette className="w-4 h-4 text-[#211D29]" />;
      case 'relax': return <Coffee className="w-4 h-4 text-[#211D29]" />;
      case 'explore': return <Compass className="w-4 h-4 text-[#211D29]" />;
      case 'unplug': return <Sun className="w-4 h-4 text-[#211D29]" />;
      case 'surprise': return <Sparkles className="w-4 h-4 text-[#211D29]" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Select a curated playable spotlight quest
  const spotlightQuest = QUESTS_REGISTRY.find((q) => q.id === 'quest-memory-match') || QUESTS_REGISTRY[0];

  return (
    <div className="space-y-8 pb-12">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Brand Welcome & Mascot Companion        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Brand Banner */}
        <div className="lg:col-span-8 flex flex-col">
          <RetroWindow
            title="WELCOME_TO_SIDE_QUEST.EXE"
            icon={<Terminal className="w-3.5 h-3.5 text-[#211D29]" />}
            headerColor="purple"
            shadowSize="xl"
            className="h-full"
          >
            <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-retro-grid space-y-6">
              <div className="space-y-4 max-w-2xl">
                {/* Clean Editorial Kicker */}
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#57525E]">
                  <span className="px-2 py-0.5 border border-[#211D29] bg-[#FFE17B] text-[#211D29]">
                    MANIFESTO
                  </span>
                  <span>A Digital Playground for Curious Minds</span>
                </div>

                <h1 className="font-interface font-bold text-3xl sm:text-4xl md:text-5xl text-[#211D29] leading-[1.1] tracking-tight">
                  LESS SCROLLING.<br />
                  <span className="text-[#F0449B]">MORE DISCOVERING.</span>
                </h1>

                <p className="font-body text-sm sm:text-base text-[#39264F] leading-relaxed max-w-xl">
                  Bored of algorithm feeds and infinite scrolling? Side Quest is a cozy retreat
                  with relaxing mini-games, creative experiments, and mindful offline prompts.
                  Enjoy something bite-sized, and leave whenever you want.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-[#211D29]/15 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('chime');
                    onNavigate('discovery');
                  }}
                  className="px-6 py-3.5 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-sm btn-retro shadow-retro hover:brightness-105 flex items-center gap-2"
                >
                  <span>Explore Quests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    onNavigate('moods');
                  }}
                  className="px-5 py-3.5 border-2 border-[#211D29] bg-white text-[#211D29] hover:bg-[#FFE17B] font-interface font-bold text-sm btn-retro shadow-retro flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#F0449B]" />
                  <span>Mood Compass</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('boop');
                    onNavigate('real-life');
                  }}
                  className="px-4 py-3.5 border-2 border-[#211D29] bg-[#A8E8C2] text-[#211D29] hover:bg-[#FFE17B] font-interface font-bold text-sm btn-retro shadow-retro flex items-center gap-1.5"
                  title="Offline mindful breaks"
                >
                  <TreePine className="w-4 h-4" />
                  <span>Offline Breaks</span>
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Mascot Companion Window */}
        <div className="lg:col-span-4 flex flex-col">
          <RetroWindow
            title="COMPANION.SPR"
            icon={<Cpu className="w-3.5 h-3.5 text-[#211D29]" />}
            headerColor="yellow"
            shadowSize="lg"
            className="h-full"
          >
            <div className="p-5 flex flex-col items-center text-center justify-between h-full bg-[#FFF9EA] space-y-4">
              {/* Speech Bubble */}
              <div className="w-full relative p-3 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] text-xs font-interface font-semibold shadow-retro-sm">
                <p className="leading-snug font-body">
                  "{mascotDialogues[dialogueIndex]}"
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFE17B] border-r-2 border-b-2 border-[#211D29] rotate-45" />
              </div>

              {/* Mascot Image with click response */}
              <div
                onClick={handlePokeMascot}
                className={`relative w-40 h-40 cursor-pointer select-none border-2 border-[#211D29] bg-[#A98BEF]/25 shadow-retro overflow-hidden transition-transform duration-150 ${
                  mascotPoked ? 'scale-95 rotate-2' : 'hover:scale-105'
                }`}
                title="Tap Questie for inspiration!"
              >
                <img
                  src={MASCOT_IMAGE_URL}
                  alt="Questie the Pixel Explorer Mascot"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={handlePokeMascot}
                className="w-full py-2 border-2 border-[#211D29] bg-white hover:bg-[#FFE17B] text-xs font-interface font-bold text-[#211D29] btn-retro shadow-retro-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F0449B]" />
                <span>Tap for Gentle Tip</span>
              </button>
            </div>
          </RetroWindow>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. WHAT IS SIDE QUEST? — 3 CORE PILLARS                  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border-2 border-[#211D29] bg-[#83C9F5] p-5 shadow-retro text-[#211D29] space-y-2">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#211D29]/80">
            01 · Curated Activities
          </div>
          <h3 className="font-interface font-bold text-lg text-[#211D29]">
            Playful Alternatives
          </h3>
          <p className="font-body text-xs text-[#211D29]/90 leading-relaxed">
            Concentration cards, pixel canvases, and calming sandbox gardens you can enjoy in 2 to 10 minutes.
          </p>
        </div>

        <div className="border-2 border-[#211D29] bg-[#A8E8C2] p-5 shadow-retro text-[#211D29] space-y-2">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#211D29]/80">
            02 · Real-World Reset
          </div>
          <h3 className="font-interface font-bold text-lg text-[#211D29]">
            Mindful Offline Quests
          </h3>
          <p className="font-body text-xs text-[#211D29]/90 leading-relaxed">
            Step away from monitors. Read two physical pages, sketch a tiny index-card monster, or rest your eyes.
          </p>
        </div>

        <div className="border-2 border-[#211D29] bg-[#FFE17B] p-5 shadow-retro text-[#211D29] space-y-2">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#211D29]/80">
            03 · Zero Pressure
          </div>
          <h3 className="font-interface font-bold text-lg text-[#211D29]">
            Anti-Algorithm Sanctuary
          </h3>
          <p className="font-body text-xs text-[#211D29]/90 leading-relaxed">
            No infinite doom-scroll, no streak penalties, no ads, and no paywalls. All saved progress stays on your device.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOOD COMPASS SHORTCUTS                                */}
      {/* ======================================================== */}
      <div className="border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b-2 border-[#211D29]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#F0449B]" />
              <h2 className="font-interface font-bold text-lg text-[#211D29]">
                HOW ARE YOU FEELING RIGHT NOW?
              </h2>
            </div>
            <p className="text-xs text-[#57525E] mt-0.5 font-body">
              Pick a state of mind to immediately find activities tuned to your energy level.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('boop');
              onNavigate('moods');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-interface font-bold text-[#F0449B] hover:underline shrink-0"
          >
            <span>Open Full Mood Compass</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => {
                onSoundTrigger?.('click');
                onNavigate('moods', mood.id);
              }}
              className="p-3.5 text-left border-2 border-[#211D29] bg-white hover:bg-[#FFE17B] btn-retro shadow-retro transition-all group flex flex-col justify-between h-28"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-7 h-7 border border-[#211D29] flex items-center justify-center shadow-[1px_1px_0px_#211D29]"
                  style={{ backgroundColor: mood.color }}
                >
                  {getMoodIcon(mood.id)}
                </div>
                <span
                  className="w-3 h-3 rounded-full border border-[#211D29]"
                  style={{ backgroundColor: mood.color }}
                />
              </div>

              <div>
                <span className="font-interface font-bold text-xs text-[#211D29] group-hover:text-[#F0449B] block">
                  {mood.label}
                </span>
                <span className="text-[10px] text-[#57525E] line-clamp-1 font-body mt-0.5">
                  {mood.tagline}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CURATED ACTIVITY SPOTLIGHT                            */}
      {/* ======================================================== */}
      {spotlightQuest && (
        <RetroWindow
          title="FEATURED_ACTIVITY.LOG"
          headerColor="mint"
          shadowSize="xl"
          statusBadge="COZY PICK"
        >
          <div className="p-6 md:p-8 bg-[#FFF9EA] flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-56 aspect-[4/3] border-2 border-[#211D29] bg-[#211D29] shadow-retro overflow-hidden shrink-0 group">
              <img
                src={spotlightQuest.thumbnail}
                alt={spotlightQuest.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 space-y-3 text-[#211D29]">
              <div className="flex items-center gap-2 text-xs text-[#57525E] font-interface">
                <span className="font-bold text-[#F0449B] uppercase">
                  {spotlightQuest.category}
                </span>
                <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                <span>{spotlightQuest.duration}</span>
                <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                <span className="capitalize">{spotlightQuest.difficulty}</span>
              </div>

              <h2 className="font-interface font-bold text-2xl text-[#211D29]">
                {spotlightQuest.title}
              </h2>

              <p className="font-body text-xs text-[#57525E] leading-relaxed max-w-xl">
                {spotlightQuest.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('fanfare');
                    onSelectQuest(spotlightQuest);
                  }}
                  className="px-6 py-3 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro hover:brightness-105 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open This Activity</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    onNavigate('discovery');
                  }}
                  className="px-5 py-3 border-2 border-[#211D29] bg-white text-[#211D29] hover:bg-[#FFE17B] font-interface font-bold text-xs btn-retro shadow-retro-sm"
                >
                  View All Quests
                </button>
              </div>
            </div>
          </div>
        </RetroWindow>
      )}

      {/* ======================================================== */}
      {/* 5. FUTURE 100+ GAMES VAULT (Clean Architecture Banner)   */}
      {/* ======================================================== */}
      <div className="border-2 border-[#211D29] bg-[#211D29] text-[#FFF9EA] p-6 shadow-retro-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE17B]" />
            <span className="font-mono text-xs text-[#FFE17B] font-bold uppercase tracking-wider">
              ROADMAP & VISION
            </span>
          </div>
          <h3 className="font-interface font-bold text-xl text-white">
            Building 100+ Original Games One by One
          </h3>
          <p className="font-body text-xs text-[#FFF9EA]/80 leading-relaxed">
            Side Quest is developing an expansive open-source gaming library. Every single game
            will be built and tested individually without fake previews or paywalls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onSoundTrigger?.('click');
            onNavigate('library');
          }}
          className="px-6 py-3 border-2 border-white bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-[3px_3px_0px_#FFFFFF] hover:bg-[#F0449B] hover:text-white shrink-0 flex items-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Explore Game Vault</span>
        </button>
      </div>
    </div>
  );
};
