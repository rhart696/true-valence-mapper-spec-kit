

interface Node {
    id: string;
    name: string;
    role?: string;
    category: string;
    x?: number;
    y?: number;
}

interface NetworkMapProps {
    nodes: Node[];
    onNodeClick: (nodeId: string) => void;
}

export function NetworkMap({ nodes, onNodeClick }: NetworkMapProps) {
    // Simple force-directed layout simulation placeholder
    // For MVP, we'll just arrange them in a circle
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    const positionedNodes = nodes.map((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI;
        return {
            ...node,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        };
    });

    return (
        <div className="network-map-container" style={{ border: '1px solid var(--border)', borderRadius: '1rem', background: 'var(--surface)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ minHeight: '400px' }}>
                {/* Central "Self" Node */}
                <circle cx={centerX} cy={centerY} r={20} fill="var(--primary)" />
                <text x={centerX} y={centerY + 35} textAnchor="middle" fontSize="12" fill="var(--text)">You</text>

                {/* Links */}
                {positionedNodes.map(node => (
                    <line
                        key={`link-${node.id}`}
                        x1={centerX}
                        y1={centerY}
                        x2={node.x}
                        y2={node.y}
                        stroke="var(--border)"
                        strokeWidth="2"
                    />
                ))}

                {/* Nodes */}
                {positionedNodes.map(node => (
                    <g key={node.id} onClick={() => onNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={25}
                            fill="white"
                            stroke="var(--primary)"
                            strokeWidth="2"
                        />
                        <text x={node.x} y={node.y} dy="5" textAnchor="middle" fontSize="14" fill="var(--primary-dark)" fontWeight="bold">
                            {node.name.charAt(0)}
                        </text>
                        <text x={node.x} y={node.y + 40} textAnchor="middle" fontSize="12" fill="var(--text)">
                            {node.name}
                        </text>
                        <text x={node.x} y={node.y + 55} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                            {node.category}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
