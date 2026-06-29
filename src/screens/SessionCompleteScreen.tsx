import { useGameStore } from '../store/gameStore';

interface Props {
  xpEarned: number;
  nodeLabel: string;
  onContinue: () => void;
  onOneMore: () => void;
}

export default function SessionCompleteScreen({ xpEarned, nodeLabel, onContinue, onOneMore }: Props) {
  const { xp, rank, streak } = useGameStore();

  return (
    <div className="flex flex-col min-h-screen bg-bg items-center justify-center px-4">
      <div className="animate-celebrate text-center max-w-sm w-full space-y-6">
        <div className="text-6xl mb-2">⚡</div>

        <div>
          <div className="font-display font-bold text-3xl text-text mb-1">Mission complete.</div>
          <div className="text-muted font-mono text-sm">{nodeLabel}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <div className="font-display font-bold text-forces text-2xl">+{xpEarned}</div>
            <div className="text-xs text-muted font-mono">XP earned</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-display font-bold text-matter text-2xl">{streak}</div>
            <div className="text-xs text-muted font-mono">day streak</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-display font-bold text-nexus text-2xl">{xp.toLocaleString()}</div>
            <div className="text-xs text-muted font-mono">total XP</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-muted font-mono text-xs mb-1">RANK</div>
          <div className="font-display font-semibold text-forces">{rank}</div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onOneMore}
            className="w-full py-3 rounded-lg font-display font-semibold border border-forces/40 text-forces hover:bg-forces/10 transition-colors"
          >
            One more question? →
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-forces hover:bg-forces/90 transition-colors"
          >
            Back to base
          </button>
        </div>
      </div>
    </div>
  );
}
