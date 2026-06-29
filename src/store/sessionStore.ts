import { create } from 'zustand';
import type { ContentItem, RoundType } from '../types/content';

export interface SessionItemResult {
  itemId: string;
  correct: boolean;
  xpEarned: number;
  timeMs: number;
}

export interface SessionRoundState {
  type: RoundType;
  items: ContentItem[];
  currentItemIndex: number;
  results: SessionItemResult[];
  completed: boolean;
  xpEarned: number;
}

interface SessionStore {
  active: boolean;
  nodeId: string | null;
  rounds: SessionRoundState[];
  currentRoundIndex: number;
  totalXpEarned: number;
  showingTransition: boolean;
  startedAt: string | null;

  startSession: (nodeId: string, rounds: SessionRoundState[]) => void;
  recordResult: (result: SessionItemResult) => void;
  completeCurrentItem: () => void;
  completeRound: () => void;
  nextRound: () => void;
  endTransition: () => void;
  endSession: () => void;
  getCurrentRound: () => SessionRoundState | null;
  getCurrentItem: () => ContentItem | null;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  active: false,
  nodeId: null,
  rounds: [],
  currentRoundIndex: 0,
  totalXpEarned: 0,
  showingTransition: false,
  startedAt: null,

  startSession: (nodeId, rounds) => {
    set({
      active: true,
      nodeId,
      rounds,
      currentRoundIndex: 0,
      totalXpEarned: 0,
      showingTransition: false,
      startedAt: new Date().toISOString(),
    });
  },

  recordResult: (result) => {
    const { rounds, currentRoundIndex } = get();
    const round = rounds[currentRoundIndex];
    if (!round) return;

    const updatedRound = {
      ...round,
      results: [...round.results, result],
      xpEarned: round.xpEarned + result.xpEarned,
    };
    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = updatedRound;

    set({
      rounds: updatedRounds,
      totalXpEarned: get().totalXpEarned + result.xpEarned,
    });
  },

  completeCurrentItem: () => {
    const { rounds, currentRoundIndex } = get();
    const round = rounds[currentRoundIndex];
    if (!round) return;

    const updatedRound = {
      ...round,
      currentItemIndex: round.currentItemIndex + 1,
    };
    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = updatedRound;
    set({ rounds: updatedRounds });
  },

  completeRound: () => {
    const { rounds, currentRoundIndex } = get();
    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = { ...updatedRounds[currentRoundIndex], completed: true };
    set({ rounds: updatedRounds, showingTransition: true });
  },

  nextRound: () => {
    set(s => ({ currentRoundIndex: s.currentRoundIndex + 1, showingTransition: false }));
  },

  endTransition: () => {
    set({ showingTransition: false });
  },

  endSession: () => {
    set({
      active: false,
      nodeId: null,
      rounds: [],
      currentRoundIndex: 0,
      totalXpEarned: 0,
      showingTransition: false,
      startedAt: null,
    });
  },

  getCurrentRound: () => {
    const { rounds, currentRoundIndex } = get();
    return rounds[currentRoundIndex] ?? null;
  },

  getCurrentItem: () => {
    const { rounds, currentRoundIndex } = get();
    const round = rounds[currentRoundIndex];
    if (!round) return null;
    return round.items[round.currentItemIndex] ?? null;
  },
}));
