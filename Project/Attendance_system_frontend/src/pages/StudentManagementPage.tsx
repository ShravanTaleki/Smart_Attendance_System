import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import { studentService } from '../services/studentService';
import { Student, CreateStudentPayload } from '../types';

const EMPTY_FORM: CreateStudentPayload = {
  full_name: '', email: '', student_id: '', grade: '', password: '',
};

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [form, setForm] = useState<CreateStudentPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll();
      setStudents(res.items);
      setTotal(res.total);
    } catch {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditTarget(s);
    setForm({ full_name: s.full_name, email: s.email, student_id: s.student_id, grade: s.grade, password: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await studentService.delete(id);
      fetchStudents();
    } catch {
      setError('Failed to delete student.');
    }
  };

  const handleSave = async () => {
    if (!form.full_name || !form.email || !form.student_id || !form.grade) {
      setFormError('All fields except password (edit) are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editTarget) {
        await studentService.update(editTarget.id, { full_name: form.full_name, email: form.email, grade: form.grade });
      } else {
        if (!form.password) { setFormError('Password is required for new students.'); setSaving(false); return; }
        await studentService.create(form);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <span style={styles.overline}>ADMIN</span>
            <h2 style={styles.heading}>Student Management</h2>
            <p style={styles.count}>{total} students total</p>
          </div>
          <button style={styles.primaryBtn} onClick={openCreate}>+ ADD STUDENT</button>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Student ID', 'Full Name', 'Email', 'Grade', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={styles.tdCenter}>Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={5} style={styles.tdCenter}>No students found.</td></tr>
              ) : students.map(s => (
                <tr key={s.id} style={styles.row}>
                  <td style={styles.td}>{s.student_id}</td>
                  <td style={styles.td}>{s.full_name}</td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.grade}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => openEdit(s)}>EDIT</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(s.id, s.full_name)}>DELETE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editTarget ? 'Edit Student' : 'Add Student'}</h3>
            {formError && <p style={styles.formError}>{formError}</p>}
            {(['full_name', 'email', 'student_id', 'grade'] as const).map(field => (
              <div key={field} style={styles.field}>
                <label style={styles.label}>{field.replace('_', ' ').toUpperCase()}</label>
                <input
                  style={styles.input}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  disabled={field === 'student_id' && !!editTarget}
                />
              </div>
            ))}
            {!editTarget && (
              <div style={styles.field}>
                <label style={styles.label}>PASSWORD</label>
                <input
                  type="password"
                  style={styles.input}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
            )}
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>CANCEL</button>
              <button style={styles.primaryBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  errorBanner: { background: '#f5f5f5', border: '1px solid #ddd', padding: '10px 14px', fontFamily: '"Inter", sans-serif', fontSize: '11px', marginBottom: '16px' },
  tableWrap: { background: '#fff', border: '1px solid #e0e0e0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.12em', fontWeight: 700, borderBottom: '1px solid #e0e0e0', color: '#555' },
  td: { padding: '12px 16px', fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#222', borderBottom: '1px solid #f0f0f0' },
  tdCenter: { padding: '32px', textAlign: 'center', fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#999' },
  row: { transition: 'background 0.1s' },
  editBtn: { background: 'none', border: '1px solid #000', padding: '4px 10px', fontFamily: '"Inter", sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { background: 'none', border: '1px solid #ccc', padding: '4px 10px', fontFamily: '"Inter", sans-serif', fontSize: '9px', letterSpacing: '0.1em', cursor: 'pointer', color: '#666' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', border: '1px solid #e0e0e0', padding: '36px', width: '400px', maxWidth: '90vw' },
  modalTitle: { fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: 400, margin: '0 0 20px' },
  formError: { fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#000', background: '#f5f5f5', padding: '8px 12px', marginBottom: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' },
  label: { fontFamily: '"Inter", sans-serif', fontSize: '9px', letterSpacing: '0.15em', color: '#888', fontWeight: 600 },
  input: { border: '1px solid #d0d0d0', padding: '9px 10px', fontFamily: '"Inter", sans-serif', fontSize: '12px', outline: 'none', borderRadius: 0 },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelBtn: { background: 'none', border: '1px solid #ccc', padding: '9px 18px', fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' },
};

export default StudentManagementPage;
