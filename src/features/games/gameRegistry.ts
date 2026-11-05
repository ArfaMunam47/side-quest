/**
 * SIDE QUEST — GAME LIBRARY FOUNDATION
 *
 * Side Quest is an open-source playground committed to launching
 * 100+ original games built one by one.
 *
 * Each game will only be registered once it has been fully implemented,
 * tested, and verified. No fake cards or simulated previews.
 */

export type GameCategory = 'arcade' | 'puzzle' | 'creative' | 'cozy';
export type GameStatus = 'available' | 'in-development';

export interface GameDefinition {
  id: string;
  gameNumber: number;
  formattedNumber: string;
  title: string;
  tagline: string;
  description: string;
  category: GameCategory;
  status: GameStatus;
  thumbnail?: string;
  instructions?: string[];
}

/**
 * Registered standalone games.
 * Games are added here one by one as they are developed.
 */
export const GAME_REGISTRY: GameDefinition[] = [];

export function getAvailableGames(): GameDefinition[] {
  return GAME_REGISTRY.filter((game) => game.status === 'available');
}

export function getGameById(id: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((game) => game.id === id);
}

export const TARGET_GAMES_GOAL = 100;
