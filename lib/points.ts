export const POINTS = {
  COMPLETE_ON_TIME: 10,
  EARLY_BONUS: 5, // If completed >24hrs before deadline
  MISS_LIGHT: -5,
  MISS_NORMAL: -10,
};

export function calculatePointsForCompletion(
  deadline: Date,
  completedAt: Date,
  penaltyIntensity: 'light' | 'normal'
): number {
  const onTime = completedAt <= deadline;
  if (!onTime) {
    return penaltyIntensity === 'light' ? POINTS.MISS_LIGHT : POINTS.MISS_NORMAL;
  }
  
  const hoursEarly = (deadline.getTime() - completedAt.getTime()) / (1000 * 60 * 60);
  const bonus = hoursEarly >= 24 ? POINTS.EARLY_BONUS : 0;
  
  return POINTS.COMPLETE_ON_TIME + bonus;
}

export function calculatePointsForMiss(penaltyIntensity: 'light' | 'normal'): number {
  return penaltyIntensity === 'light' ? POINTS.MISS_LIGHT : POINTS.MISS_NORMAL;
}

export function formatPoints(points: number): string {
  const sign = points > 0 ? '+' : '';
  return `${sign}${points} pts`;
}

