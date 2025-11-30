import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkMap } from '../components/NetworkMap';
import { ValenceControl, type ValenceScores } from '../components/ValenceControl';
import { ReflectionPrompts } from '../components/ReflectionPrompts';

interface Node {
    id: string;
    name: string;
    category: string;
    valence?: ValenceScores;
}

export function Session() {
    const { id } = useParams();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showValence, setShowValence] = useState(false);

    // Mock initial load
    useEffect(() => {
        // In a real app, fetch session details here
        // For MVP demo, we'll start with an empty list or some mock data
        setNodes([
            { id: '1', name: 'Boss', category: 'Manager/Supervisor' },
            { id: '2', name: 'Peer A', category: 'Peer/Colleague' }
        ]);
    }, [id]);

    const handleNodeClick = (nodeId: string) => {
        setSelectedNodeId(nodeId);
        setShowValence(true);
    };

    const handleSaveValence = (scores: ValenceScores) => {
        if (!selectedNodeId) return;

        // Update local state
        setNodes(prev => prev.map(n =>
            n.id === selectedNodeId ? { ...n, valence: scores } : n
        ));

        // TODO: API call to save to backend
        // fetch(\`/api/sessions/\${id}/nodes/\${selectedNodeId}/valence\`, ...)

        setShowValence(false);
        setSelectedNodeId(null);
    };

    const handleAddNode = () => {
        const name = prompt("Enter person's name:");
        if (!name) return;

        const category = "Peer/Colleague"; // Hardcoded for MVP simplicity

        const newNode: Node = {
            id: String(Date.now()),
            name,
            category
        };

        setNodes(prev => [...prev, newNode]);

        // TODO: API call to create node
    };

    return (
        <div className="page-container" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 100px)' }}>
            <div className="map-section" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Mapping Session #{id || 'Demo'}</h2>
                    <button
                        onClick={handleAddNode}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        Add Person
                    </button>
                </div>
                <NetworkMap nodes={nodes} onNodeClick={handleNodeClick} />
            </div>

            {showValence && selectedNodeId && (
                <div className="sidebar" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <ValenceControl
                        onSave={handleSaveValence}
                        initialScores={nodes.find(n => n.id === selectedNodeId)?.valence}
                    />
                    <ReflectionPrompts
                        scores={nodes.find(n => n.id === selectedNodeId)?.valence}
                        category={nodes.find(n => n.id === selectedNodeId)?.category}
                    />
                </div>
            )}
        </div>
    );
}
