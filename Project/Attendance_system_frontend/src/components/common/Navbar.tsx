import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = user?.role?.toUpperCase() ?? '';

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandText}>SMART ATTENDANCE</span>
        <span style={styles.roleTag}>{roleLabel}</span>
      </div>
      <div style={styles.right}>
        <span style={styles.username}>{user?.full_name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          SIGN OUT
        </button>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '52px',
    borderBottom: '1px solid #e5e5e5',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandText: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    fontFamily: '"Inter", sans-serif',
    color: '#000',
  },
  roleTag: {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    fontFamily: '"Inter", sans-serif',
    color: '#fff',
    background: '#000',
    padding: '2px 7px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  username: {
    fontSize: '11px',
    fontFamily: '"Inter", sans-serif',
    color: '#666',
    letterSpacing: '0.05em',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #000',
    padding: '5px 14px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    fontFamily: '"Inter", sans-serif',
    cursor: 'pointer',
    color: '#000',
    transition: 'all 0.15s',
  },
};

export default Navbar;
