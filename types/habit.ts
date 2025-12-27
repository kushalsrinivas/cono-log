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
}

export interface AppState {
  totalPoints: number;
  habits: Habit[];
  currentStreak: number;
  completedHabitsCount: number;
  missedHabitsCount: number;
  penaltyIntensity: 'light' | 'normal'; // light = -5pts, normal = -10pts
}

export interface OnboardingState {
  completed: boolean;
  dontShowPrivacy: boolean;
}

