import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { useGameStore } from '../store/gameStore';
import { logSession } from '../db/nexusDb';
import SessionOrchestrator from '../session/SessionOrchestrator';
import SessionCompleteScreen from './SessionCompleteScreen';
import type { ContentItem, RoundType } from '../types/content';
import type { SessionRoundState } from '../store/sessionStore';
import nodesData from '../data/nodes.json';
import f1Items from '../data/items/F1_motion.json';

const NODE_ITEMS: Record<string, ContentItem[]> = {
  F1: f1Items as ContentItem[],
};

function buildRounds(nodeId: string): SessionRoundState[] {
  const allItems = NODE_ITEMS[nodeId] ?? [];

  const byMode = (mode: string) => allItems.filter(i => i.mode === mode);

  const makeRound = (type: RoundType, modes: string[]): SessionRoundState => {
    const items = modes.flatMap(m => byMode(m)).slice(0, 3);
    return { type, items, currentItemIndex: 0, results: [], completed: false, xpEarned: 0 };
  };

  return [
    makeRound('warmup', ['recall']),
    makeRound('learn', ['learn']),
    makeRound('apply', ['apply']),
    makeRound('lab', ['lab', 'calculate']),
    makeRound('crack', ['crack']),
  ].filter(r => r.items.length > 0);
}

function getNodeLabel(nodeId: string): string {
  const node = (nodesData.nodes as { id: string; label: string }[]).find(n => n.id === nodeId);
  return node ? `${nodeId} · ${node.label}` : nodeId;
}

export default function SessionScreen() {
  const { nodeId = 'F1' } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const session = useSessionStore();
  const { updateStreak } = useGameStore();
  const [phase, setPhase] = useState<'playing' | 'complete'>('playing');
  const [finalXp, setFinalXp] = useState(0);

  useEffect(() => {
    if (!session.active || session.nodeId !== nodeId) {
      const rounds = buildRounds(nodeId);
      if (rounds.length === 0) {
        navigate('/');
        return;
      }
      session.startSession(nodeId, rounds);
    }
  }, [nodeId]);

  async function handleSessionComplete(xpEarned: number) {
    await updateStreak();
    await logSession(nodeId, xpEarned, session.totalXpEarned);
    setFinalXp(xpEarned);
    setPhase('complete');
  }

  function handleReturn() {
    session.endSession();
    navigate('/');
  }

  function handleOneMore() {
    session.endSession();
    const rounds = buildRounds(nodeId);
    session.startSession(nodeId, rounds);
    setPhase('playing');
  }

  if (phase === 'complete') {
    return (
      <SessionCompleteScreen
        xpEarned={finalXp}
        nodeLabel={getNodeLabel(nodeId)}
        onContinue={handleReturn}
        onOneMore={handleOneMore}
      />
    );
  }

  if (!session.active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="font-mono text-muted text-sm">Preparing session…</div>
      </div>
    );
  }

  return <SessionOrchestrator onSessionComplete={handleSessionComplete} />;
}
