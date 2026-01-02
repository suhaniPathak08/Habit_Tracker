/**
 * Calculate the current streak for a habit.
 * Current streak = consecutive days from today going backward.
 * 
 * @param {Object} habit - Habit object with completedDates array
 * @returns {number} Current streak in days
 * 
 * Example test cases:
 * - completedDates: ['2025-11-18', '2025-11-19', '2025-11-20'] → 3 (if today is 2025-11-20)
 * - completedDates: ['2025-11-18', '2025-11-20'] → 1 (if today is 2025-11-20, streak broken on 19th)
 * - completedDates: ['2025-11-15'] → 0 (if today is 2025-11-20, no recent streak)
 */
export function currentStreak(habit) {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return 0;
  }
  
  // Sort dates in descending order
  const sortedDates = [...habit.completedDates].sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().split('T')[0];
  
  // Check if today or yesterday is completed (to allow for end-of-day flexibility)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let streak = 0;
  let checkDate = new Date();
  
  // Start from today if completed, otherwise from yesterday
  if (sortedDates[0] === today) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (sortedDates[0] === yesterdayStr) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  } else {
    return 0; // No recent activity
  }
  
  // Count consecutive days backward
  for (let i = 1; i < sortedDates.length; i++) {
    const expectedDate = checkDate.toISOString().split('T')[0];
    if (sortedDates[i] === expectedDate) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate the best (longest) streak for a habit.
 * Best streak = longest consecutive sequence of completed dates.
 * 
 * @param {Object} habit - Habit object with completedDates array
 * @returns {number} Best streak in days
 * 
 * Example test cases:
 * - completedDates: ['2025-11-01', '2025-11-02', '2025-11-03', '2025-11-10', '2025-11-11'] → 3
 * - completedDates: ['2025-11-01', '2025-11-03', '2025-11-05'] → 1 (no consecutive days)
 * - completedDates: ['2025-11-15', '2025-11-16', '2025-11-17', '2025-11-18', '2025-11-19'] → 5
 */
export function bestStreak(habit) {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return 0;
  }
  
  // Sort dates in ascending order
  const sortedDates = [...habit.completedDates].sort((a, b) => a.localeCompare(b));
  
  let maxStreak = 1;
  let currentCount = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    
    // Calculate day difference
    const diffTime = currDate - prevDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      // Consecutive day
      currentCount++;
      maxStreak = Math.max(maxStreak, currentCount);
    } else {
      // Streak broken, reset count
      currentCount = 1;
    }
  }
  
  return maxStreak;
}
