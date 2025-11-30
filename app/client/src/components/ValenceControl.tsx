import { useState } from 'react';

interface ValenceControlProps {
    onSave: (scores: ValenceScores) => void;
    initialScores?: ValenceScores;
}

export interface ValenceScores {
    trust: number;
    communication: number;
    support: number;
    respect: number;
    alignment: number;
}

export function ValenceControl({ onSave, initialScores }: ValenceControlProps) {
    const [scores, setScores] = useState<ValenceScores>(initialScores || {
        trust: 0,
        communication: 0,
        support: 0,
        respect: 0,
        alignment: 0
    });

    const handleChange = (dimension: keyof ValenceScores, value: string) => {
        setScores(prev => ({
            ...prev,
            [dimension]: parseInt(value)
        }));
    };

    const dimensions = [
        { key: 'trust', label: 'Trust Level' },
        { key: 'communication', label: 'Communication Quality' },
        { key: 'support', label: 'Mutual Support' },
        { key: 'respect', label: 'Professional Respect' },
        { key: 'alignment', label: 'Goal Alignment' }
    ];

    return (
        <div className="valence-control" style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <h3 style={{ marginTop: 0 }}>Assess Valence</h3>
            <div className="sliders-grid" style={{ display: 'grid', gap: '1rem' }}>
                {dimensions.map(({ key, label }) => (
                    <div key={key} className="slider-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>
                            <span style={{
                                fontWeight: 'bold',
                                color: scores[key as keyof ValenceScores] > 0 ? 'var(--success)' : scores[key as keyof ValenceScores] < 0 ? '#ef4444' : 'var(--text-muted)'
                            }}>
                                {scores[key as keyof ValenceScores] > 0 ? '+' : ''}{scores[key as keyof ValenceScores]}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-5"
                            max="5"
                            step="1"
                            value={scores[key as keyof ValenceScores]}
                            onChange={(e) => handleChange(key as keyof ValenceScores, e.target.value)}
                            style={{ width: '100%' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Low (-5)</span>
                            <span>Neutral (0)</span>
                            <span>High (+5)</span>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => onSave(scores)}
                style={{
                    marginTop: '1.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                Save Assessment
            </button>
        </div>
    );
}
