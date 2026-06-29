import { useGameStore } from '../store/gameStore';

export default function StreakDisplay() {
  const { streak, streakFreezes } = useGameStore();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xl">🔥</span>
        <div>
          <div className="font-display font-bold text-matter text-lg leading-none">{streak}</div>
          <div className="text-xs text-muted leading-none">day streak</div>
        </div>
      </div>
      {streakFreezes > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted" title="Streak freeze available">
          <span>🧊</span>
          <span>{streakFreezes}</span>
        </div>
      )}
    </div>
  );
}
