import { useEffect, useState } from 'react';

interface Client {
    id: string;
    name: string;
    email: string;
    organization?: string;
}

export function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch clients:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Clients</h2>
                <button className="btn-primary" style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 500
                }}>
                    Add Client
                </button>
            </div>

            {loading ? (
                <p>Loading clients...</p>
            ) : clients.length === 0 ? (
                <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: '1rem',
                    border: '1px solid var(--border)'
                }}>
                    <p style={{ color: 'var(--text-muted)' }}>No clients found. Start by adding one.</p>
                </div>
            ) : (
                <div className="client-grid" style={{ display: 'grid', gap: '1rem' }}>
                    {clients.map(client => (
                        <div key={client.id} className="client-card" style={{
                            padding: '1rem',
                            backgroundColor: 'var(--surface)',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{client.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{client.email}</p>
                            {client.organization && (
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>{client.organization}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
