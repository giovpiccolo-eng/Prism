import { useState, useRef } from 'react';
import type { RecallItem } from '../types/content';
import type { SrsRating } from '../engine/srs';

interface Props {
  item: RecallItem;
  onComplete: (rating: SrsRating, correct: boolean, timeMs: number) => void;
}

export default function RecallCard({ item, onComplete }: Props) {
  const [phase, setPhase] = useState<'front' | 'typing' | 'revealed'>('front');
  const [userText, setUserText] = useState('');
  const startTime = useRef(Date.now());

  const keywords = item.keywords.map(k => k.toLowerCase());

  function matchedKeywords(text: string): string[] {
    const lower = text.toLowerCase();
    return keywords.filter(k => lower.includes(k));
  }

  function missedKeywords(text: string): string[] {
    const lower = text.toLowerCase();
    return keywords.filter(k => !lower.includes(k));
  }

  const hit = matchedKeywords(userText);
  const miss = missedKeywords(userText);

  function handleReveal() {
    setPhase('revealed');
  }

  function handleRate(rating: SrsRating) {
    const correct = rating !== 'again';
    onComplete(rating, correct, Date.now() - startTime.current);
  }

  return (
    <div className="animate-fade-in-up space-y-4">
      <div className="text-xs font-mono text-muted uppercase tracking-widest">
        Recall · {item.ao} · {item.command}
      </div>

      <div className="card p-6">
        <div className="text-lg text-text leading-relaxed">{item.front}</div>
      </div>

      {phase === 'front' && (
        <div className="space-y-3">
          <textarea
            autoFocus
            className="w-full bg-surface border border-border rounded-lg p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-forces/60 transition-colors"
            rows={3}
            placeholder="Type your answer here…"
            value={userText}
            onChange={e => { setUserText(e.target.value); setPhase('typing'); }}
          />
          <button
            onClick={handleReveal}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-forces hover:bg-forces/90 transition-colors"
          >
            Reveal answer
          </button>
        </div>
      )}

      {phase === 'typing' && (
        <div className="space-y-3">
          <textarea
            autoFocus
            className="w-full bg-surface border border-border rounded-lg p-4 text-text font-mono text-sm resize-none focus:outline-none focus:border-forces/60 transition-colors"
            rows={3}
            value={userText}
            onChange={e => setUserText(e.target.value)}
          />

          {/* Live keyword matching */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map(k => {
                const matched = hit.includes(k);
                return (
                  <span
                    key={k}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                      matched ? 'bg-life/20 text-life border border-life/40' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {matched ? '✓ ' : ''}{k}
                  </span>
                );
              })}
            </div>
          )}

          <button
            onClick={handleReveal}
            className="w-full py-3 rounded-lg font-display font-semibold text-bg bg-forces hover:bg-forces/90 transition-colors"
          >
            Reveal answer
          </button>
        </div>
      )}

      {phase === 'revealed' && (
        <div className="animate-fade-in-up space-y-4">
          {/* Show the back */}
          <div className="card p-4 border-life/30">
            <div className="text-xs font-mono text-life mb-2 tracking-widest">ANSWER</div>
            <div className="font-mono text-text text-sm leading-relaxed">{item.back}</div>
          </div>

          {/* How'd you do? */}
          <div>
            <div className="text-xs text-muted mb-3 text-center">How well did you know this?</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRate('again')}
                className="py-3 rounded-lg font-display font-semibold text-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Again
                <div className="text-xs text-muted font-body font-normal mt-0.5">~1 day</div>
              </button>
              <button
                onClick={() => handleRate('good')}
                className="py-3 rounded-lg font-display font-semibold text-sm border border-matter/40 text-matter hover:bg-matter/10 transition-colors"
              >
                Good
                <div className="text-xs text-muted font-body font-normal mt-0.5">~3 days</div>
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="py-3 rounded-lg font-display font-semibold text-sm border border-life/40 text-life hover:bg-life/10 transition-colors"
              >
                Easy
                <div className="text-xs text-muted font-body font-normal mt-0.5">~1 week</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
