export type QuestCategory = 'brain' | 'creative' | 'cozy' | 'curiosity' | 'real-life';

export type QuestType = 'digital' | 'offline';

export type QuestDifficulty = 'easy' | 'medium' | 'challenging';

export type QuestDuration = '2-5 min' | '5-10 min' | '10-15 min';

export type MoodType = 'think' | 'create' | 'relax' | 'explore' | 'unplug' | 'surprise';

export interface MoodOption {
  id: MoodType;
  label: string;
  tagline: string;
  color: string; // token accent
  bgClass: string;
  iconName: string;
}

export interface Quest {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: QuestCategory;
  type: QuestType;
  duration: QuestDuration;
  difficulty: QuestDifficulty;
  moods: MoodType[];
  thumbnail: string;
  instructions: string[];
  availability: 'playable' | 'coming-soon';
  gameKey?: 'memory-match' | 'pixel-studio' | 'word-hunt' | 'tiny-garden' | 'one-line-journal';
  offlineTip?: string;
  accessibilityNotes?: string[];
  tags: string[];
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
}

export interface UserPreferences {
  favorites: string[]; // quest IDs
  recentlyPlayed: string[]; // quest IDs
  completedQuests: string[]; // quest IDs
  accessibility: AccessibilitySettings;
}

export type ScreenId = 'home' | 'moods' | 'discovery' | 'arcade' | 'library' | 'real-life' | 'my-space';
