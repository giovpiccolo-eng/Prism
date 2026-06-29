import { useState, useRef } from 'react';
import type { CalculateItem } from '../types/content';
import MarkSchemeReveal from '../components/MarkSchemeReveal';
import { scoreCalculation } from '../engine/scoring';

interface Props {
  item: CalculateItem;
  onComplete: (correct: boolean, xpEarned: number, timeMs: number) => void;
}

export default function CalculateCard({ item, onComplete }: Props) {
  const [equation, setEquation] = useState('');
  const [substitution, setSubstitution] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const result = submitted
    ? scoreCalculation(equation, substitution, answer, item.equation, item.answer, item.reward.xp, item.reward.credits, Date.now() - startTime.current)
    : null;

  function handleSubmit() {
    if (!equation.trim() || !answer.trim()) return;
    setSubmitted(true);
  }

  function handleContinue() {
    if (!result) return;
    onComplete(result.marksEarned === result.marksTotal, result.xpEarned, Date.now() - startTime.current);
  }

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="text-xs font-mono text-muted uppercase tracking-widest">
        Calculate · {item.ao} · {item.marks} mark{item.marks !== 1 ? 's' : ''}
      </div>

      <div className="card p-5">
        <div className="text-text leading-relaxed">{item.stem}</div>
      </div>

      {/* Given values */}
      {Object.keys(item.given).length > 0 && (
        <div className="card p-4">
          <div className="text-muted text-xs font-mono mb-2">GIVEN</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(item.given).map(([k, v]) => (
              <div key={k} className="font-mono text-sm">
                <span className="text-muted">{k} = </span>
                <span className="text-forces">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!submitted ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted block mb-1">
              [1] Write the equation:
            </label>
            <input
              autoFocus
              type="text"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-forces text-sm focus:outline-none focus:border-forces/60 transition-colors"
              placeholder="e.g. v = d / t"
              value={equation}
              onChange={e => setEquation(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted block mb-1">
              [2] Substitute values:
            </label>
            <input
              type="text"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-forces text-sm focus:outline-none focus:border-forces/60 transition-colors"
              placeholder="e.g. v = 100 / 20"
              value={substitution}
              onChange={e => setSubstitution(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted block mb-1">
              [3] Answer with unit:
            </label>
            <input
              type="text"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-forces text-sm focus:outline-none focus:border-forces/60 transition-colors"
              placeholder="e.g. 5 m/s"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="text-xs text-muted bg-surface/50 rounded-lg p-3">
            💡 Method marks: correct equation [1] + substitution [1] + answer with unit [1]. Unit-only error still earns 2/3.
          </div>

          <button
            onClick={handleSubmit}
            disabled={!equation.trim() || !answer.trim()}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-forces hover:bg-forces/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check working
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          {/* Show correct working */}
          <div className="card p-4 border-forces/30">
            <div className="text-forces text-xs font-mono mb-3 tracking-widest">FULL WORKING</div>
            <div className="font-mono text-sm space-y-1">
              <div><span className="text-muted">equation: </span><span className="text-forces">{item.equation}</span></div>
              <div><span className="text-muted">answer:   </span><span className="text-life">{item.answer.value} {item.answer.unit}</span></div>
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

          {item.frontier && (
            <div className="card p-3 border-nexus/30">
              <div className="text-nexus text-xs font-mono mb-1">FRONTIER ✦</div>
              <div className="text-sm text-muted">{item.frontier}</div>
            </div>
          )}

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
