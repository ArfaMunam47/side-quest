import React, { useState } from 'react';
import { RetroWindow } from '../../components/windows/RetroWindow';
import { QuestCard } from '../../components/cards/QuestCard';
import { Quest, ScreenId, MoodType } from '../../types/quest';
import {
  QUESTS_REGISTRY,
  MOOD_OPTIONS,
  MASCOT_IMAGE_URL,
  ARCADE_IMAGE_URL,
} from '../../data/quests';
import { getCuratedFeaturedQuest, getRecommendedQuests } from '../discovery/engine';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Dices,
  TreePine,
  Check,
  Shield,
  Play,
  Terminal,
  Cpu,
  Brain,
  Palette,
  Coffee,
  Sun,
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
    "I watered our digital greenhouse today. It's ready for you!",
    "No algorithmic doom here. Just small curious moments.",
    "Your attention is valuable. Spend it on things you remember.",
  ];

  const handlePokeMascot = () => {
    onSoundTrigger?.('pop');
    setMascotPoked(true);
    setDialogueIndex((prev) => (prev + 1) % mascotDialogues.length);
    setTimeout(() => setMascotPoked(false), 400);
  };

  const getMoodIcon = (id: MoodType) => {
    switch (id) {
      case 'think': return <Brain className="w-4 h-4 text-[#83C9F5]" />;
      case 'create': return <Palette className="w-4 h-4 text-[#F0449B]" />;
      case 'relax': return <Coffee className="w-4 h-4 text-[#A8E8C2]" />;
      case 'explore': return <Compass className="w-4 h-4 text-[#A98BEF]" />;
      case 'unplug': return <Sun className="w-4 h-4 text-[#FFE17B]" />;
      case 'surprise': return <Sparkles className="w-4 h-4 text-[#F0449B]" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const featuredQuest = getCuratedFeaturedQuest(QUESTS_REGISTRY, 0);
  const curatedPicks = getRecommendedQuests(
    QUESTS_REGISTRY,
    { excludeIds: favorites },
    { limit: 4, preferUnplayed: true }
  ).suggested;

  return (
    <div className="space-y-7 pb-12">
      {/* 1. HERO SECTION: Desktop Window & Pixel Mascot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <RetroWindow
            title="SYSTEM_WELCOME.EXE"
            icon={<Terminal className="w-3.5 h-3.5 text-[#211D29]" />}
            headerColor="purple"
            shadowSize="xl"
            statusBadge="EXEC_OK"
            className="h-full"
            footerContent={
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-[#F0449B]">● ACTIVE SESSION</span>
                <span aria-hidden="true">·</span>
                <span>DESKTOP BASELINE 1440PX</span>
                <span aria-hidden="true">·</span>
                <span>ZERO COOKIES</span>
              </div>
            }
          >
            <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-retro-grid">
              <div className="space-y-4 max-w-2xl">
                {/* Vintage Terminal Kicker */}
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#77717D]">
                  <span className="px-1.5 py-0.5 border border-[#211D29] bg-[#FFE17B] text-[#211D29]">
                    PROMPT://
                  </span>
                  <span className="text-[#211D29]">SIDE_QUEST_SYS_2026</span>
                  <span aria-hidden="true" className="text-[#211D29]/30">/</span>
                  <span className="text-[#F0449B]">NON_ALGORITHMIC</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#211D29] leading-tight tracking-tight">
                  BORED? YOUR NEXT ADVENTURE IS WAITING.
                </h1>

                <p className="font-body text-base md:text-lg text-[#39264F] leading-relaxed max-w-xl">
                  Little games, creative experiments, and unexpected quests. Find something better to do with your free time.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t-2 border-[#211D29]/15 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('chime');
                    onNavigate('discovery');
                  }}
                  className="px-6 py-3 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-sm tracking-wide btn-retro shadow-retro hover:brightness-105 flex items-center gap-2"
                >
                  <span>FIND MY NEXT QUEST</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('click');
                    onNavigate('library');
                  }}
                  className="px-5 py-3 border-2 border-[#211D29] bg-[#FFF9EA] text-[#211D29] hover:bg-[#FFE17B] font-interface font-bold text-sm btn-retro shadow-retro flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>EXPLORE THE PLAYGROUND</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('boop');
                    onNavigate('arcade');
                  }}
                  className="px-4 py-3 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] hover:bg-[#A8E8C2] font-interface font-bold text-sm btn-retro shadow-retro flex items-center gap-1.5"
                  title="Roll the Arcade Machine"
                >
                  <Dices className="w-4 h-4" />
                  <span className="hidden sm:inline">Roll Random</span>
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Mascot Companion Window */}
        <div className="lg:col-span-4 flex flex-col">
          <RetroWindow
            title="COMPANION_SPRITE.EXE"
            icon={<Cpu className="w-3.5 h-3.5 text-[#211D29]" />}
            headerColor="yellow"
            shadowSize="lg"
            className="h-full"
            footerContent={
              <span className="italic font-mono text-[10px]">TAP QUESTIE FOR INSPIRATION</span>
            }
          >
            <div className="p-5 flex flex-col items-center text-center justify-between h-full bg-[#FFF9EA]">
              {/* Speech Bubble */}
              <div className="w-full relative p-3 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] text-xs font-interface font-semibold shadow-retro-sm mb-3">
                <p className="leading-snug font-body">
                  "{mascotDialogues[dialogueIndex]}"
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFE17B] border-r-2 border-b-2 border-[#211D29] rotate-45" />
              </div>

              {/* Mascot Image with click response */}
              <div
                onClick={handlePokeMascot}
                className={`relative w-44 h-44 cursor-pointer select-none border-2 border-[#211D29] bg-[#A98BEF]/20 shadow-retro overflow-hidden transition-transform duration-150 ${
                  mascotPoked ? 'scale-95 rotate-3' : 'hover:scale-105'
                }`}
                title="Click me!"
              >
                <img
                  src={MASCOT_IMAGE_URL}
                  alt="Questie the Pixel Explorer Mascot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-[#211D29] text-[#FFF9EA] text-[9px] font-mono font-bold px-1.5 py-0.5 border border-white">
                  QUESTIE.SPR
                </div>
              </div>

              <div className="mt-4 w-full">
                <button
                  type="button"
                  onClick={handlePokeMascot}
                  className="w-full py-2 border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] text-xs font-interface font-bold text-[#211D29] btn-retro shadow-retro-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F0449B]" />
                  <span>Poke For Inspo</span>
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>

      {/* 2. MOOD SHORTCUTS: Retro Desktop Short-cuts */}
      <div className="border-2 border-[#211D29] bg-[#FFF9EA] shadow-retro-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b-2 border-[#211D29]/15 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F0449B]" />
              <h2 className="font-interface font-bold text-base text-[#211D29]">
                WHAT KIND OF MOOD ARE WE IN?
              </h2>
            </div>
            <p className="text-xs text-[#77717D] mt-0.5 font-body">
              Pick a frequency and jump straight to activities tuned to your mental energy.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('boop');
              onNavigate('moods');
            }}
            className="inline-flex items-center gap-1 text-xs font-interface font-bold text-[#F0449B] hover:underline shrink-0"
          >
            <span>Full Mood Compass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => {
                onSoundTrigger?.('click');
                onNavigate('moods', mood.id);
              }}
              className="p-3 text-left border-2 border-[#211D29] bg-[#FFF9EA] hover:bg-[#FFE17B] btn-retro shadow-retro transition-all group flex flex-col justify-between h-24"
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 border border-[#211D29] bg-white flex items-center justify-center shadow-[1px_1px_0px_#211D29]">
                  {getMoodIcon(mood.id)}
                </div>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#211D29]"
                  style={{ backgroundColor: mood.color }}
                />
              </div>

              <div>
                <span className="font-interface font-bold text-xs text-[#211D29] group-hover:text-[#F0449B] block">
                  {mood.label}
                </span>
                <span className="text-[10px] text-[#77717D] line-clamp-1 font-body">
                  {mood.tagline}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED QUEST & SIGNATURE ARCADE MACHINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Quest Spotlight */}
        <div className="lg:col-span-7 flex flex-col">
          <RetroWindow
            title="FEATURED_CARTRIDGE.LOG"
            headerColor="mint"
            shadowSize="lg"
            statusBadge="SPOTLIGHT"
            className="h-full"
          >
            <div className="p-6 flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-48 aspect-[4/3] shrink-0 border-2 border-[#211D29] shadow-retro overflow-hidden bg-[#39264F]">
                <img
                  src={featuredQuest.thumbnail}
                  alt={featuredQuest.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[#77717D] font-interface">
                  <span className="uppercase font-bold text-[#211D29]">
                    {featuredQuest.category}
                  </span>
                  <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                  <span>{featuredQuest.duration}</span>
                  <span aria-hidden="true" className="text-[#211D29]/30">·</span>
                  <span className="capitalize">{featuredQuest.difficulty}</span>
                </div>

                <h3 className="font-interface font-bold text-lg text-[#211D29]">
                  {featuredQuest.title}
                </h3>

                <p className="text-xs text-[#77717D] leading-relaxed font-body">
                  {featuredQuest.description}
                </p>

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSoundTrigger?.('fanfare');
                      onSelectQuest(featuredQuest);
                    }}
                    className="px-5 py-2 border-2 border-[#211D29] bg-[#F0449B] text-white font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-2 hover:brightness-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Quest</span>
                  </button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Random Machine Quick Box */}
        <div className="lg:col-span-5 flex flex-col">
          <RetroWindow
            title="ARCADE_COINOP.ROM"
            headerColor="pink"
            shadowSize="lg"
            className="h-full"
            footerContent={
              <span className="font-mono text-[10px]">DETERMINISTIC COIN-OP MACHINE</span>
            }
          >
            <div className="p-5 flex flex-col justify-between h-full bg-[#FFF9EA]">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 shrink-0 border-2 border-[#211D29] shadow-retro-sm overflow-hidden bg-black">
                  <img
                    src={ARCADE_IMAGE_URL}
                    alt="Random Arcade Cabinet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-interface font-bold text-base text-[#211D29]">
                    The Random Machine
                  </h3>
                  <p className="text-xs text-[#77717D] mt-1 leading-snug font-body">
                    Can't decide? Pull the retro lever and let fate pick a bite-sized experience.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#211D29]/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#77717D] font-bold">
                  CREDITS [99]
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onSoundTrigger?.('chime');
                    onNavigate('arcade');
                  }}
                  className="px-4 py-2 border-2 border-[#211D29] bg-[#FFE17B] text-[#211D29] font-interface font-bold text-xs btn-retro shadow-retro flex items-center gap-1.5 hover:bg-[#A8E8C2]"
                >
                  <Dices className="w-4 h-4" />
                  <span>Pull The Lever</span>
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>

      {/* 4. CURATED DECK PREVIEW */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-interface font-bold text-base text-[#FFF9EA]">
              CURATED QUEST PICKS
            </h2>
            <span className="text-xs text-[#FFF9EA]/60 font-mono">
              · [04 ITEMS]
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSoundTrigger?.('click');
              onNavigate('library');
            }}
            className="text-xs font-interface font-bold text-[#FFE17B] hover:underline flex items-center gap-1"
          >
            <span>View All Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {curatedPicks.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isFavorite={favorites.includes(quest.id)}
              onSelect={onSelectQuest}
              onToggleFavorite={onToggleFavorite}
              onSoundTrigger={() => onSoundTrigger?.('click')}
            />
          ))}
        </div>
      </div>

      {/* 5. SIDE QUEST MANIFESTO: Retro Readme Window */}
      <RetroWindow
        title="MANIFESTO_README.TXT"
        headerColor="cream"
        shadowSize="md"
        footerContent={
          <span className="font-mono text-[10px]">DOCUMENT REVISION 1.04 · PUBLIC DOMAIN</span>
        }
      >
        <div className="p-6 bg-[#FFF9EA] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 shrink-0 border-2 border-[#211D29] bg-[#FFE17B] flex items-center justify-center font-bold shadow-retro-sm">
              <Check className="w-5 h-5 text-[#211D29]" />
            </div>
            <div>
              <h4 className="font-interface font-bold text-sm text-[#211D29]">
                Active Over Passive
              </h4>
              <p className="text-xs text-[#77717D] mt-1 leading-relaxed font-body">
                Feed algorithms are tuned for passive consumption. Side Quest is built for active hands, curious thoughts, and real delight.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-9 h-9 shrink-0 border-2 border-[#211D29] bg-[#A8E8C2] flex items-center justify-center font-bold shadow-retro-sm">
              <Shield className="w-5 h-5 text-[#211D29]" />
            </div>
            <div>
              <h4 className="font-interface font-bold text-sm text-[#211D29]">
                Zero Guilt & Streaks
              </h4>
              <p className="text-xs text-[#77717D] mt-1 leading-relaxed font-body">
                No manipulative daily streak trackers or countdown rings. Come play when you feel like it, and close the window when you're done.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-9 h-9 shrink-0 border-2 border-[#211D29] bg-[#83C9F5] flex items-center justify-center font-bold shadow-retro-sm">
              <TreePine className="w-5 h-5 text-[#211D29]" />
            </div>
            <div>
              <h4 className="font-interface font-bold text-sm text-[#211D29]">
                Real-World Balance
              </h4>
              <p className="text-xs text-[#77717D] mt-1 leading-relaxed font-body">
                A digital platform that enthusiastically encourages you to close your screen and look at physical trees or doodle on real paper.
              </p>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* 6. PLATFORM FOOTER */}
      <footer className="border-t-2 border-[#FFF9EA]/20 pt-6 text-xs text-[#FFF9EA]/70 flex flex-col sm:flex-row items-center justify-between gap-4 font-interface">
        <div className="flex items-center gap-2">
          <span className="font-display text-[10px] text-[#FFE17B]">
            SIDE QUEST
          </span>
          <span aria-hidden="true">·</span>
          <span>A little playground for curious minds</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => onNavigate('real-life')}
            className="hover:text-white transition-colors"
          >
            Offline Activities
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => onNavigate('my-space')}
            className="hover:text-white transition-colors"
          >
            My Locker
          </button>
          <span aria-hidden="true">·</span>
          <span className="text-[#A8E8C2] font-mono font-bold">100% GUEST MODE</span>
        </div>
      </footer>
    </div>
  );
};
