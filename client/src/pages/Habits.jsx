import { useState } from 'react';
import useHabits from '../components/useHabits.js';
import HabitCard from '../components/HabitCard.jsx';
import HabitForm from '../components/HabitForm.jsx';

export default function Habits() {
  const { habits, loading, error, add, update, remove, toggle } = useHabits();
  const [form, setForm] = useState(null);        // null | 'new' | habit being edited
  const [toDelete, setToDelete] = useState(null);

  return (
    <>
      <div className="page-head">
        <h1>My habits</h1>
        <button className="btn" onClick={() => setForm('new')}>+ Add habit</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p className="muted">Loading…</p> : habits.length === 0 ? (
        <p className="empty">You have no habits. Add one to start tracking.</p>
      ) : (
        <div className="grid">
          {habits.map((h) => (
            <HabitCard key={h._id} habit={h} onComplete={(x) => toggle(x._id)} onEdit={setForm} onDelete={setToDelete} />
          ))}
        </div>
      )}

      {form && (
        <HabitForm
          habit={form === 'new' ? null : form}
          onClose={() => setForm(null)}
          onSave={async (d) => { form === 'new' ? await add(d) : await update(form._id, d); setForm(null); }}
        />
      )}

      {toDelete && (
        <div className="overlay" onClick={() => setToDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete habit?</h2>
            <p>Are you sure you want to delete “{toDelete.name}”? This cannot be undone.</p>
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={async () => { await remove(toDelete._id); setToDelete(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
