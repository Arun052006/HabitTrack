// Sample habits + realistic completion history (used by seed.js and the "Add sample habits" button)
const pad = (n) => String(n).padStart(2, '0');
const dateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const INTERVALS = { 'Daily': 1, 'Every 2 days': 2, 'Every 3 days': 3, 'Weekly': 7 };

const SAMPLES = [
  { name: 'Drink Water',  description: 'Drink at least 2 litres of water', category: 'Health',    target: 2,  unit: 'Litres',  frequency: 'Daily',        streak: 9, rate: 0.9 },
  { name: 'Study',        description: 'Focused study session',            category: 'Education', target: 1,  unit: 'Hours',   frequency: 'Daily',        streak: 5, rate: 0.8 },
  { name: 'Exercise',     description: 'Workout, run or yoga',             category: 'Fitness',   target: 30, unit: 'Minutes', frequency: 'Every 2 days', streak: 4, rate: 0.8 },
  { name: 'Read a Book',  description: 'Read before bed',                  category: 'Education', target: 20, unit: 'Pages',   frequency: 'Every 3 days', streak: 0, rate: 0.8 },
  { name: 'Meditation',   description: 'Quiet breathing and focus',        category: 'Mind',      target: 10, unit: 'Minutes', frequency: 'Daily',        streak: 2, rate: 0.6 },
  { name: 'Sleep Early',  description: 'In bed before 10:30 pm',           category: 'Lifestyle', target: 1,  unit: 'Times',   frequency: 'Daily',        streak: 0, rate: 0.5 },
];

// streak = completions in a row ending today; one missed slot follows, then random history.
function buildSamples() {
  return SAMPLES.map(({ streak, rate, ...h }) => {
    const iv = INTERVALS[h.frequency], dates = [];
    const add = (i) => { const d = new Date(); d.setDate(d.getDate() - i); dates.push(dateStr(d)); };
    let i = 0;
    for (let k = 0; k < streak; k++) { add(i); i += iv; }
    i += iv;
    while (i < 35) { if (Math.random() < rate) add(i); i += iv; }
    const created = new Date(); created.setDate(created.getDate() - 35);
    return { ...h, completedDates: dates, createdAt: created };
  });
}

module.exports = { buildSamples };
