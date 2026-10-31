import React, { useState } from 'react';
import { ScreenId, Quest, MoodType } from './types/quest';
import { usePreferences } from './hooks/usePreferences';
import { useSound } from './hooks/useSound';
import { DesktopBar } from './components/layout/DesktopBar';
import { RetroSidebar } from './components/layout/RetroSidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { AccessibilityModal } from './components/feedback/AccessibilityModal';
import { QuestDetailModal } from './components/windows/QuestDetailModal';
import { HomeScreen } from './features/home/HomeScreen';
import { MoodsScreen } from './features/moods/MoodsScreen';
import { DiscoveryScreen } from './features/discovery/DiscoveryScreen';
import { ArcadeScreen } from './features/arcade/ArcadeScreen';
import { LibraryScreen } from './features/library/LibraryScreen';
import { RealLifeScreen } from './features/reallife/RealLifeScreen';
import { MySpaceScreen } from './features/myspace/MySpaceScreen';
import { GameEnvironment } from './features/games/GameEnvironment';

export default function App() {
  const {
    preferences,
    toggleFavorite,
    markRecentlyPlayed,
    markCompleted,
    updateAccessibility,
    clearAllData,
  } = usePreferences();

  const { playSound } = useSound(preferences.accessibility.soundEnabled);
  const handleSound = (type?: 'click' | 'boop' | 'chime' | 'fanfare' | 'pop') => playSound(type || 'click');

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeMoodFilter, setActiveMoodFilter] = useState<MoodType | undefined>(undefined);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeGameQuest, setActiveGameQuest] = useState<Quest | null>(null);
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  const handleNavigate = (screen: ScreenId, mood?: MoodType) => {
    setActiveGameQuest(null);
    setCurrentScreen(screen);
    setActiveMoodFilter(mood);
    window.scrollTo({ top: 0, behavior: preferences.accessibility.reducedMotion ? 'auto' : 'smooth' });
  };

  const handleSelectQuest = (quest: Quest) => {
    markRecentlyPlayed(quest.id);
    setSelectedQuest(quest);
  };

  const handleLaunchGame = (quest: Quest) => {
    markRecentlyPlayed(quest.id);
    setSelectedQuest(null);
    setActiveGameQuest(quest);
    window.scrollTo({ top: 0, behavior: preferences.accessibility.reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#211D29] text-[#211D29] font-body selection:bg-[#F0449B] selection:text-white">
      {/* 1. Retro OS Desktop Top Bar */}
      <DesktopBar
        currentScreen={currentScreen}
        soundEnabled={preferences.accessibility.soundEnabled}
        onToggleSound={() => {
          playSound('click');
          updateAccessibility({ soundEnabled: !preferences.accessibility.soundEnabled });
        }}
        onOpenAccessibility={() => {
          playSound('click');
          setIsA11yOpen(true);
        }}
        onNavigate={handleNavigate}
        favoritesCount={preferences.favorites.length}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <RetroSidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onSoundTrigger={(t) => playSound(t || 'click')}
        />

        {/* Main Desktop Canvas Area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-retro-desktop px-4 sm:px-6 md:px-8 py-6 md:py-8 pb-24 lg:pb-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Active Playable Game Environment */}
            {activeGameQuest ? (
              <GameEnvironment
                quest={activeGameQuest}
                onBack={() => setActiveGameQuest(null)}
                onNavigate={handleNavigate}
                isFavorite={preferences.favorites.includes(activeGameQuest.id)}
                onToggleFavorite={toggleFavorite}
                onMarkCompleted={markCompleted}
                onSoundTrigger={handleSound}
              />
            ) : (
              <>
                {currentScreen === 'home' && (
                  <HomeScreen
                    onNavigate={handleNavigate}
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'moods' && (
                  <MoodsScreen
                    initialMood={activeMoodFilter}
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'discovery' && (
                  <DiscoveryScreen
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'arcade' && (
                  <ArcadeScreen
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    reducedMotion={preferences.accessibility.reducedMotion}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'library' && (
                  <LibraryScreen
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'real-life' && (
                  <RealLifeScreen
                    onSelectQuest={handleSelectQuest}
                    favorites={preferences.favorites}
                    onToggleFavorite={toggleFavorite}
                    completedQuests={preferences.completedQuests}
                    onMarkCompleted={markCompleted}
                    onSoundTrigger={handleSound}
                  />
                )}

                {currentScreen === 'my-space' && (
                  <MySpaceScreen
                    preferences={preferences}
                    onSelectQuest={handleSelectQuest}
                    onToggleFavorite={toggleFavorite}
                    onUpdateAccessibility={updateAccessibility}
                    onClearAllData={clearAllData}
                    onOpenAccessibilityModal={() => setIsA11yOpen(true)}
                    onSoundTrigger={handleSound}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 3. Mobile Navigation Bottom Bar */}
      <MobileNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onSoundTrigger={() => playSound('boop')}
      />

      {/* 4. Global Modals */}
      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        settings={preferences.accessibility}
        onUpdateSettings={updateAccessibility}
        onClearData={clearAllData}
        onSoundTrigger={handleSound}
      />

      <QuestDetailModal
        quest={selectedQuest}
        onClose={() => setSelectedQuest(null)}
        isFavorite={selectedQuest ? preferences.favorites.includes(selectedQuest.id) : false}
        onToggleFavorite={toggleFavorite}
        isCompleted={selectedQuest ? preferences.completedQuests.includes(selectedQuest.id) : false}
        onMarkCompleted={markCompleted}
        onSoundTrigger={handleSound}
        onLaunchGame={handleLaunchGame}
      />
    </div>
  );
}
