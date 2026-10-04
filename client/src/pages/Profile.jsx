import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, dateStr, bestStreak, dayStats } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import useHabits from '../components/useHabits.js';

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { habits } = useHabits();
  const [user, setUser] = useState(null);
  useEffect(() => { api('/auth/me').then(setUser).catch(() => {}); }, []);
  if (!user) return <p className="muted">Loading…</p>;

  const total = habits.length;
  const completions = habits.reduce((n, h) => n + h.completedDates.length, 0);
  const best = Math.max(0, ...habits.map((h) => bestStreak(h)));

  const days = [...Array(35)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (34 - i));
    const k = dateStr(d), { pct, done: n } = dayStats(habits, k);
    return { k, pct, n };
  });
  const rate = total ? Math.round((days.reduce((s, d) => s + d.pct, 0) / 35) * 100) : 0;
  const perfect = days.some((d) => total && d.pct === 1);

  const badges = [
    ['🌱', 'First habit', total >= 1], ['🔥', '7-day streak', best >= 7],
    ['💯', 'Perfect day', perfect], ['🏆', '50 check-ins', completions >= 50],
  ];
  const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const level = (p) => (p === 0 ? 0 : p < 0.34 ? 1 : p < 0.67 ? 2 : p < 1 ? 3 : 4);

  return (
    <>
      <section className="card profile-card">
        <div className="cover" />
        <div className="who">
          <div className="avatar">{initials}</div>
          <div className="grow">
            <h1>{user.name}</h1>
            <p className="muted">{user.email} · Member since {new Date(user.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="btn btn-ghost danger" onClick={async () => { await logout(); navigate('/login'); }}>Logout</button>
        </div>
      </section>

      <div className="stats four">
        <div className="card stat col"><h2>{total}</h2><p className="muted">Habits</p></div>
        <div className="card stat col"><h2>{completions}</h2><p className="muted">Total check-ins</p></div>
        <div className="card stat col"><h2>🔥 {best}</h2><p className="muted">Best streak</p></div>
        <div className="card stat col"><h2>{rate}%</h2><p className="muted">35-day rate</p></div>
      </div>

      <div className="card">
        <h2>Activity · last 35 days</h2>
        <div className="heat">{days.map((d) => <span key={d.k} className={'cell l' + level(d.pct)} title={`${d.k}: ${d.n} done`} />)}</div>
        <p className="legend muted">Less <span className="cell l0" /><span className="cell l1" /><span className="cell l2" /><span className="cell l3" /><span className="cell l4" /> More</p>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Achievements</h2>
        <div className="badges">
          {badges.map(([i, t, ok]) => <div key={t} className={'ach' + (ok ? '' : ' locked')}><span>{i}</span><b>{t}</b><small>{ok ? 'Unlocked' : 'Locked'}</small></div>)}
        </div>
      </div>
    </>
  );
}
