import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <span style={styles.overline}>STUDENT PANEL</span>
          <h2 style={styles.heading}>My Dashboard</h2>
          <p style={styles.sub}>Hello, {user?.full_name}.</p>
        </div>

        <Link to="/student/attendance" style={styles.tile}>
          <p style={styles.tileLabel}>My Attendance</p>
          <p style={styles.tileSub}>View your personal attendance records</p>
          <span style={styles.arrow}>→</span>
        </Link>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f7f7' },
  main: { maxWidth: '600px', margin: '0 auto', padding: '48px 24px' },
  header: { marginBottom: '40px' },
  overline: { fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#999' },
  heading: { fontFamily: '"Inter", sans-serif', fontSize: '28px', fontWeight: 400, color: '#000', margin: '6px 0 8px' },
  sub: { fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#666' },
  tile: {
    display: 'block', textDecoration: 'none', background: '#fff',
    border: '1px solid #e0e0e0', padding: '28px', position: 'relative',
  },
  tileLabel: { fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 400, color: '#000', margin: '0 0 6px' },
  tileSub: { fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#888', margin: 0 },
  arrow: { position: 'absolute', bottom: '20px', right: '20px', fontFamily: '"Inter", sans-serif', fontSize: '14px', color: '#000' },
};

export default StudentDashboard;
