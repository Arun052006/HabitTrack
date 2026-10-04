// Run with:  npm run seed
// Creates a demo account with sample habits and 5 weeks of history.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Habit = require('./models/Habit');
const { buildSamples } = require('./seedData');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email: 'demo@habittrack.com' });
  if (!user) user = await User.create({ name: 'Arun', email: 'demo@habittrack.com', password: await bcrypt.hash('demo123', 10) });
  await Habit.deleteMany({ userId: user._id });
  await Habit.insertMany(buildSamples().map((h) => ({ ...h, userId: user._id })));
  console.log('Seeded demo data.\n  Email:    demo@habittrack.com\n  Password: demo123');
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
