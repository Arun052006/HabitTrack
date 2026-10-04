import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); setOpen(false); navigate('/login'); };
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>🌱 HabitTrack</Link>
        <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <nav className={open ? 'links open' : 'links'}>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
              <NavLink to="/habits" onClick={close}>My Habits</NavLink>
              <NavLink to="/calendar" onClick={close}>Calendar</NavLink>
              <NavLink to="/progress" onClick={close}>Progress</NavLink>
              <NavLink to="/profile" onClick={close}>Profile</NavLink>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/register" onClick={close}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
