import { useState, useRef } from 'react';
import type { ApplyItem } from '../types/content';
import GraphWidget from '../components/GraphWidget';
import MarkSchemeReveal from '../components/MarkSchemeReveal';
import { scoreOption } from '../engine/scoring';

interface Props {
  item: ApplyItem;
  onComplete: (correct: boolean, xpEarned: number, timeMs: number) => void;
}

const REALM_COLORS = { life: '#22c55e', matter: '#f59e0b', forces: '#3b82f6' };

export default function ApplyCard({ item, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const color = REALM_COLORS[item.realm];

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
  }

  function handleContinue() {
    if (selected === null) return;
    const result = scoreOption(selected, item.correct_option ?? 0, item.reward.xp, item.reward.credits, Date.now() - startTime.current);
    onComplete(result.marksEarned > 0, result.xpEarned, Date.now() - startTime.current);
  }

  const markResult = selected !== null
    ? scoreOption(selected, item.correct_option ?? 0, item.reward.xp, item.reward.credits, Date.now() - startTime.current)
    : null;

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="text-xs font-mono text-muted uppercase tracking-widest">
        Apply · {item.ao} · {item.command}
      </div>

      <div className="card p-5">
        <div className="text-text leading-relaxed">{item.stem}</div>
      </div>

      {item.dataset && (
        <GraphWidget dataset={item.dataset} realmColor={color} />
      )}

      {item.options && (
        <div className="space-y-2">
          {item.options.map((opt, i) => {
            let borderColor = '#1e2130';
            let bg = 'transparent';

            if (submitted && selected === i) {
              if (i === item.correct_option) {
                borderColor = '#22c55e';
                bg = 'rgba(34,197,94,0.1)';
              } else {
                borderColor = '#ef4444';
                bg = 'rgba(239,68,68,0.1)';
              }
            } else if (submitted && i === item.correct_option) {
              borderColor = '#22c55e';
              bg = 'rgba(34,197,94,0.05)';
            } else if (!submitted && selected === i) {
              borderColor = color;
              bg = `${color}15`;
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => !submitted && setSelected(i)}
                className="w-full text-left p-4 rounded-lg border transition-all text-sm text-text"
                style={{ borderColor, background: bg }}
              >
                <span className="font-mono text-muted mr-3">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {submitted && i === item.correct_option && <span className="ml-2 text-life">✓</span>}
                {submitted && selected === i && i !== item.correct_option && <span className="ml-2 text-red-400">✗</span>}
              </button>
            );
          })}
        </div>
      )}

      {!submitted && selected !== null && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-display font-semibold text-bg transition-colors"
          style={{ background: color }}
        >
          Submit answer
        </button>
      )}

      {submitted && markResult && (
        <div className="space-y-3 animate-fade-in-up">
          <MarkSchemeReveal
            hitKeywords={markResult.hitKeywords}
            missedKeywords={markResult.missedKeywords}
            marksEarned={markResult.marksEarned}
            marksTotal={markResult.marksTotal}
          />
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg font-display font-semibold border border-forces/40 text-forces hover:bg-forces/10 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
