
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';

interface SessionSummary {
    id: string;
    date: string;
    clientName?: string; // Mocked for now
    nodeCount: number;
}

export function Dashboard() {
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                // Transform backend data to summary
                const summaries = data.map((s: any) => ({
                    id: s.id,
                    date: new Date(s.date).toLocaleDateString(),
                    nodeCount: s.nodes.length
                }));
                setSessions(summaries);
            })
            .catch(err => console.error('Failed to fetch sessions:', err));
    }, []);

    const handleNewSession = async () => {
        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coachId: '1', clientId: '1' }) // Hardcoded for MVP
            });
            const newSession = await res.json();
            navigate(`/session/${newSession.id}`);
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Welcome back, Coach</h2>
                <button
                    onClick={handleNewSession}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <Plus size={18} />
                    New Session
                </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '3rem' }}>
                <div className="stat-card">
                    <h3>Active Clients</h3>
                    <p className="stat-value">12</p>
                </div>
                <div className="stat-card">
                    <h3>Total Sessions</h3>
                    <p className="stat-value">{sessions.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Avg. Valence</h3>
                    <p className="stat-value positive">+3.2</p>
                </div>
            </div>

            <h3>Recent Sessions</h3>
            {sessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No sessions yet. Start a new one!</p>
            ) : (
                <div className="session-list" style={{ display: 'grid', gap: '1rem' }}>
                    {sessions.map(session => (
                        <Link
                            key={session.id}
                            to={`/session/${session.id}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.5rem',
                                backgroundColor: 'var(--surface)',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'transform 0.1s'
                            }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>Session #{session.id}</h4>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{session.date} • {session.nodeCount} Relationships</p>
                            </div>
                            <ArrowRight size={20} color="var(--text-muted)" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
