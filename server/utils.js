// Utility helper functions
const crypto = require('crypto');

// Generate unique ID (simple UUID-like)
function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

// Get today's date in YYYY-MM-DD format
function today() {
  return new Date().toISOString().split('T')[0];
}

// Normalize date to YYYY-MM-DD format
function normalizeDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateId,
  today,
  normalizeDate
};