import { Habit } from '@/types/habit';

export interface DeadlineCheckResult {
  habit: Habit;
  wasCompleted: boolean; // true if goal was met, false if missed
  pointsChanged: number;
}

export function checkDeadlines(
  habits: Habit[],
  currentDate: Date,
  penaltyIntensity: 'light' | 'normal'
): DeadlineCheckResult[] {
  const results: DeadlineCheckResult[] = [];
  
  for (const habit of habits) {
    if (habit.status !== 'active') {
      continue;
    }
    
    const deadline = new Date(habit.deadline);
    
    // Check if deadline has passed
    if (currentDate > deadline) {
      const goalMet = habit.currentProgress >= habit.goalValue;
      
      if (goalMet) {
        // Goal was completed - calculate points with potential early bonus
        // Note: completedAt would be when they reached the goal, but we don't track that yet
        // For now, use the current date for calculation
        const hoursEarly = (deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
        // If we're past deadline but goal was met, give base points only
        const points = 10; // Base points for completion
        
        results.push({
          habit: {
            ...habit,
            status: 'completed',
            completedAt: currentDate.toISOString(),
            pointsEarned: habit.pointsEarned + points,
          },
          wasCompleted: true,
          pointsChanged: points,
        });
      } else {
        // Goal was missed
        const points = penaltyIntensity === 'light' ? -5 : -10;
        
        results.push({
          habit: {
            ...habit,
            status: 'expired',
            pointsLost: habit.pointsLost + Math.abs(points),
          },
          wasCompleted: false,
          pointsChanged: points,
        });
      }
    }
  }
  
  return results;
}

