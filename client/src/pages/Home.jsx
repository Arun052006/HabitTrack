import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import ProgressRing from '../components/ProgressRing.jsx';

const FEATURES = [
  ['✅', 'Daily check-ins', 'Mark each habit done with one tap and undo it if you tap by mistake.'],
  ['🔥', 'Streaks', 'See how many days in a row you have kept going. Streaks keep you motivated.'],
  ['📊', 'Progress reports', 'Completion rate, best streak and a 7-day chart show how you are doing.'],
  ['✏️', 'Fully editable', 'Add, edit or delete habits any time. Change targets as you improve.'],
  ['🔒', 'Private and secure', 'Passwords are hashed and every user sees only their own habits.'],
  ['📱', 'Works everywhere', 'A clean layout that fits your phone, tablet and computer.'],
];

const STEPS = [
  ['Create your account', 'Register with your name and email. It takes under a minute.'],
  ['Add your habits', 'Pick a category, set a target such as 2 litres or 30 minutes, and save.'],
  ['Check in every day', 'Mark habits complete and watch your streak and progress grow.'],
];

export default function Home() {
  const { user } = useAuth();
  const cta = user
    ? <Link className="btn btn-lg" to="/dashboard">Go to dashboard</Link>
    : <><Link className="btn btn-lg" to="/register">Get started free</Link><Link className="btn btn-lg btn-ghost" to="/login">Login</Link></>;

  return (
    <div className="landing">
      <section className="lp-hero">
        <div className="lp-copy">
          <span className="pill">🌱 Personal habit tracker</span>
          <h1>Build better habits, one day at a time.</h1>
          <p className="lead">Track water, study, exercise, reading and more. Check in daily, grow your streaks and see your progress at a glance.</p>
          <div className="actions">{cta}</div>
        </div>

        <div className="lp-preview" aria-hidden="true">
          <div className="pv-head"><div><p>Today's progress</p><b>3 of 4 done</b></div><ProgressRing percent={75} size={84} stroke={9} /></div>
          <div className="pv-row cat-Health"><span className="icon">💧</span><div className="grow"><b>Drink Water</b><small>2 Litres</small></div><span className="badge">🔥 7</span></div>
          <div className="pv-row cat-Education"><span className="icon">📚</span><div className="grow"><b>Study</b><small>1 Hour</small></div><span className="badge">🔥 5</span></div>
          <div className="pv-row cat-Fitness"><span className="icon">🏃</span><div className="grow"><b>Exercise</b><small>30 Minutes</small></div><span className="badge">🔥 3</span></div>
        </div>
      </section>

      <section className="lp-section">
        <h2>Everything you need to stay consistent</h2>
        <p className="sub">Simple tools, no clutter.</p>
        <div className="features">
          {FEATURES.map(([i, t, d]) => (
            <div className="card feature" key={t}><span className="f-icon">{i}</span><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <h2>How it works</h2>
        <div className="steps">
          {STEPS.map(([t, d], i) => (
            <div className="step" key={t}><span className="num">{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="lp-cta">
        <h2>Ready to start your streak?</h2>
        <p>Join HabitTrack and make today day one.</p>
        {!user && <Link className="btn btn-lg btn-light" to="/register">Create free account</Link>}
        {user && <Link className="btn btn-lg btn-light" to="/dashboard">Open dashboard</Link>}
      </section>

      <footer className="foot">🌱 HabitTrack · Built with MongoDB, Express, React and Node</footer>
    </div>
  );
}
