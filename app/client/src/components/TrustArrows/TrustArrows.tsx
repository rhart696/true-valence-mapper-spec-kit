import type { PersonNode, TrustLevel, ViewTransform } from '../../types';

interface TrustArrowsProps {
  nodes: PersonNode[];
  viewTransform: ViewTransform;
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
export function TrustArrows({ nodes, viewTransform }: TrustArrowsProps) {
  const selfNode = nodes.find((n) => n.isSelf);
  if (!selfNode) return null;

  const getTrustColor = (level: TrustLevel): string => {
    switch (level) {
      case 'high':
        return 'rgb(16, 185, 129)'; // Green - Tailwind emerald-500
      case 'medium':
        return 'rgb(234, 179, 8)'; // Yellow - Tailwind yellow-500
      case 'low':
        return 'rgb(239, 68, 68)'; // Red - Tailwind red-500
      case 'unscored':
        return 'rgb(148, 163, 184)'; // Gray - Tailwind slate-400
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
        overflow: 'visible',
        transform: `scale(${viewTransform.zoom}) translate(${viewTransform.panX}px, ${viewTransform.panY}px)`,
        transformOrigin: 'center center',
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

        // Node positions are top-left corners of 120px wide containers
        // Circle is at left: 30px, width: 60px, so center is at x + 60px, y + 30px
        const NODE_RADIUS = 30;
        const CIRCLE_CENTER_X_OFFSET = 60; // 30px (left position) + 30px (radius)
        const CIRCLE_CENTER_Y_OFFSET = 30; // Circle is at top, so just radius

        const selfCenter = {
          x: selfNode.position.x + CIRCLE_CENTER_X_OFFSET,
          y: selfNode.position.y + CIRCLE_CENTER_Y_OFFSET,
        };
        const nodeCenter = {
          x: node.position.x + CIRCLE_CENTER_X_OFFSET,
          y: node.position.y + CIRCLE_CENTER_Y_OFFSET,
        };

        // Calculate offset to start/end arrows at edge of circles
        const dx = nodeCenter.x - selfCenter.x;
        const dy = nodeCenter.y - selfCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (dx / distance) * NODE_RADIUS;
        const offsetY = (dy / distance) * NODE_RADIUS;

        // Outward arrow: from self to person
        const outwardStart = {
          x: selfCenter.x + offsetX,
          y: selfCenter.y + offsetY,
        };
        const outwardEnd = {
          x: nodeCenter.x - offsetX,
          y: nodeCenter.y - offsetY,
        };

        // Inward arrow: from person to self (slightly offset for visibility)
        const perpX = -dy / distance * 8; // Perpendicular offset
        const perpY = dx / distance * 8;
        const inwardStart = {
          x: nodeCenter.x - offsetX + perpX,
          y: nodeCenter.y - offsetY + perpY,
        };
        const inwardEnd = {
          x: selfCenter.x + offsetX + perpX,
          y: selfCenter.y + offsetY + perpY,
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
