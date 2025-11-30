
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Network } from 'lucide-react';
import '../index.css';

export function Layout() {
    return (
        <div className="app-container">
            <header className="app-header">
                <div className="logo">
                    <Network className="icon" />
                    <h1>True Valence Mapper</h1>
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
                    <div className="avatar">JD</div>
                    <span>Jane Doe (Coach)</span>
                </div>
            </header>
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
