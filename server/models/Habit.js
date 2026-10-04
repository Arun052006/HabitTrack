const mongoose = require('mongoose');
module.exports = mongoose.model('Habit', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Health' },
  target: { type: Number, default: 1 },
  unit: { type: String, default: 'Times' },
  frequency: { type: String, default: 'Daily' },
  completedDates: { type: [String], default: [] },
}, { timestamps: true }));
