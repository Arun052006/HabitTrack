const Habit = require('../models/Habit');
const { buildSamples } = require('../seedData');

const fields = ({ name, description, category, target, unit, frequency }) =>
  ({ name, description, category, target, unit, frequency });

// GET /api/habits
exports.getHabits = async (req, res) => {
  const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(habits);
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  if (!req.body.name) return res.status(400).json({ message: 'Habit name is required.' });
  const habit = await Habit.create({ ...fields(req.body), userId: req.userId });
  res.status(201).json(habit);
};

// PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId }, fields(req.body), { new: true, runValidators: true });
  if (!habit) return res.status(404).json({ message: 'Habit not found.' });
  res.json(habit);
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!habit) return res.status(404).json({ message: 'Habit not found.' });
  res.json({ message: 'Habit deleted.' });
};

// PUT /api/habits/:id/complete  (body: { date: "YYYY-MM-DD" }) - toggles completion for that day
exports.toggleComplete = async (req, res) => {
  const date = req.body.date || new Date().toISOString().slice(0, 10);
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
  if (!habit) return res.status(404).json({ message: 'Habit not found.' });
  habit.completedDates = habit.completedDates.includes(date)
    ? habit.completedDates.filter((d) => d !== date)
    : [...habit.completedDates, date];
  await habit.save();
  res.json(habit);
};

// POST /api/habits/samples - adds the sample habits to the logged-in user's account
exports.addSamples = async (req, res) => {
  const habits = await Habit.insertMany(buildSamples().map((h) => ({ ...h, userId: req.userId })));
  res.status(201).json(habits);
};
