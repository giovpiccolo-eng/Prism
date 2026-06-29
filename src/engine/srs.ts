import type { SrsSchedule } from '../types/content';
import { getSrsItem, updateSrsItem } from '../db/nexusDb';

export type SrsRating = 'again' | 'good' | 'easy';

const MIN_EASE = 1.3;

export function scheduleSrsItem(schedule: SrsSchedule, rating: SrsRating): SrsSchedule {
  const now = new Date();
  let { interval, ease } = schedule;

  if (rating === 'again') {
    interval = 1;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else if (rating === 'good') {
    interval = Math.max(1, Math.round(interval * ease));
    // ease stays the same
  } else {
    interval = Math.max(1, Math.round(interval * ease * 1.3));
    ease = Math.min(3.0, ease + 0.1);
  }

  const due = new Date(now.getTime() + interval * 86400000).toISOString().split('T')[0];

  return {
    ...schedule,
    interval,
    ease,
    due,
    lastReviewed: now.toISOString(),
  };
}

export async function processRecallAnswer(itemId: string, rating: SrsRating): Promise<void> {
  const existing = await getSrsItem(itemId);
  const current: SrsSchedule = existing ?? {
    itemId,
    interval: 1,
    ease: 2.5,
    due: null,
    lastReviewed: null,
  };
  const updated = scheduleSrsItem(current, rating);
  await updateSrsItem(updated);
}

export async function getDueItems(itemIds: string[]): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];
  const due: string[] = [];
  for (const id of itemIds) {
    const s = await getSrsItem(id);
    if (!s || !s.due || s.due <= today) {
      due.push(id);
    }
  }
  return due;
}
