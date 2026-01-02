// MongoDB data access layer
const mongoose = require('mongoose');

const HABIT_FREQUENCIES = ['daily', 'weekly', 'monthly'];
const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

// ----- Schemas -----
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    frequency: { type: String, enum: HABIT_FREQUENCIES, default: 'daily' },
    startDate: { type: String, required: true }, // store as YYYY-MM-DD
    completedDates: [{ type: String }]
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Habit = mongoose.models.Habit || mongoose.model('Habit', habitSchema);

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('📦 Connected to MongoDB');
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

function getDbStatus() {
  return connectionStates[mongoose.connection.readyState] || 'unknown';
}

// ----- User helpers -----
async function getUserByEmail(email) {
  return User.findOne({ email }).lean();
}

async function createUser(email, passwordHash) {
  const user = new User({ email, passwordHash });
  await user.save();
  return user.toObject();
}

// ----- Habit helpers -----
async function getHabits(userId) {
  return Habit.find({ userId }).sort({ createdAt: -1 }).lean();
}

async function createHabit(userId, { title, description, frequency, startDate }) {
  const habit = new Habit({
    userId,
    title,
    description: description || '',
    frequency,
    startDate,
    completedDates: []
  });

  await habit.save();
  return habit.toObject();
}

async function updateHabit(userId, habitId, updates) {
  const habit = await Habit.findOneAndUpdate(
    { _id: habitId, userId },
    updates,
    { new: true, runValidators: true }
  ).lean();

  return habit;
}

async function deleteHabit(userId, habitId) {
  const result = await Habit.deleteOne({ _id: habitId, userId });
  return result.deletedCount === 1;
}

async function toggleCompletion(userId, habitId, date) {
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) return null;

  const idx = habit.completedDates.indexOf(date);
  if (idx > -1) {
    habit.completedDates.splice(idx, 1);
  } else {
    habit.completedDates.push(date);
  }

  await habit.save();
  return habit.toObject();
}

module.exports = {
  connectDB,
  getDbStatus,
  getUserByEmail,
  createUser,
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion
};







