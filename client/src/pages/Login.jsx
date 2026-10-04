import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); navigate('/dashboard'); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Login</h2>
      {state?.message && <p className="success">{state.message}</p>}
      {error && <p className="error">{error}</p>}
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="btn full">Login</button>
      <p className="hint">Demo account (after <code>npm run seed</code>): demo@habittrack.com / demo123</p>
      <p className="muted center">Don't have an account? <Link to="/register">Register</Link></p>
    </form>
  );
}
