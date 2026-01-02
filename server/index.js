// Main Express server entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const api = require('./api');
const { connectDB, getDbStatus } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow Vite and other dev servers
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: getDbStatus(),
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', api);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
🚀 Habit Tracker API running on port ${PORT}
📊 Database: MongoDB
🔗 Try: http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
