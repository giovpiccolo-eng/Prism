interface Props {
  hitKeywords: string[];
  missedKeywords: string[];
  marksEarned: number;
  marksTotal: number;
}

export default function MarkSchemeReveal({ hitKeywords, missedKeywords, marksEarned, marksTotal }: Props) {
  const pct = marksTotal > 0 ? (marksEarned / marksTotal) * 100 : 0;
  const color = pct === 100 ? 'text-life' : pct >= 50 ? 'text-matter' : 'text-red-400';

  return (
    <div className="animate-fade-in-up card p-4 mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase tracking-widest font-mono">Mark scheme</span>
        <span className={`font-mono font-semibold text-sm ${color}`}>
          {marksEarned} / {marksTotal}
        </span>
      </div>

      {hitKeywords.length > 0 && (
        <div className="space-y-1">
          {hitKeywords.map(kw => (
            <div key={kw} className="flex items-center gap-2 text-sm">
              <span className="text-life text-base">✓</span>
              <span className="keyword-hit">{kw}</span>
            </div>
          ))}
        </div>
      )}

      {missedKeywords.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted mb-1">Missing:</div>
          {missedKeywords.map(kw => (
            <div key={kw} className="flex items-center gap-2 text-sm">
              <span className="text-red-400 text-base">✗</span>
              <span className="keyword-miss">{kw}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
