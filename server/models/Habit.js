// server/models/Habit.js
// Mongoose schema for Habit

import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDates: [{
    type: Date
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
habitSchema.index({ userId: 1, createdAt: -1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;