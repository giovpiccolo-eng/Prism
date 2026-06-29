import { useState, useRef } from 'react';
import type { LabItem } from '../types/content';
import MarkSchemeReveal from '../components/MarkSchemeReveal';
import { scoreKeywords } from '../engine/scoring';

interface Props {
  item: LabItem;
  onComplete: (correct: boolean, xpEarned: number, timeMs: number) => void;
}

export default function LabCard({ item, onComplete }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const result = submitted
    ? scoreKeywords(answer, item.mark_scheme, item.reward.xp, item.reward.credits, Date.now() - startTime.current)
    : null;

  function handleContinue() {
    if (!result) return;
    onComplete(result.marksEarned > 0, result.xpEarned, Date.now() - startTime.current);
  }

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="text-xs font-mono text-muted uppercase tracking-widest">
        Lab · {item.ao} · Practical
      </div>

      <div className="card p-5 border-life/20">
        <div className="text-life text-xs font-mono mb-2">🧪 SCENARIO</div>
        <div className="text-text leading-relaxed mb-3">{item.scenario}</div>
        <div className="text-muted text-xs font-mono mb-2 border-t border-border pt-3">QUESTION</div>
        <div className="text-text">{item.question}</div>
      </div>

      {!submitted ? (
        <div className="space-y-3">
          <textarea
            autoFocus
            className="w-full bg-surface border border-border rounded-lg p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-life/60 transition-colors"
            rows={4}
            placeholder="State the independent variable, dependent variable, and a control variable…"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
          <button
            onClick={() => setSubmitted(true)}
            disabled={!answer.trim()}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-life hover:bg-life/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="card p-4 border-life/30">
            <div className="text-life text-xs font-mono mb-2">VARIABLES</div>
            <div className="space-y-1.5 text-sm font-mono">
              <div><span className="text-muted">independent: </span><span className="text-text">{item.variables.independent}</span></div>
              <div><span className="text-muted">dependent:   </span><span className="text-text">{item.variables.dependent}</span></div>
              <div><span className="text-muted">control:     </span><span className="text-text">{item.variables.control.join(', ')}</span></div>
            </div>
          </div>

          {result && (
            <MarkSchemeReveal
              hitKeywords={result.hitKeywords}
              missedKeywords={result.missedKeywords}
              marksEarned={result.marksEarned}
              marksTotal={result.marksTotal}
            />
          )}

          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg font-display font-semibold border border-life/40 text-life hover:bg-life/10 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
