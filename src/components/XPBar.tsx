import { useGameStore } from '../store/gameStore';

export default function XPBar() {
  const { xp, rank, rankProgress, nextRankAt } = useGameStore();
  const progress = rankProgress();

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="font-display font-semibold text-forces text-sm">{rank}</span>
        <span className="font-mono text-muted text-xs">{xp.toLocaleString()} XP</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-forces rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-muted font-mono text-right">
        Next rank at {nextRankAt().toLocaleString()} XP
      </div>
    </div>
  );
}
