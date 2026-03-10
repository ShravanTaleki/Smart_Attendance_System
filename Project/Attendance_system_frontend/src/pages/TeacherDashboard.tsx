import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const tiles = [
    { label: 'Mark Attendance', sub: 'Record daily attendance for students', path: '/teacher/attendance' },
    { label: 'Attendance Records', sub: 'View and manage past records', path: '/teacher/records' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <span style={styles.overline}>TEACHER PANEL</span>
          <h2 style={styles.heading}>Dashboard</h2>
          <p style={styles.date}>{today}</p>
        </div>
        <div style={styles.grid}>
          {tiles.map((tile) => (
            <Link key={tile.path} to={tile.path} style={styles.tile}>
              <p style={styles.tileLabel}>{tile.label}</p>
              <p style={styles.tileSub}>{tile.sub}</p>
              <span style={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f7f7' },
  main: { maxWidth: '800px', margin: '0 auto', padding: '48px 24px' },
  header: { marginBottom: '40px' },
  overline: { fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#999' },
  heading: { fontFamily: '"Inter", sans-serif', fontSize: '28px', fontWeight: 400, color: '#000', margin: '6px 0 8px' },
  date: { fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  tile: {
    display: 'block', textDecoration: 'none', background: '#fff',
    border: '1px solid #e0e0e0', padding: '28px', position: 'relative',
  },
  tileLabel: { fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 400, color: '#000', margin: '0 0 6px' },
  tileSub: { fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#888', margin: 0 },
  arrow: { position: 'absolute', bottom: '20px', right: '20px', fontFamily: '"Inter", sans-serif', fontSize: '14px', color: '#000' },
};

export default TeacherDashboard;
