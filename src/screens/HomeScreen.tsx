import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import StreakDisplay from '../components/StreakDisplay';
import XPBar from '../components/XPBar';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { loaded } = useGameStore();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="font-mono text-muted text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header bar */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-xl text-text tracking-tight">NEXUS</span>
              <span className="text-xs text-muted font-mono">· Coordinated Sciences</span>
            </div>
            <div className="flex gap-2 mt-0.5">
              <span className="text-xs text-forces font-mono">LIFE</span>
              <span className="text-xs text-matter font-mono">MATTER</span>
              <span className="text-xs font-mono" style={{ color: '#3b82f6' }}>FORCES</span>
            </div>
          </div>
          <StreakDisplay />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 pt-8 pb-6 max-w-sm mx-auto w-full">
        {/* Mission card */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
          {/* Decorative realm bars */}
          <div className="flex gap-1 w-full max-w-xs">
            <div className="h-1 flex-1 rounded-full bg-life opacity-80" />
            <div className="h-1 flex-1 rounded-full bg-matter opacity-80" />
            <div className="h-1 flex-1 rounded-full" style={{ background: '#3b82f6', opacity: 0.8 }} />
            <div className="h-1 flex-1 rounded-full bg-nexus opacity-80" />
          </div>

          <div>
            <div className="text-muted font-mono text-xs tracking-widest mb-3">TODAY'S MISSION</div>
            <div className="font-display font-bold text-4xl text-text mb-2 leading-tight">
              F1 · Motion
            </div>
            <div className="text-muted text-sm">
              Speed, velocity, acceleration<br />
              distance-time & speed-time graphs
            </div>
          </div>

          {/* Mission meta */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="card p-3 text-center">
              <div className="font-mono text-forces font-semibold">~28</div>
              <div className="text-xs text-muted">min</div>
            </div>
            <div className="card p-3 text-center">
              <div className="font-mono text-forces font-semibold">5</div>
              <div className="text-xs text-muted">rounds</div>
            </div>
            <div className="card p-3 text-center">
              <div className="font-mono text-forces font-semibold">AO2</div>
              <div className="text-xs text-muted">focus</div>
            </div>
          </div>

          {/* THE dominant button */}
          <button
            onClick={() => navigate('/session/F1')}
            className="w-full py-5 rounded-xl font-display font-bold text-xl text-bg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 0 32px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            START TODAY'S MISSION
          </button>
        </div>

        {/* Bottom section */}
        <div className="space-y-4">
          <XPBar />

          <button
            onClick={() => navigate('/map')}
            className="w-full py-3 rounded-lg font-display font-semibold text-sm border border-border text-muted hover:text-text hover:border-forces/40 transition-colors"
          >
            World Model map →
          </button>
        </div>
      </div>
    </div>
  );
}
