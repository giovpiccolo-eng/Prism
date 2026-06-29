import { useState, useRef } from 'react';
import type { LearnItem } from '../types/content';

interface Props {
  item: LearnItem;
  onComplete: (timeMs: number) => void;
}

export default function LearnCard({ item, onComplete }: Props) {
  const [phase, setPhase] = useState<'predict' | 'reveal' | 'explain'>('predict');
  const [prediction, setPrediction] = useState('');
  const startTime = useRef(Date.now());

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="text-xs font-mono text-muted uppercase tracking-widest">
        Learn · Discover
      </div>

      <div className="card p-5">
        <div className="text-muted text-xs font-mono mb-2">CONCEPT</div>
        <div className="text-text leading-relaxed">{item.stem}</div>
      </div>

      {phase === 'predict' && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="card p-4 border-matter/30">
            <div className="text-matter text-xs font-mono mb-2 tracking-widest">PREDICT FIRST</div>
            <div className="text-text">{item.predict}</div>
          </div>
          <textarea
            autoFocus
            className="w-full bg-surface border border-border rounded-lg p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-matter/60 transition-colors"
            rows={2}
            placeholder="Type your prediction…"
            value={prediction}
            onChange={e => setPrediction(e.target.value)}
          />
          <button
            onClick={() => setPhase('reveal')}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-matter hover:bg-matter/90 transition-colors"
          >
            See the answer →
          </button>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="space-y-3 animate-fade-in-up">
          {prediction && (
            <div className="card p-3 border-border">
              <div className="text-muted text-xs mb-1">Your prediction:</div>
              <div className="text-text font-mono text-sm">{prediction}</div>
            </div>
          )}
          <div className="card p-4 border-life/30">
            <div className="text-life text-xs font-mono mb-2 tracking-widest">ANSWER</div>
            <div className="font-mono text-text">{item.reveal}</div>
          </div>
          <button
            onClick={() => setPhase('explain')}
            className="w-full py-3 rounded-lg font-display font-semibold border border-forces/40 text-forces hover:bg-forces/10 transition-colors"
          >
            Why? →
          </button>
        </div>
      )}

      {phase === 'explain' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="card p-5 border-forces/30">
            <div className="text-forces text-xs font-mono mb-3 tracking-widest">EXPLANATION</div>
            <div className="text-text leading-relaxed text-sm">{item.explanation}</div>
          </div>

          <div className="card p-3 border-border">
            <div className="text-muted text-xs font-mono mb-1">KEY EQUATION</div>
            <div className="font-mono text-forces text-lg">{item.concept}</div>
          </div>

          <button
            onClick={() => onComplete(Date.now() - startTime.current)}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-forces hover:bg-forces/90 transition-colors"
          >
            Got it ✓
          </button>
        </div>
      )}
    </div>
  );
}
