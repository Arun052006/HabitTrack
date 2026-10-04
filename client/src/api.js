// Small fetch wrapper that attaches the JWT token automatically.
export async function api(path, method = 'GET', body) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

// ---------- dates ----------
export const dateStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

// ---------- frequency ----------
export const FREQUENCIES = ['Daily', 'Every 2 days', 'Every 3 days', 'Weekly'];
const INTERVALS = { 'Daily': 1, 'Every 2 days': 2, 'Every 3 days': 3, 'Weekly': 7 };
export const intervalOf = (freq) => INTERVALS[freq] || 1;

// ---------- completion & schedule ----------
export const isDone = (h, key) => h.completedDates.includes(key);
export const isDoneToday = (h) => isDone(h, dateStr());

// Was this habit expected on that date? (done that day, never done yet, or enough days since the previous check-in)
export function scheduledOn(h, key) {
  const iv = intervalOf(h.frequency);
  const first = [h.createdAt ? dateStr(new Date(h.createdAt)) : key, ...h.completedDates].sort()[0];
  if (key < first) return false;
  if (isDone(h, key)) return true;
  const prev = h.completedDates.filter((d) => d < key).sort().pop();
  return !prev || daysBetween(prev, key) >= iv;
}
export const isDueToday = (h) => scheduledOn(h, dateStr());

// { done, scheduled, pct } for a list of habits on one date
export function dayStats(habits, key) {
  const scheduled = habits.filter((h) => scheduledOn(h, key)).length;
  const done = habits.filter((h) => isDone(h, key)).length;
  return { done, scheduled, pct: scheduled ? Math.min(1, done / scheduled) : 0 };
}

// Text such as "Next due in 2 days" (null for daily habits)
export function dueInfo(h) {
  const iv = intervalOf(h.frequency), today = dateStr();
  if (iv === 1) return null;
  const last = [...h.completedDates].sort().pop();
  if (!last) return 'Due today';
  const since = daysBetween(last, today);
  if (since === 0) return `Next due in ${iv} days`;
  if (since >= iv) return 'Due today';
  const n = iv - since;
  return `Next due in ${n} day${n > 1 ? 's' : ''}`;
}

// ---------- streaks (count of check-ins in a row, allowing the habit's interval between them) ----------
export function streak(h) {
  const iv = intervalOf(h.frequency);
  const d = [...new Set(h.completedDates)].sort().reverse();
  if (!d.length || daysBetween(d[0], dateStr()) > iv) return 0;
  let n = 1;
  while (n < d.length && daysBetween(d[n], d[n - 1]) <= iv) n++;
  return n;
}
export function bestStreak(h) {
  const iv = intervalOf(h.frequency);
  const d = [...new Set(h.completedDates)].sort();
  let best = 0, run = 0;
  d.forEach((x, i) => { run = i && daysBetween(d[i - 1], x) <= iv ? run + 1 : 1; best = Math.max(best, run); });
  return best;
}
