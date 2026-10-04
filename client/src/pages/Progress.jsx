import useHabits from '../components/useHabits.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { isDoneToday, isDueToday, bestStreak, dayStats, dateStr } from '../api.js';

export default function Progress() {
  const { habits, loading } = useHabits();
  if (loading) return <p className="muted">Loading…</p>;

  const total = habits.length;
  const today = habits.filter(isDoneToday).length;
  const due = habits.filter(isDueToday).length;
  const rate = due ? Math.round((today / due) * 100) : 0;
  const best = Math.max(0, ...habits.map((h) => bestStreak(h)));

  // Last 7 days, oldest to newest
  const week = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const { pct } = dayStats(habits, dateStr(d));
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), percent: Math.round(pct * 100) };
  });

  return (
    <>
      <div className="page-head"><h1>My progress</h1></div>
      <div className="stats">
        <div className="card stat"><p className="muted">Total habits</p><h2>{total}</h2></div>
        <div className="card stat"><p className="muted">Completed today</p><h2>{today} / {due}</h2></div>
        <div className="card stat"><p className="muted">Completion rate</p><h2>{rate}%</h2></div>
        <div className="card stat"><p className="muted">Best streak</p><h2>🔥 {best} in a row</h2></div>
      </div>

      <div className="card">
        <h2>Last 7 days</h2>
        {week.map((d, i) => (
          <div className="week-row" key={i}>
            <span>{d.label}</span><ProgressBar percent={d.percent} /><span className="pct">{d.percent}%</span>
          </div>
        ))}
      </div>
    </>
  );
}
