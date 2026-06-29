import { useEffect, useRef, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useGameStore } from '../store/gameStore';
import { recordAnswer } from '../db/nexusDb';
import { processRecallAnswer } from '../engine/srs';
import type { ContentItem, RoundType } from '../types/content';
import type { SrsRating } from '../engine/srs';
import RecallCard from '../exercises/RecallCard';
import LearnCard from '../exercises/LearnCard';
import ApplyCard from '../exercises/ApplyCard';
import CalculateCard from '../exercises/CalculateCard';
import LabCard from '../exercises/LabCard';
import CrackCard from '../exercises/CrackCard';
import RoundTransition from './RoundTransition';
import MicroCelebration from '../components/MicroCelebration';

const ROUND_LABELS: Record<RoundType, string> = {
  warmup: 'Warm-Up',
  learn: 'Learn',
  apply: 'Apply',
  lab: 'Lab',
  crack: 'Crack',
};

interface Props {
  onSessionComplete: (xpEarned: number) => void;
}

export default function SessionOrchestrator({ onSessionComplete }: Props) {
  const session = useSessionStore();
  const { addXp, addCredits } = useGameStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXp, setCelebrationXp] = useState(0);
  const pendingComplete = useRef<{ xp: number } | null>(null);

  const round = session.getCurrentRound();
  const item = session.getCurrentItem();
  const allRoundsComplete = session.currentRoundIndex >= session.rounds.length;

  useEffect(() => {
    if (allRoundsComplete) {
      onSessionComplete(session.totalXpEarned);
    }
  }, [allRoundsComplete]);

  if (!round || !item) {
    if (session.showingTransition) {
      const nextRoundIndex = session.currentRoundIndex + 1;
      const nextRound = session.rounds[nextRoundIndex];
      const currentRound = session.rounds[session.currentRoundIndex];
      if (!currentRound) return null;
      return (
        <RoundTransition
          completedRound={currentRound.type}
          nextRound={nextRound?.type ?? 'done'}
          xpEarned={currentRound.xpEarned}
          onComplete={() => session.nextRound()}
        />
      );
    }
    return null;
  }

  const roundProgress = round.currentItemIndex;
  const roundTotal = round.items.length;

  async function handleItemComplete(correct: boolean, xpEarned: number, _timeMs: number) {
    await recordAnswer(session.nodeId!, item!.ao, correct);
    await addXp(xpEarned);
    await addCredits(Math.floor(xpEarned / 5));

    session.recordResult({
      itemId: item!.id,
      correct,
      xpEarned,
      timeMs: _timeMs,
    });

    if (xpEarned > 0) {
      setCelebrationXp(xpEarned);
      setShowCelebration(true);
      pendingComplete.current = { xp: xpEarned };
    } else {
      advanceItem();
    }
  }

  function advanceItem() {
    pendingComplete.current = null;
    const nextIndex = round!.currentItemIndex + 1;
    session.completeCurrentItem();

    if (nextIndex >= round!.items.length) {
      session.completeRound();
    }
  }

  async function handleRecallComplete(rating: SrsRating, correct: boolean, timeMs: number) {
    await processRecallAnswer(item!.id, rating);
    const xp = correct ? item!.reward.xp : 0;
    await handleItemComplete(correct, xp, timeMs);
  }

  function renderItem(currentItem: ContentItem) {
    switch (currentItem.mode) {
      case 'recall':
        return <RecallCard key={currentItem.id} item={currentItem} onComplete={handleRecallComplete} />;
      case 'learn':
        return <LearnCard key={currentItem.id} item={currentItem} onComplete={(t) => handleItemComplete(true, currentItem.reward.xp, t)} />;
      case 'apply':
        return <ApplyCard key={currentItem.id} item={currentItem} onComplete={handleItemComplete} />;
      case 'calculate':
        return <CalculateCard key={currentItem.id} item={currentItem} onComplete={handleItemComplete} />;
      case 'lab':
        return <LabCard key={currentItem.id} item={currentItem} onComplete={handleItemComplete} />;
      case 'crack':
        return <CrackCard key={currentItem.id} item={currentItem} onComplete={handleItemComplete} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="font-display font-semibold text-forces text-sm">
            {ROUND_LABELS[round.type]}
          </div>
          <div className="font-mono text-muted text-xs">
            {roundProgress + 1} / {roundTotal}
          </div>
        </div>

        {/* Round progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-forces rounded-full transition-all duration-300"
            style={{ width: `${((roundProgress) / roundTotal) * 100}%` }}
          />
        </div>

        {/* Overall session progress */}
        <div className="flex gap-1 mt-2">
          {session.rounds.map((r, i) => {
            const isActive = i === session.currentRoundIndex;
            const isDone = r.completed;
            const colors: Record<RoundType, string> = {
              warmup: '#f59e0b', learn: '#3b82f6', apply: '#3b82f6', lab: '#22c55e', crack: '#8b5cf6',
            };
            return (
              <div
                key={r.type}
                className="h-0.5 flex-1 rounded-full transition-all"
                style={{
                  background: isDone ? colors[r.type] : isActive ? `${colors[r.type]}60` : '#1e2130',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-xl mx-auto w-full">
        {renderItem(item)}
      </div>

      {/* Transition overlay */}
      {session.showingTransition && (() => {
        const nextRoundIndex = session.currentRoundIndex + 1;
        const nextRound = session.rounds[nextRoundIndex];
        const currentRound = session.rounds[session.currentRoundIndex];
        if (!currentRound) return null;
        return (
          <RoundTransition
            completedRound={currentRound.type}
            nextRound={nextRound?.type ?? 'done'}
            xpEarned={currentRound.xpEarned}
            onComplete={() => session.nextRound()}
          />
        );
      })()}

      {/* Micro-celebration */}
      <MicroCelebration
        show={showCelebration}
        xpEarned={celebrationXp}
        onComplete={() => {
          setShowCelebration(false);
          advanceItem();
        }}
      />
    </div>
  );
}
