import { useEffect, useState } from 'react';
import type { SkillNode, NexusLink } from '../types/content';
import { getNodeMastery } from '../db/nexusDb';
import type { NodeMastery } from '../types/content';

interface Props {
  nodes: SkillNode[];
  nexuses: NexusLink[];
  activeNodeId?: string;
  unlockedNodeIds?: string[];
  onSelectNode?: (nodeId: string) => void;
}

const REALM_COLORS = {
  life: '#22c55e',
  matter: '#f59e0b',
  forces: '#3b82f6',
};

const REALM_LABELS = { life: 'LIFE', matter: 'MATTER', forces: 'FORCES' };

export default function NodeMap({ nodes, nexuses, activeNodeId, unlockedNodeIds = ['F1'], onSelectNode }: Props) {
  const [mastery, setMastery] = useState<Record<string, NodeMastery>>({});

  useEffect(() => {
    const load = async () => {
      const result: Record<string, NodeMastery> = {};
      for (const n of nodes) {
        result[n.id] = await getNodeMastery(n.id);
      }
      setMastery(result);
    };
    load();
  }, [nodes]);

  const byRealm = {
    life: nodes.filter(n => n.realm === 'life'),
    matter: nodes.filter(n => n.realm === 'matter'),
    forces: nodes.filter(n => n.realm === 'forces'),
  };

  const isMastered = (id: string) => !!mastery[id]?.masteredAt;
  const isUnlocked = (id: string) => unlockedNodeIds.includes(id);
  const isActive = (id: string) => id === activeNodeId;

  return (
    <div className="space-y-6">
      {(['life', 'matter', 'forces'] as const).map(realm => {
        const color = REALM_COLORS[realm];
        const realmNodes = byRealm[realm];

        return (
          <div key={realm}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1" style={{ background: color, opacity: 0.3 }} />
              <span className="text-xs font-mono tracking-widest" style={{ color }}>
                REALM · {REALM_LABELS[realm]}
              </span>
              <div className="h-px flex-1" style={{ background: color, opacity: 0.3 }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {realmNodes.map(node => {
                const unlocked = isUnlocked(node.id);
                const mastered = isMastered(node.id);
                const active = isActive(node.id);
                const m = mastery[node.id];
                const total = m ? m.totalAttempts : 0;
                const correct = m ? m.ao1Correct + m.ao2Correct + m.ao3Correct : 0;
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

                return (
                  <button
                    key={node.id}
                    onClick={() => unlocked && onSelectNode?.(node.id)}
                    disabled={!unlocked}
                    className={`
                      relative flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200
                      ${active ? 'border-2 scale-105' : 'border'}
                      ${mastered ? 'opacity-100' : unlocked ? 'opacity-100' : 'opacity-35 cursor-not-allowed'}
                    `}
                    style={{
                      borderColor: active ? color : unlocked ? `${color}66` : '#1e2130',
                      background: active ? `${color}15` : unlocked ? `${color}08` : '#13151c',
                      boxShadow: active ? `0 0 16px ${color}40` : mastered ? `0 0 8px ${color}30` : 'none',
                      minWidth: 100,
                      maxWidth: 140,
                    }}
                  >
                    <div className="font-mono text-xs mb-1" style={{ color: unlocked ? color : '#6b7280' }}>
                      {node.id}
                    </div>
                    <div className="text-xs text-text leading-tight">{node.label}</div>
                    {total > 0 && (
                      <div className="mt-2 w-full">
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                        <div className="text-xs text-muted font-mono mt-0.5">{pct}%</div>
                      </div>
                    )}
                    {mastered && <div className="absolute top-1.5 right-1.5 text-xs">✓</div>}
                    {!unlocked && <div className="absolute top-1.5 right-1.5 text-xs text-muted">🔒</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-nexus/30" />
          <span className="text-xs font-mono tracking-widest text-nexus">NEXUS LINKS</span>
          <div className="h-px flex-1 bg-nexus/30" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {nexuses.map(nx => {
            const allMastered = nx.nodes.every(nid => isMastered(nid));
            return (
              <div
                key={nx.id}
                className={`card p-3 border transition-all ${allMastered ? 'border-nexus/60 bg-nexus/10' : 'border-border opacity-40'}`}
                style={allMastered ? { boxShadow: '0 0 12px rgba(139,92,246,0.3)' } : {}}
              >
                <div className="text-nexus font-mono text-xs mb-1">{nx.id} · {nx.title}</div>
                <div className="text-xs text-muted leading-tight">{nx.nodes.join(' × ')}</div>
                {allMastered && (
                  <div className="text-xs text-nexus mt-1">Unlocked ✦</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
