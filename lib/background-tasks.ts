import { AppState, Habit } from '@/types/habit';
import { checkDeadlines, DeadlineCheckResult } from './deadline-checker';

/**
 * Check if enough time has passed since last deadline check
 * to avoid processing the same deadline multiple times
 */
export function shouldCheckDeadlines(lastCheck: string | undefined): boolean {
  if (!lastCheck) return true;
  
  const lastCheckTime = new Date(lastCheck).getTime();
  const now = Date.now();
  
  // Check every 5 minutes minimum
  const FIVE_MINUTES = 5 * 60 * 1000;
  
  return now - lastCheckTime >= FIVE_MINUTES;
}

/**
 * Process deadline checks and return results
 */
export function processDeadlineChecks(
  habits: Habit[],
  penaltyIntensity: 'light' | 'normal'
): DeadlineCheckResult[] {
  const now = new Date();
  return checkDeadlines(habits, now, penaltyIntensity);
}

/**
 * Get timestamp for next deadline check
 */
export function getNextCheckTimestamp(): string {
  return new Date().toISOString();
}

