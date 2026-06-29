import { useState, useRef } from 'react';
import type { CrackItem } from '../types/content';
import MarkSchemeReveal from '../components/MarkSchemeReveal';
import { scoreKeywords } from '../engine/scoring';

interface Props {
  item: CrackItem;
  onComplete: (correct: boolean, xpEarned: number, timeMs: number) => void;
}

export default function CrackCard({ item, onComplete }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  const result = submitted
    ? scoreKeywords(answer, item.mark_scheme, item.reward.xp, item.reward.credits, Date.now() - startTime.current)
    : null;

  function handleContinue() {
    if (!result) return;
    const correct = result.marksEarned >= Math.ceil(result.marksTotal * 0.5);
    onComplete(correct, result.xpEarned, Date.now() - startTime.current);
  }

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-xs font-mono text-muted uppercase tracking-widest">
          Crack · Exam Boss
        </div>
        <div className="font-mono text-xs text-nexus border border-nexus/40 px-2 py-0.5 rounded">
          {item.marks} marks
        </div>
      </div>

      <div className="card p-5 border-nexus/30">
        <div className="text-nexus text-xs font-mono mb-3 tracking-widest">⚡ EXAM QUESTION</div>
        <div className="text-text leading-relaxed whitespace-pre-line">{item.stem}</div>
      </div>

      {!submitted ? (
        <div className="space-y-3">
          <div className="text-xs text-muted bg-surface/50 rounded-lg p-3">
            Write your full answer. Include key terms, numbers, and units where relevant.
            {item.marks >= 4 && ' For high-mark questions, structure your answer point by point.'}
          </div>
          <textarea
            autoFocus
            className="w-full bg-surface border border-border rounded-lg p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-nexus/60 transition-colors"
            rows={Math.max(5, item.marks + 2)}
            placeholder={`Write a ${item.marks}-mark answer…`}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
          <div className="flex justify-between text-xs text-muted font-mono">
            <span>{answer.length} characters</span>
            <span>target: ~{item.marks * 15} chars minimum</span>
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!answer.trim() || answer.length < 10}
            className="w-full py-3 rounded-lg font-display font-semibold border-2 border-nexus text-nexus hover:bg-nexus/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Mark my answer ⚡
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          {result && (
            <>
              <div className={`card p-4 border ${result.marksEarned === result.marksTotal ? 'border-life/40' : result.marksEarned >= result.marksTotal / 2 ? 'border-matter/40' : 'border-red-500/30'}`}>
                <div className="text-xs font-mono text-muted mb-1">YOUR ANSWER</div>
                <div className="text-text text-sm leading-relaxed whitespace-pre-line">{answer}</div>
              </div>

              <MarkSchemeReveal
                hitKeywords={result.hitKeywords}
                missedKeywords={result.missedKeywords}
                marksEarned={result.marksEarned}
                marksTotal={result.marksTotal}
              />
            </>
          )}

          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg font-display font-semibold border border-nexus/40 text-nexus hover:bg-nexus/10 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
