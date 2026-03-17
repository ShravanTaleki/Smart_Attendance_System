import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { useAuth } from '../hooks/useAuth';
import { AttendanceRecord, AttendanceSummary, Student, AttendanceStatus } from '../types';

const STATUS_OPTIONS: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

const statusStyle = (s: AttendanceStatus): React.CSSProperties => {
  const map: Record<AttendanceStatus, string> = {
    present: '#000', absent: '#aaa', late: '#555', excused: '#888',
  };
  return { color: map[s], fontWeight: s === 'present' ? 700 : 400 };
};

// ─── Teacher: Mark Attendance ─────────────────────────────────────────────────

const MarkAttendanceView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, AttendanceStatus>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    studentService.getAll().then(r => {
      setStudents(r.items);
      const defaults: Record<number, AttendanceStatus> = {};
      r.items.forEach(s => { defaults[s.id] = 'present'; });
      setStatusMap(defaults);
    });
  }, []);

  const handleSubmit = async () => {
    setSaving(true); 
    setError('');
    try {
      const payload = {
        date: date,
        records: students.map(s => ({
          student_id: s.id,
          status: statusMap[s.id],
          notes: "" 
        }))
      };
      
      await attendanceService.submitBulk(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <span style={styles.overline}>TEACHER</span>
          <h2 style={styles.heading}>Mark Attendance</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.datePicker} />
          <button style={styles.primaryBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? 'SAVING...' : 'SUBMIT'}
          </button>
        </div>
      </div>
      {saved && <div style={styles.successBanner}>Attendance saved successfully.</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td style={styles.td}>{s.student_id}</td>
                <td style={styles.td}>{s.full_name}</td>
                <td style={styles.td}>
                  <select
                    value={statusMap[s.id] ?? 'present'}
                    onChange={e => setStatusMap(m => ({ ...m, [s.id]: e.target.value as AttendanceStatus }))}
                    style={styles.select}
                  >
                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Admin: Attendance Report ─────────────────────────────────────────────────

const AttendanceReportView: React.FC = () => {
  const [report, setReport] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService.getReport()
      .then(r => { setReport(r); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <span style={styles.overline}>ADMIN</span>
          <h2 style={styles.heading}>Attendance Reports</h2>
        </div>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Student', 'Total Days', 'Present', 'Absent', 'Late', 'Excused', '% Present'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={styles.tdCenter}>Loading...</td></tr>
            ) : report.length === 0 ? (
                <tr><td colSpan={7} style={styles.tdCenter}>No report data available.</td></tr>
            ) : report.map(r => (
              <tr key={r.student_id}>
                <td style={styles.td}>{r.student_name}</td>
                <td style={styles.td}>{r.total_days}</td>
                <td style={{ ...styles.td, ...statusStyle('present') }}>{r.present}</td>
                <td style={{ ...styles.td, ...statusStyle('absent') }}>{r.absent}</td>
                <td style={{ ...styles.td, ...statusStyle('late') }}>{r.late}</td>
                <td style={{ ...styles.td, ...statusStyle('excused') }}>{r.excused}</td>
                <td style={{
                  ...styles.td,
                  color: r.attendance_percentage< 75 ? 'red':'inherit',
                  fontWeight: r.attendance_percentage < 75 ? 'bold' : 'normal'
                }}>
                  {r.attendance_percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Student: Own Attendance ───────────────────────────────────────────────────

const MyAttendanceView: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService.getMyAttendance()
      .then(r => { 
        // Handles both wrapped and unwrapped data for consistency
        const data = Array.isArray(r) ? r : (r as any).items || [];
        setRecords(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const pct = records.length
    ? ((records.filter(r => r.status === 'present').length / records.length) * 100).toFixed(1)
    : '—';

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <span style={styles.overline}>STUDENT</span>
          <h2 style={styles.heading}>My Attendance</h2>
          <p style={styles.count}>{records.length} records · {pct}% present</p>
        </div>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={styles.tdCenter}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={3} style={styles.tdCenter}>No records yet.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td style={styles.td}>{r.date}</td>
                <td style={{ ...styles.td, ...statusStyle(r.status as AttendanceStatus) }}>{r.status.toUpperCase()}</td>
                <td style={styles.td}>{r.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Teacher: View Records ────────────────────────────────────────────────────

const ViewRecordsView: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await attendanceService.getAll(date);
      
      // TYPE-SAFE FIX: Checks if it's an array or has an .items property
      if (Array.isArray(r)) {
        setRecords(r);
      } else if (r && (r as any).items) {
        setRecords((r as any).items);
      } else {
        setRecords([]);
      }
      
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <span style={styles.overline}>TEACHER</span>
          <h2 style={styles.heading}>Attendance Records</h2>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.datePicker} />
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student ID</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={styles.tdCenter}>Loading...</td></tr>
            ) : records.length === 0 ? (
                <tr><td colSpan={4} style={styles.tdCenter}>No records found for this date.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                {/* Fixed student display since student_name might be missing */}
                <td style={styles.td}>{r.student_name || `ID: ${r.student_id}`}</td>
                <td style={styles.td}>{r.date}</td>
                <td style={{ ...styles.td, ...statusStyle(r.status as AttendanceStatus) }}>{r.status.toUpperCase()}</td>
                <td style={styles.td}>{r.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Page Router ──────────────────────────────────────────────────────────────

type ViewMode = 'mark' | 'records' | 'report' | 'mine';

interface AttendancePageProps {
  mode: ViewMode;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ mode }) => {
  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        {mode === 'mark'    && <MarkAttendanceView />}
        {mode === 'records' && <ViewRecordsView />}
        {mode === 'report'  && <AttendanceReportView />}
        {mode === 'mine'    && <MyAttendanceView />}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f7f7' },
  main: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' },
  overline: { fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#999' },
  heading: { fontFamily: '"Inter", sans-serif', fontSize: '24px', fontWeight: 400, color: '#000', margin: '4px 0' },
  count: { fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#888', margin: 0 },
  primaryBtn: { background: '#000', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' },
  successBanner: { background: '#f5f5f5', border: '1px solid #ccc', padding: '10px 14px', fontFamily: '"Inter", sans-serif', fontSize: '11px', marginBottom: '16px' },
  errorBanner: { background: '#f5f5f5', border: '1px solid #ddd', padding: '10px 14px', fontFamily: '"Inter", sans-serif', fontSize: '11px', marginBottom: '16px' },
  tableWrap: { background: '#fff', border: '1px solid #e0e0e0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.12em', fontWeight: 700, borderBottom: '1px solid #e0e0e0', color: '#555' },
  td: { padding: '12px 16px', fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#222', borderBottom: '1px solid #f0f0f0' },
  tdCenter: { padding: '32px', textAlign: 'center', fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#999' },
  datePicker: { border: '1px solid #d0d0d0', padding: '8px 10px', fontFamily: '"Inter", sans-serif', fontSize: '12px', outline: 'none', borderRadius: 0 },
  select: { border: '1px solid #d0d0d0', padding: '5px 8px', fontFamily: '"Inter", sans-serif', fontSize: '11px', borderRadius: 0, background: '#fff' },
};

export default AttendancePage;