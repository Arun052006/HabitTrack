import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return setError('Passwords do not match.');
    try {
      await api('/auth/register', 'POST', { name: f.name, email: f.email, password: f.password });
      navigate('/login', { state: { message: 'Account created. Please log in.' } });
    } catch (err) { setError(err.message); }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <label>Name<input value={f.name} onChange={set('name')} required /></label>
      <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
      <label>Password<input type="password" value={f.password} onChange={set('password')} minLength="6" required /></label>
      <label>Confirm password<input type="password" value={f.confirm} onChange={set('confirm')} required /></label>
      <button className="btn full">Register</button>
      <p className="muted center">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
