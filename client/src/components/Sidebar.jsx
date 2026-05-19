import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar glass-panel" style={{ height: 'calc(100vh - 4rem)', margin: '2rem 0 2rem 2rem', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1 0%, #a855f7 100%))', padding: '0.5rem', borderRadius: '12px' }}>
          <BrainCircuit size={28} color="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>AIhr</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
            fontWeight: isActive ? 600 : 500
          })}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/employees" 
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
            fontWeight: isActive ? 600 : 500
          })}
        >
          <Users size={20} />
          Employees
        </NavLink>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user?.role}</p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
