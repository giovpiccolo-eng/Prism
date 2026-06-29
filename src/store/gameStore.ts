import { create } from 'zustand';
import type { Rank } from '../types/content';
import { getGameState, updateGameState } from '../db/nexusDb';

const RANKS: { rank: Rank; threshold: number }[] = [
  { rank: 'Cadet', threshold: 0 },
  { rank: 'Lab Tech', threshold: 500 },
  { rank: 'Analyst', threshold: 1500 },
  { rank: 'Investigator', threshold: 3500 },
  { rank: 'Lead Scientist', threshold: 7000 },
  { rank: 'Laureate', threshold: 12000 },
];

function rankForXp(xp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].threshold) return RANKS[i].rank;
  }
  return 'Cadet';
}

function nextRankThreshold(xp: number): number {
  for (const { threshold } of RANKS) {
    if (threshold > xp) return threshold;
  }
  return RANKS[RANKS.length - 1].threshold;
}

interface GameStore {
  xp: number;
  rank: Rank;
  streak: number;
  lastPlayedDate: string | null;
  streakFreezes: number;
  credits: number;
  badges: string[];
  loaded: boolean;

  load: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  useStreakFreeze: () => Promise<void>;
  addBadge: (badge: string) => Promise<void>;
  nextRankAt: () => number;
  rankProgress: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  xp: 0,
  rank: 'Cadet',
  streak: 0,
  lastPlayedDate: null,
  streakFreezes: 1,
  credits: 0,
  badges: [],
  loaded: false,

  load: async () => {
    const state = await getGameState();
    set({
      xp: state.xp,
      rank: state.rank as Rank,
      streak: state.streak,
      lastPlayedDate: state.lastPlayedDate,
      streakFreezes: state.streakFreezes,
      credits: state.credits,
      badges: state.badges,
      loaded: true,
    });
  },

  addXp: async (amount) => {
    const newXp = get().xp + amount;
    const newRank = rankForXp(newXp);
    set({ xp: newXp, rank: newRank });
    await updateGameState({ xp: newXp, rank: newRank });
  },

  addCredits: async (amount) => {
    const newCredits = get().credits + amount;
    set({ credits: newCredits });
    await updateGameState({ credits: newCredits });
  },

  updateStreak: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastPlayedDate, streak, streakFreezes } = get();

    if (lastPlayedDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = streak;
    let newFreezes = streakFreezes;

    if (lastPlayedDate === yesterday) {
      newStreak = streak + 1;
    } else if (lastPlayedDate === null) {
      newStreak = 1;
    } else {
      const diff = (new Date(today).getTime() - new Date(lastPlayedDate).getTime()) / 86400000;
      if (diff === 2 && streakFreezes > 0) {
        newStreak = streak + 1;
        newFreezes = streakFreezes - 1;
      } else {
        newStreak = 1;
      }
    }

    set({ streak: newStreak, lastPlayedDate: today, streakFreezes: newFreezes });
    await updateGameState({ streak: newStreak, lastPlayedDate: today, streakFreezes: newFreezes });
  },

  useStreakFreeze: async () => {
    const { streakFreezes } = get();
    if (streakFreezes <= 0) return;
    const newFreezes = streakFreezes - 1;
    set({ streakFreezes: newFreezes });
    await updateGameState({ streakFreezes: newFreezes });
  },

  addBadge: async (badge) => {
    const { badges } = get();
    if (badges.includes(badge)) return;
    const newBadges = [...badges, badge];
    set({ badges: newBadges });
    await updateGameState({ badges: newBadges });
  },

  nextRankAt: () => nextRankThreshold(get().xp),

  rankProgress: () => {
    const { xp } = get();
    const currentRank = RANKS.findLast(r => xp >= r.threshold)!;
    const nextRank = RANKS.find(r => r.threshold > xp);
    if (!nextRank) return 100;
    const progress = ((xp - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100;
    return Math.min(100, progress);
  },
}));

export { RANKS, rankForXp };
