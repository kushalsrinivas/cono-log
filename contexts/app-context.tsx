import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Habit } from '@/types/habit';
import { getAppState, saveAppState } from '@/lib/storage';
import { 
  calculateGlobalStreak, 
  recordHabitCompletion, 
  recordHabitMiss,
  pruneOldActivity 
} from '@/lib/streak-calculator';

type AppAction =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string } // habit ID
  | { type: 'LOG_PROGRESS'; payload: { habitId: string; progress: number } }
  | { type: 'COMPLETE_HABIT'; payload: { habitId: string; points: number } }
  | { type: 'MISS_HABIT'; payload: { habitId: string; points: number } }
  | { type: 'UPDATE_PENALTY_INTENSITY'; payload: 'light' | 'normal' }
  | { type: 'UNLOCK_PREMIUM' }
  | { type: 'UPDATE_LAST_DEADLINE_CHECK'; payload: string }
  | { type: 'RESET_STATE' };

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  logProgress: (habitId: string, progress: number) => void;
  completeHabit: (habitId: string, points: number) => void;
  missHabit: (habitId: string, points: number) => void;
  updatePenaltyIntensity: (intensity: 'light' | 'normal') => void;
  unlockPremium: () => void;
  updateLastDeadlineCheck: (timestamp: string) => void;
  resetState: () => void;
}

const DEFAULT_APP_STATE: AppState = {
  totalPoints: 0,
  habits: [],
  currentStreak: 0,
  completedHabitsCount: 0,
  missedHabitsCount: 0,
  penaltyIntensity: 'normal',
  isPremium: false,
  dailyActivity: [],
  lastDeadlineCheck: undefined,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload],
      };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h),
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
      };

    case 'LOG_PROGRESS': {
      const { habitId, progress } = action.payload;
      const habit = state.habits.find(h => h.id === habitId);
      
      if (!habit) return state;
      
      const newProgress = habit.currentProgress + progress;
      
      // Check if goal is completed
      if (newProgress >= habit.goalValue && habit.status === 'active') {
        // Calculate points with potential early bonus
        const deadline = new Date(habit.deadline);
        const now = new Date();
        const hoursEarly = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
        const bonus = hoursEarly >= 24 ? 5 : 0;
        const points = 10 + bonus;
        
        // Record completion in daily activity
        const updatedActivity = recordHabitCompletion(state.dailyActivity, habitId, points);
        const newGlobalStreak = calculateGlobalStreak(updatedActivity);
        
        return {
          ...state,
          totalPoints: state.totalPoints + points,
          completedHabitsCount: state.completedHabitsCount + 1,
          currentStreak: newGlobalStreak,
          habits: state.habits.map(h =>
            h.id === habitId
              ? {
                  ...h,
                  currentProgress: newProgress,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                  pointsEarned: h.pointsEarned + points,
                  currentStreak: h.currentStreak + 1,
                }
              : h
          ),
          dailyActivity: pruneOldActivity(updatedActivity),
        };
      }
      
      // Just update progress
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === habitId
            ? { ...h, currentProgress: newProgress }
            : h
        ),
      };
    }

    case 'COMPLETE_HABIT': {
      const { habitId, points } = action.payload;
      
      // Record completion in daily activity
      const updatedActivity = recordHabitCompletion(state.dailyActivity, habitId, points);
      
      // Calculate new global streak
      const newGlobalStreak = calculateGlobalStreak(updatedActivity);
      
      // Update habit with incremented streak
      const updatedHabits = state.habits.map(h =>
        h.id === habitId
          ? {
              ...h,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              pointsEarned: h.pointsEarned + points,
              currentStreak: h.currentStreak + 1,
            }
          : h
      );
      
      return {
        ...state,
        totalPoints: state.totalPoints + points,
        completedHabitsCount: state.completedHabitsCount + 1,
        currentStreak: newGlobalStreak,
        habits: updatedHabits,
        dailyActivity: pruneOldActivity(updatedActivity),
      };
    }

    case 'MISS_HABIT': {
      const { habitId, points } = action.payload;
      const absPoints = Math.abs(points);
      
      // Record miss in daily activity
      const updatedActivity = recordHabitMiss(state.dailyActivity, points);
      
      // Calculate new global streak (might be reset)
      const newGlobalStreak = calculateGlobalStreak(updatedActivity);
      
      return {
        ...state,
        totalPoints: state.totalPoints + points, // points is negative
        missedHabitsCount: state.missedHabitsCount + 1,
        currentStreak: newGlobalStreak,
        habits: state.habits.map(h =>
          h.id === habitId
            ? {
                ...h,
                status: 'expired' as const,
                pointsLost: h.pointsLost + absPoints,
                currentStreak: 0, // Reset individual habit streak
              }
            : h
        ),
        dailyActivity: pruneOldActivity(updatedActivity),
      };
    }

    case 'UPDATE_PENALTY_INTENSITY':
      return {
        ...state,
        penaltyIntensity: action.payload,
      };

    case 'UNLOCK_PREMIUM':
      return {
        ...state,
        isPremium: true,
      };

    case 'UPDATE_LAST_DEADLINE_CHECK':
      return {
        ...state,
        lastDeadlineCheck: action.payload,
      };

    case 'RESET_STATE':
      return DEFAULT_APP_STATE;

    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_APP_STATE);

  // Load state from storage on mount
  useEffect(() => {
    getAppState().then(savedState => {
      dispatch({ type: 'SET_STATE', payload: savedState });
    });
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Helper functions
  const addHabit = (habit: Habit) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const updateHabit = (habit: Habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const logProgress = (habitId: string, progress: number) => {
    dispatch({ type: 'LOG_PROGRESS', payload: { habitId, progress } });
  };

  const completeHabit = (habitId: string, points: number) => {
    dispatch({ type: 'COMPLETE_HABIT', payload: { habitId, points } });
  };

  const missHabit = (habitId: string, points: number) => {
    dispatch({ type: 'MISS_HABIT', payload: { habitId, points } });
  };

  const updatePenaltyIntensity = (intensity: 'light' | 'normal') => {
    dispatch({ type: 'UPDATE_PENALTY_INTENSITY', payload: intensity });
  };

  const unlockPremium = () => {
    dispatch({ type: 'UNLOCK_PREMIUM' });
  };

  const updateLastDeadlineCheck = (timestamp: string) => {
    dispatch({ type: 'UPDATE_LAST_DEADLINE_CHECK', payload: timestamp });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const value: AppContextValue = {
    state,
    dispatch,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    completeHabit,
    missHabit,
    updatePenaltyIntensity,
    unlockPremium,
    updateLastDeadlineCheck,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

