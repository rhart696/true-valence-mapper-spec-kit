import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Network, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../index.css';

export function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="logo">
                    <Network className="icon" />
                    <h1>ProActive Trust Valence Mapper</h1>
                </div>
                <nav>
                    <Link to="/" className="nav-link">
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/clients" className="nav-link">
                        <Users size={18} />
                        <span>Clients</span>
                    </Link>
                </nav>
                <div className="user-profile">
                    <div className="avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    <span>{user?.username || 'User'}</span>
                    <button onClick={logout} className="ml-4 p-1 hover:text-red-500" title="Sign out">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
