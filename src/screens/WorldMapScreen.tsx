import { useNavigate } from 'react-router-dom';
import NodeMap from '../components/NodeMap';
import nodesData from '../data/nodes.json';
import type { SkillNode, NexusLink } from '../types/content';

export default function WorldMapScreen() {
  const navigate = useNavigate();
  const nodes = nodesData.nodes as SkillNode[];
  const nexuses = nodesData.nexuses as NexusLink[];

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-muted hover:text-text transition-colors"
        >
          ←
        </button>
        <div>
          <div className="font-display font-bold text-text">World Model</div>
          <div className="text-xs text-muted font-mono">All nodes · 3 Realms</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <NodeMap
          nodes={nodes}
          nexuses={nexuses}
          activeNodeId="F1"
          unlockedNodeIds={['F1']}
          onSelectNode={(id) => {
            if (id === 'F1') navigate('/session/F1');
          }}
        />

        <div className="mt-8 card p-4 border-border">
          <div className="text-xs font-mono text-muted mb-3 tracking-widest">LEGEND</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-forces" />
              <span className="text-text">Active — play now</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-border" />
              <span className="text-muted">Locked — master prerequisites first</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-nexus" />
              <span className="text-text">Nexus link — cross-science connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
