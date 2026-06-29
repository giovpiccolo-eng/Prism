import { useEffect } from 'react';

const ROUND_NAMES: Record<string, { label: string; emoji: string; color: string }> = {
  warmup: { label: 'WARM-UP', emoji: '🔥', color: '#f59e0b' },
  learn:  { label: 'LEARN',   emoji: '🔬', color: '#3b82f6' },
  apply:  { label: 'APPLY',   emoji: '📊', color: '#3b82f6' },
  lab:    { label: 'LAB',     emoji: '🧪', color: '#22c55e' },
  crack:  { label: 'CRACK',   emoji: '⚡', color: '#8b5cf6' },
};

interface Props {
  completedRound: string;
  nextRound: string;
  xpEarned: number;
  onComplete: () => void;
}

export default function RoundTransition({ completedRound, nextRound, xpEarned, onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1200);
    return () => clearTimeout(t);
  }, []);

  const done = ROUND_NAMES[completedRound] ?? { label: completedRound.toUpperCase(), emoji: '✓', color: '#22c55e' };
  const next = ROUND_NAMES[nextRound] ?? { label: nextRound.toUpperCase(), emoji: '→', color: '#3b82f6' };

  return (
    <div className="fixed inset-0 bg-bg/90 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="animate-celebrate flex flex-col items-center gap-4">
        <div className="text-4xl">{done.emoji}</div>
        <div className="text-center">
          <div className="font-mono text-xs text-muted mb-1">ROUND COMPLETE</div>
          <div className="font-display font-bold text-xl" style={{ color: done.color }}>
            {done.label}
          </div>
        </div>
        {xpEarned > 0 && (
          <div className="font-mono text-forces">+{xpEarned} XP</div>
        )}
        <div className="text-muted text-xs">→</div>
        <div className="text-center">
          <div className="font-mono text-xs text-muted mb-1">UP NEXT</div>
          <div className="font-display font-semibold text-lg" style={{ color: next.color }}>
            {next.emoji} {next.label}
          </div>
        </div>
      </div>
    </div>
  );
}
