// API route handlers for auth and habits
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { verifyToken } = require('./middleware');
const { today } = require('./utils');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret_change_in_production';

// ============ AUTH ROUTES ============

// POST /api/auth/signup - Create new user
router.post('/auth/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser(email, passwordHash);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Authenticate user
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Get user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
});

// ============ HABIT ROUTES (Protected) ============

// GET /api/habits - Get all user's habits
router.get('/habits', verifyToken, async (req, res, next) => {
  try {
    const habits = await db.getHabits(req.user.id);
    res.json(habits);
  } catch (error) {
    next(error);
  }
});

// POST /api/habits - Create new habit
router.post('/habits', verifyToken, async (req, res, next) => {
  try {
    const { title, description, frequency, startDate } = req.body;

    // Validation
    if (!title || !frequency || !startDate) {
      return res.status(400).json({ 
        error: 'Title, frequency, and startDate are required' 
      });
    }
    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({ 
        error: 'Frequency must be daily, weekly, or monthly' 
      });
    }

    const habit = await db.createHabit(req.user.id, {
      title,
      description: description || '',
      frequency,
      startDate
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
});

// PUT /api/habits/:id - Update habit
router.put('/habits/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate frequency if provided
    if (updates.frequency && !['daily', 'weekly', 'monthly'].includes(updates.frequency)) {
      return res.status(400).json({ 
        error: 'Frequency must be daily, weekly, or monthly' 
      });
    }

    const habit = await db.updateHabit(req.user.id, id, updates);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/habits/:id - Delete habit
router.delete('/habits/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await db.deleteHabit(req.user.id, id);

    if (!success) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/habits/:id/toggle - Toggle completion for a date
router.post('/habits/:id/toggle', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const date = req.body.date || today(); // Use today if no date provided

    const habit = await db.toggleCompletion(req.user.id, id, date);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    next(error);
  }
});

module.exports = router;