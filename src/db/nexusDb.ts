import Dexie, { type Table } from 'dexie';
import type { NodeMastery, SrsSchedule } from '../types/content';

interface GameStateRow {
  id: 1;
  xp: number;
  rank: string;
  streak: number;
  lastPlayedDate: string | null;
  streakFreezes: number;
  credits: number;
  badges: string[];
}

interface SessionLogRow {
  id?: number;
  date: string;
  nodeId: string;
  xpEarned: number;
  itemsCompleted: number;
}

class NexusDatabase extends Dexie {
  progress!: Table<NodeMastery, string>;
  srsItems!: Table<SrsSchedule, string>;
  gameState!: Table<GameStateRow, number>;
  sessionLog!: Table<SessionLogRow, number>;

  constructor() {
    super('NexusDB');
    this.version(1).stores({
      progress: 'nodeId',
      srsItems: 'itemId',
      gameState: 'id',
      sessionLog: '++id, date, nodeId',
    });
  }
}

export const db = new NexusDatabase();

const DEFAULT_GAME_STATE: GameStateRow = {
  id: 1,
  xp: 0,
  rank: 'Cadet',
  streak: 0,
  lastPlayedDate: null,
  streakFreezes: 1,
  credits: 0,
  badges: [],
};

export async function getGameState(): Promise<GameStateRow> {
  const state = await db.gameState.get(1);
  if (!state) {
    await db.gameState.put(DEFAULT_GAME_STATE);
    return DEFAULT_GAME_STATE;
  }
  return state;
}

export async function updateGameState(patch: Partial<GameStateRow>): Promise<void> {
  await db.gameState.update(1, patch);
}

export async function getNodeMastery(nodeId: string): Promise<NodeMastery> {
  const m = await db.progress.get(nodeId);
  if (!m) {
    return {
      nodeId,
      ao1Attempts: 0, ao1Correct: 0,
      ao2Attempts: 0, ao2Correct: 0,
      ao3Attempts: 0, ao3Correct: 0,
      totalAttempts: 0,
      masteredAt: null,
    };
  }
  return m;
}

export async function recordAnswer(nodeId: string, ao: string, correct: boolean): Promise<void> {
  const m = await getNodeMastery(nodeId);
  const updated = { ...m };

  if (ao === 'AO1') {
    updated.ao1Attempts++;
    if (correct) updated.ao1Correct++;
  } else if (ao === 'AO2') {
    updated.ao2Attempts++;
    if (correct) updated.ao2Correct++;
  } else if (ao === 'AO3') {
    updated.ao3Attempts++;
    if (correct) updated.ao3Correct++;
  }
  updated.totalAttempts++;

  const pct = (n: NodeMastery) => {
    const checks = [
      n.ao1Attempts > 0 ? n.ao1Correct / n.ao1Attempts : null,
      n.ao2Attempts > 0 ? n.ao2Correct / n.ao2Attempts : null,
      n.ao3Attempts > 0 ? n.ao3Correct / n.ao3Attempts : null,
    ].filter(v => v !== null) as number[];
    return checks.length ? checks.reduce((a, b) => a + b, 0) / checks.length : 0;
  };

  if (pct(updated) >= 0.8 && updated.totalAttempts >= 10 && !updated.masteredAt) {
    updated.masteredAt = new Date().toISOString();
  }

  await db.progress.put(updated);
}

export async function getSrsItem(itemId: string): Promise<SrsSchedule | null> {
  return (await db.srsItems.get(itemId)) ?? null;
}

export async function updateSrsItem(schedule: SrsSchedule): Promise<void> {
  await db.srsItems.put(schedule);
}

export async function logSession(nodeId: string, xpEarned: number, itemsCompleted: number): Promise<void> {
  await db.sessionLog.add({
    date: new Date().toISOString(),
    nodeId,
    xpEarned,
    itemsCompleted,
  });
}
