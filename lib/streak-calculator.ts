import { Habit, AppState, DailyActivity } from '@/types/habit';

/**
 * Calculate the global streak based on daily activity
 * A streak is maintained if there's at least one habit completed each day
 */
export function calculateGlobalStreak(dailyActivity: DailyActivity[]): number {
  // Ensure dailyActivity is an array
  if (!Array.isArray(dailyActivity) || dailyActivity.length === 0) return 0;

  // Sort by date descending (most recent first)
  const sortedActivity = [...dailyActivity].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedActivity.length; i++) {
    const activityDate = new Date(sortedActivity[i].date);
    activityDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    // Check if this activity is from the expected consecutive day
    if (activityDate.getTime() === expectedDate.getTime() && 
        sortedActivity[i].completedHabits.length > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate individual habit streak based on completion history
 */
export function calculateHabitStreak(habit: Habit, dailyActivity: DailyActivity[]): number {
  // Ensure dailyActivity is an array
  if (!Array.isArray(dailyActivity) || dailyActivity.length === 0) return 0;

  // Sort by date descending
  const sortedActivity = [...dailyActivity].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedActivity.length; i++) {
    const activityDate = new Date(sortedActivity[i].date);
    activityDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    // Check if this habit was completed on the expected day
    if (activityDate.getTime() === expectedDate.getTime() && 
        sortedActivity[i].completedHabits.includes(habit.id)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get or create today's daily activity entry
 */
export function getTodayActivity(dailyActivity: DailyActivity[]): DailyActivity {
  // Ensure dailyActivity is an array
  const activity = Array.isArray(dailyActivity) ? dailyActivity : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const existing = activity.find(a => a.date === todayStr);
  if (existing) {
    return existing;
  }

  return {
    date: todayStr,
    completedHabits: [],
    pointsEarned: 0,
    pointsLost: 0,
  };
}

/**
 * Update daily activity with a completed habit
 */
export function recordHabitCompletion(
  dailyActivity: DailyActivity[],
  habitId: string,
  points: number
): DailyActivity[] {
  // Ensure dailyActivity is an array
  const activity = Array.isArray(dailyActivity) ? dailyActivity : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const existingIndex = activity.findIndex(a => a.date === todayStr);
  
  if (existingIndex >= 0) {
    // Update existing entry
    const updated = [...activity];
    const todayActivity = { ...updated[existingIndex] };
    
    if (!todayActivity.completedHabits.includes(habitId)) {
      todayActivity.completedHabits = [...todayActivity.completedHabits, habitId];
    }
    todayActivity.pointsEarned += Math.max(0, points);
    
    updated[existingIndex] = todayActivity;
    return updated;
  } else {
    // Create new entry
    const newActivity: DailyActivity = {
      date: todayStr,
      completedHabits: [habitId],
      pointsEarned: Math.max(0, points),
      pointsLost: 0,
    };
    return [...activity, newActivity];
  }
}

/**
 * Record a missed habit (for points lost tracking)
 */
export function recordHabitMiss(
  dailyActivity: DailyActivity[],
  points: number
): DailyActivity[] {
  // Ensure dailyActivity is an array
  const activity = Array.isArray(dailyActivity) ? dailyActivity : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const existingIndex = activity.findIndex(a => a.date === todayStr);
  
  if (existingIndex >= 0) {
    const updated = [...activity];
    const todayActivity = { ...updated[existingIndex] };
    todayActivity.pointsLost += Math.abs(points);
    updated[existingIndex] = todayActivity;
    return updated;
  } else {
    const newActivity: DailyActivity = {
      date: todayStr,
      completedHabits: [],
      pointsEarned: 0,
      pointsLost: Math.abs(points),
    };
    return [...activity, newActivity];
  }
}

/**
 * Prune old daily activity entries (keep last 30 days)
 */
export function pruneOldActivity(dailyActivity: DailyActivity[]): DailyActivity[] {
  // Ensure dailyActivity is an array
  if (!Array.isArray(dailyActivity)) return [];
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  return dailyActivity.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= thirtyDaysAgo;
  });
}

