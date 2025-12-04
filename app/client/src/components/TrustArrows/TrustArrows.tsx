import type { PersonNode, TrustLevel } from '../../types';

interface TrustArrowsProps {
  nodes: PersonNode[];
}

/**
 * Renders directional trust arrows between nodes.
 *
 * Shows bidirectional trust:
 * - Arrow from self node to person (outward trust)
 * - Arrow from person to self node (inward trust)
 *
 * Color-coded by trust level:
 * - Green: high trust
 * - Yellow: medium trust
 * - Red: low trust
 * - Gray: unscored
 */
export function TrustArrows({ nodes }: TrustArrowsProps) {
  const selfNode = nodes.find((n) => n.isSelf);
  if (!selfNode) return null;

  const getTrustColor = (level: TrustLevel): string => {
    switch (level) {
      case 'high':
        return 'var(--trust-high)';
      case 'medium':
        return 'var(--trust-medium)';
      case 'low':
        return 'var(--trust-low)';
      case 'unscored':
        return 'var(--trust-unscored)';
    }
  };

  // Only render arrows for nodes with trust scores
  const scoredNodes = nodes.filter((n) => !n.isSelf && n.trustScore);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        {/* Arrowhead markers for each trust level */}
        <marker
          id="arrow-high"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={getTrustColor('high')} />
        </marker>
        <marker
          id="arrow-medium"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={getTrustColor('medium')} />
        </marker>
        <marker
          id="arrow-low"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={getTrustColor('low')} />
        </marker>
        <marker
          id="arrow-unscored"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={getTrustColor('unscored')} />
        </marker>
      </defs>

      {scoredNodes.map((node) => {
        const { trustScore } = node;
        if (!trustScore) return null;

        // Calculate offset to start/end arrows at edge of circles (30px radius)
        const dx = node.position.x - selfNode.position.x;
        const dy = node.position.y - selfNode.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (dx / distance) * 30;
        const offsetY = (dy / distance) * 30;

        // Outward arrow: from self to person
        const outwardStart = {
          x: selfNode.position.x + offsetX,
          y: selfNode.position.y + offsetY,
        };
        const outwardEnd = {
          x: node.position.x - offsetX,
          y: node.position.y - offsetY,
        };

        // Inward arrow: from person to self (slightly offset for visibility)
        const perpX = -dy / distance * 8; // Perpendicular offset
        const perpY = dx / distance * 8;
        const inwardStart = {
          x: node.position.x + offsetX + perpX,
          y: node.position.y + offsetY + perpY,
        };
        const inwardEnd = {
          x: selfNode.position.x - offsetX + perpX,
          y: selfNode.position.y - offsetY + perpY,
        };

        return (
          <g key={node.id}>
            {/* Outward trust arrow */}
            <line
              x1={outwardStart.x}
              y1={outwardStart.y}
              x2={outwardEnd.x}
              y2={outwardEnd.y}
              stroke={getTrustColor(trustScore.outward)}
              strokeWidth="2"
              strokeDasharray={trustScore.uncertain ? '5,5' : undefined}
              markerEnd={`url(#arrow-${trustScore.outward})`}
              opacity="0.7"
            />

            {/* Inward trust arrow */}
            <line
              x1={inwardStart.x}
              y1={inwardStart.y}
              x2={inwardEnd.x}
              y2={inwardEnd.y}
              stroke={getTrustColor(trustScore.inward)}
              strokeWidth="2"
              strokeDasharray={trustScore.uncertain ? '5,5' : undefined}
              markerEnd={`url(#arrow-${trustScore.inward})`}
              opacity="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
}
