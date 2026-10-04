import { isDoneToday, isDueToday, streak, dueInfo } from '../api.js';

export const ICONS = { Health: '💧', Education: '📚', Fitness: '🏃', Mind: '🧘', Lifestyle: '🌙', Other: '⭐' };

export default function HabitCard({ habit, onComplete, onEdit, onDelete }) {
  const done = isDoneToday(habit);
  const s = streak(habit);
  const info = dueInfo(habit);
  const rest = !isDueToday(habit);
  return (
    <div className={`card habit cat-${habit.category}` + (done ? ' done' : '') + (rest ? ' rest' : '')}>
      <div className="habit-top">
        <span className="icon">{ICONS[habit.category] || '⭐'}</span>
        <div className="grow">
          <h3>{habit.name}</h3>
          <p className="muted">{habit.target} {habit.unit} · {habit.frequency}</p>
        </div>
        <span className={'badge' + (s ? '' : ' off')}>🔥 {s}</span>
      </div>
      {habit.description && <p className="desc">{habit.description}</p>}
      {info && <p className={'due' + (info === 'Due today' ? ' now' : '')}>📅 {info}</p>}
      <div className="actions">
        <button className={done ? 'btn btn-done' : 'btn'} onClick={() => onComplete(habit)}>
          {done ? '✓ Completed' : 'Mark completed'}
        </button>
        {onEdit && <button className="btn btn-ghost" onClick={() => onEdit(habit)}>Edit</button>}
        {onDelete && <button className="btn btn-ghost danger" onClick={() => onDelete(habit)}>Delete</button>}
      </div>
    </div>
  );
}
