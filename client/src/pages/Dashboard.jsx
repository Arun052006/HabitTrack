import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import useHabits from '../components/useHabits.js';
import HabitCard, { ICONS } from '../components/HabitCard.jsx';
import HabitForm from '../components/HabitForm.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import { isDoneToday, isDueToday, streak, dayStats, dateStr } from '../api.js';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

function message(percent, total) {
  if (!total) return 'Add your first habit to get started.';
  if (percent === 100) return 'Perfect day! Every habit is done. 🎉';
  if (percent >= 50) return 'Great progress. Keep going, you are close!';
  return 'A small step now keeps your streak alive.';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { habits, loading, error, add, toggle, addSamples } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');

  const total = habits.length;
  const done = habits.filter(isDoneToday).length;
  const dueCount = habits.filter(isDueToday).length;
  const percent = dueCount ? Math.round((done / dueCount) * 100) : 0;
  const bestCurrent = Math.max(0, ...habits.map((h) => streak(h)));
  const categories = ['All', ...new Set(habits.map((h) => h.category))];
  const shown = (filter === 'All' ? habits : habits.filter((h) => h.category === filter)).sort((a, b) => isDueToday(b) - isDueToday(a));

  const week = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const { pct } = dayStats(habits, dateStr(d));
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), pct, today: i === 6 };
  });

  return (
    <>
      <section className="banner">
        <div>
          <p className="banner-date">{new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1>{greeting()}, {user.name} 👋</h1>
          <p className="banner-msg">{message(percent, total)}</p>
          <button className="btn btn-light" onClick={() => setShowForm(true)}>+ Add habit</button>
        </div>
        <ProgressRing percent={percent} />
      </section>

      <div className="stats">
        <div className="card stat"><span className="s-icon">✅</span><div><h2>{done} / {dueCount}</h2><p className="muted">Done today</p></div></div>
        <div className="card stat"><span className="s-icon">🔥</span><div><h2>{bestCurrent} in a row</h2><p className="muted">Top current streak</p></div></div>
        <div className="card stat"><span className="s-icon">📋</span><div><h2>{total}</h2><p className="muted">Total habits</p></div></div>
      </div>

      <div className="card">
        <h2>This week</h2>
        <div className="week">
          {week.map((d, i) => (
            <div key={i} className={'day' + (d.today ? ' today' : '')}>
              <span className="dot" style={{ '--p': d.pct }}>{d.pct === 1 ? '✓' : ''}</span><small>{d.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="page-head section">
        <h2>Today's habits</h2>
        {total > 0 && <div className="filters">{categories.map((c) => (
          <button key={c} className={'chip' + (filter === c ? ' on' : '')} onClick={() => setFilter(c)}>{c !== 'All' && ICONS[c]} {c}</button>
        ))}</div>}
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p className="muted">Loading…</p> : total === 0 ? (
        <div className="empty">
          <p>No habits yet. Add your own, or start with a set of sample habits.</p>
          <div className="actions center">
            <button className="btn" onClick={() => setShowForm(true)}>+ Add habit</button>
            <button className="btn btn-ghost" onClick={addSamples}>Add sample habits</button>
          </div>
        </div>
      ) : (
        <div className="grid">{shown.map((h) => <HabitCard key={h._id} habit={h} onComplete={(x) => toggle(x._id)} />)}</div>
      )}

      {showForm && <HabitForm onClose={() => setShowForm(false)} onSave={async (d) => { await add(d); setShowForm(false); }} />}
    </>
  );
}
