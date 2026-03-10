import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, getDashboard } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter your credentials.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 2. Call Auth Hook
      // Note: Backend expects { email, password }. 
      // If your API specifically needs 'email', ensure authService maps username -> email.
      await login({ 
        username: username.trim(), 
        password: password 
      });

      // 3. Dynamic Redirect
      // getDashboard() checks the user.role we just received from the backend
      const targetDashboard = getDashboard();
      navigate(targetDashboard, { replace: true });

    } catch (err: any) {
      // 4. Error Handling
      const detail = err?.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        // Handles FastAPI validation errors (422)
        setError(detail[0]?.msg || 'Validation error');
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Title Block */}
        <div style={styles.titleBlock}>
          <p style={styles.overline}>SYSTEM</p>
          <h1 style={styles.title}>Smart Attendance</h1>
          <div style={styles.rule} />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="username">
              USERNAME / EMAIL
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="e.g. admin@school.com"
              disabled={isLoading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div style={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles remain the same for consistent UI ---
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '360px',
    boxSizing: 'border-box',
  },
  titleBlock: { marginBottom: '36px' },
  overline: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: '#999',
    margin: '0 0 8px 0',
    fontWeight: 500,
  },
  title: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '26px',
    fontWeight: 400,
    color: '#000',
    margin: '0 0 20px 0',
    lineHeight: 1.2,
  },
  rule: { width: '32px', height: '2px', backgroundColor: '#000' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '9px',
    letterSpacing: '0.18em',
    color: '#888',
    fontWeight: 600,
  },
  input: {
    border: '1px solid #d0d0d0',
    borderRadius: '0',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: '"Inter", sans-serif',
    color: '#000',
    background: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    color: '#000',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    padding: '10px 12px',
    lineHeight: 1.5,
  },
  button: {
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '13px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    fontFamily: '"Inter", sans-serif',
    cursor: 'pointer',
    width: '100%',
    marginTop: '4px',
  },
  buttonDisabled: { background: '#555', cursor: 'not-allowed' },
};

export default LoginPage;