import { useEffect, useState } from 'react';
import { api, dateStr } from '../api.js';

// Holds all habit CRUD logic so pages stay small.
export default function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/habits').then(setHabits).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const replace = (h) => setHabits((list) => list.map((x) => (x._id === h._id ? h : x)));

  return {
    habits, loading, error,
    add: async (data) => { const h = await api('/habits', 'POST', data); setHabits((l) => [h, ...l]); },
    update: async (id, data) => replace(await api('/habits/' + id, 'PUT', data)),
    remove: async (id) => { await api('/habits/' + id, 'DELETE'); setHabits((l) => l.filter((x) => x._id !== id)); },
    addSamples: async () => { const list = await api('/habits/samples', 'POST'); setHabits((l) => [...list, ...l]); },
    toggle: async (id, date = dateStr()) => replace(await api(`/habits/${id}/complete`, 'PUT', { date })),
  };
}
