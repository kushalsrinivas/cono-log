import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, OnboardingState } from '@/types/habit';

const KEYS = {
  ONBOARDING: '@habbitica:onboarding',
  APP_STATE: '@habbitica:app_state',
};

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

const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  completed: false,
  dontShowPrivacy: false,
};

// Onboarding Storage
export async function getOnboardingStatus(): Promise<OnboardingState> {
  try {
    const data = await AsyncStorage.getItem(KEYS.ONBOARDING);
    if (data) {
      return JSON.parse(data);
    }
    return DEFAULT_ONBOARDING_STATE;
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return DEFAULT_ONBOARDING_STATE;
  }
}

export async function saveOnboardingComplete(dontShowPrivacy: boolean = false): Promise<void> {
  try {
    const state: OnboardingState = {
      completed: true,
      dontShowPrivacy,
    };
    await AsyncStorage.setItem(KEYS.ONBOARDING, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
}

// App State Storage
export async function getAppState(): Promise<AppState> {
  try {
    const data = await AsyncStorage.getItem(KEYS.APP_STATE);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure new fields exist for backwards compatibility
      return {
        ...DEFAULT_APP_STATE,
        ...parsed,
        dailyActivity: parsed.dailyActivity || [],
        lastDeadlineCheck: parsed.lastDeadlineCheck || undefined,
      };
    }
    return DEFAULT_APP_STATE;
  } catch (error) {
    console.error('Error reading app state:', error);
    return DEFAULT_APP_STATE;
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.APP_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
}

// Clear all data (for settings reset)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.ONBOARDING, KEYS.APP_STATE]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

