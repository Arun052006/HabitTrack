import { useState } from 'react';
import useHabits from '../components/useHabits.js';
import { ICONS } from '../components/HabitCard.jsx';
import { dateStr, isDone, scheduledOn, dayStats } from '../api.js';

const level = (p) => (p === 0 ? 0 : p < 0.34 ? 1 : p < 0.67 ? 2 : p < 1 ? 3 : 4);
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { habits, loading, toggle } = useHabits();
  const today = dateStr();
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [sel, setSel] = useState(today);
  const [hid, setHid] = useState('all');
  if (loading) return <p className="muted">Loading…</p>;

  const list = hid === 'all' ? habits : habits.filter((h) => h._id === hid);
  const y = month.getFullYear(), m = month.getMonth();
  const cells = [...Array(new Date(y, m + 1, 0).getDate())].map((_, i) => {
    const key = dateStr(new Date(y, m, i + 1));
    return { day: i + 1, key, future: key > today, ...dayStats(list, key) };
  });
  const past = cells.filter((c) => !c.future);
  const checkIns = past.reduce((n, c) => n + c.done, 0);
  const active = past.filter((c) => c.done > 0).length;
  const perfect = past.filter((c) => c.scheduled > 0 && c.done === c.scheduled).length;
  const go = (n) => setMonth(new Date(y, m + n, 1));

  const selLabel = new Date(sel + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="page-head">
        <h1>Calendar</h1>
        <select className="cal-select" value={hid} onChange={(e) => setHid(e.target.value)}>
          <option value="all">All habits</option>
          {habits.map((h) => <option key={h._id} value={h._id}>{ICONS[h.category]} {h.name}</option>)}
        </select>
      </div>

      <div className="stats">
        <div className="card stat col"><h2>{checkIns}</h2><p className="muted">Check-ins this month</p></div>
        <div className="card stat col"><h2>{active}</h2><p className="muted">Active days</p></div>
        <div className="card stat col"><h2>{perfect}</h2><p className="muted">Perfect days</p></div>
      </div>

      <div className="cal-layout">
        <div className="card">
          <div className="cal-head">
            <button className="btn btn-ghost" onClick={() => go(-1)} aria-label="Previous month">‹</button>
            <h2>{month.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h2>
            <button className="btn btn-ghost" onClick={() => go(1)} aria-label="Next month">›</button>
          </div>
          <div className="cal-grid">
            {WEEK.map((w) => <b key={w} className="cal-dow">{w}</b>)}
            {[...Array(month.getDay())].map((_, i) => <span key={'b' + i} />)}
            {cells.map((c) => {
              const miss = !c.future && c.scheduled > 0 && c.done === 0;
              const cls = ['cal-cell', 'l' + level(c.pct), miss && 'miss', c.future && 'future', c.key === today && 'today', c.key === sel && 'sel'].filter(Boolean).join(' ');
              return <button key={c.key} className={cls} onClick={() => setSel(c.key)}>{c.day}</button>;
            })}
          </div>
          <p className="legend muted">
            <span className="lg l0" /> none <span className="lg l1" /> some <span className="lg l3" /> most <span className="lg l4" /> all done <span className="lg miss" /> missed
          </p>
        </div>

        <div className="card">
          <h2>{selLabel}</h2>
          {list.length === 0 && <p className="muted">No habits yet.</p>}
          {list.map((h) => {
            const done = isDone(h, sel), sched = scheduledOn(h, sel), future = sel > today;
            const status = done ? '✓ Done' : !sched ? 'Rest day' : future ? 'Upcoming' : sel === today ? 'Due today' : 'Missed';
            return (
              <div key={h._id} className={`day-row cat-${h.category}`}>
                <span className="icon">{ICONS[h.category]}</span>
                <div className="grow"><b>{h.name}</b><small className={'st ' + (done ? 'ok' : status === 'Missed' ? 'bad' : '')}>{status}</small></div>
                {!future && <button className={done ? 'btn btn-ghost' : 'btn'} onClick={() => toggle(h._id, sel)}>{done ? 'Undo' : 'Mark done'}</button>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
