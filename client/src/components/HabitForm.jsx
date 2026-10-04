import { useState } from 'react';

const CATEGORIES = ['Health', 'Education', 'Fitness', 'Mind', 'Lifestyle', 'Other'];
const UNITS = ['Litres', 'Hours', 'Minutes', 'Pages', 'Times'];
import { FREQUENCIES as FREQ } from '../api.js';

// Used for both "Add Habit" (POST) and "Edit Habit" (PUT)
export default function HabitForm({ habit, onSave, onClose }) {
  const [form, setForm] = useState(habit || { name: '', description: '', category: 'Health', target: 1, unit: 'Times', frequency: 'Daily' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await onSave({ ...form, target: Number(form.target) || 1 }); }
    catch (err) { setError(err.message); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{habit ? 'Edit habit' : 'Add new habit'}</h2>
        {error && <p className="error">{error}</p>}
        <label>Habit name<input value={form.name} onChange={set('name')} placeholder="Drink water" required autoFocus /></label>
        <label>Description<input value={form.description} onChange={set('description')} placeholder="Drink at least 2 litres" /></label>
        <label>Category<select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <div className="row">
          <label>Target<input type="number" min="1" step="any" value={form.target} onChange={set('target')} /></label>
          <label>Unit<select value={form.unit} onChange={set('unit')}>{UNITS.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>
        <label>How often?<select value={form.frequency} onChange={set('frequency')}>{FREQ.map((c) => <option key={c}>{c}</option>)}</select></label>
        <p className="muted" style={{ margin: '-6px 0 8px' }}>“Every 2 days” means once in every 2 days.</p>
        <div className="actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn">{habit ? 'Update habit' : 'Add habit'}</button>
        </div>
      </form>
    </div>
  );
}
