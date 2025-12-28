export type HabitCategory = 'Health' | 'Fitness' | 'Learning' | 'Work' | 'Mindfulness' | 'Custom';
export type GoalType = 'count' | 'duration'; // duration is in minutes
export type HabitStatus = 'active' | 'completed' | 'expired' | 'paused';

export interface Habit {
  id: string; // UUID
  name: string;
  category: HabitCategory;
  customCategoryName?: string; // Only if category is 'Custom'
  goalType: GoalType;
  goalValue: number; // count or minutes
  currentProgress: number;
  deadline: string; // ISO date string
  status: HabitStatus;
  createdAt: string;
  completedAt?: string;
  pointsEarned: number; // Points gained from this habit
  pointsLost: number; // Points lost from this habit
  currentStreak: number; // Current streak for this habit
}

export interface AppState {
  totalPoints: number;
  habits: Habit[];
  currentStreak: number;
  completedHabitsCount: number;
  missedHabitsCount: number;
  penaltyIntensity: 'light' | 'normal'; // light = -5pts, normal = -10pts
  isPremium: boolean; // Premium status for leaderboard access
  dailyActivity: DailyActivity[]; // Last 30 days of activity
  lastDeadlineCheck?: string; // ISO timestamp of last deadline check
}

export interface OnboardingState {
  completed: boolean;
  dontShowPrivacy: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  streak: number;
  avatar?: string; // Optional avatar URL
  isFriend?: boolean;
}

export type PricingOption = 'annual' | 'lifetime';

export interface DailyActivity {
  date: string; // ISO date string (YYYY-MM-DD)
  completedHabits: string[]; // Array of habit IDs completed this day
  pointsEarned: number;
  pointsLost: number;
}

export interface CompletionHistory {
  habitId: string;
  habitName: string;
  completedAt: string;
  pointsEarned: number;
}

