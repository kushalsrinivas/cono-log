import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useApp } from '@/contexts/app-context';
import { getOnboardingStatus } from '@/lib/storage';
import { CelebrationModal } from '@/components/celebration-modal';
import { PenaltyModal } from '@/components/penalty-modal';
import { v4 as uuidv4 } from 'uuid';
import { shouldCheckDeadlines, processDeadlineChecks, getNextCheckTimestamp } from '@/lib/background-tasks';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const { state, completeHabit, missHabit, addHabit, deleteHabit, updateLastDeadlineCheck } = useApp();
  const [celebrationHabit, setCelebrationHabit] = useState<{ name: string; id: string; points: number } | null>(null);
  const [penaltyHabit, setPenaltyHabit] = useState<{ name: string; id: string; points: number } | null>(null);
  const [lastCompletedHabitId, setLastCompletedHabitId] = useState<string | null>(null);

  useEffect(() => {
    getOnboardingStatus().then(status => {
      setIsOnboardingComplete(status.completed);
    });
  }, []);

  // Watch for newly completed habits
  useEffect(() => {
    const justCompleted = state.habits.find(h => 
      h.status === 'completed' && 
      h.completedAt && 
      h.id !== lastCompletedHabitId &&
      !celebrationHabit
    );
    
    if (justCompleted) {
      setLastCompletedHabitId(justCompleted.id);
      setCelebrationHabit({
        name: justCompleted.name,
        id: justCompleted.id,
        points: justCompleted.pointsEarned,
      });
    }
  }, [state.habits]);

  // Check deadlines on app focus
  useEffect(() => {
    if (!isOnboardingComplete || state.habits.length === 0) return;

    // Only check if enough time has passed
    if (!shouldCheckDeadlines(state.lastDeadlineCheck)) return;

    const results = processDeadlineChecks(state.habits, state.penaltyIntensity);
    
    if (results.length > 0) {
      // Update last check timestamp
      const timestamp = getNextCheckTimestamp();
      updateLastDeadlineCheck(timestamp);
      
      // Process first result
      const result = results[0];
      if (result.wasCompleted) {
        completeHabit(result.habit.id, result.pointsChanged);
        setCelebrationHabit({
          name: result.habit.name,
          id: result.habit.id,
          points: result.pointsChanged,
        });
      } else {
        missHabit(result.habit.id, result.pointsChanged);
        setPenaltyHabit({
          name: result.habit.name,
          id: result.habit.id,
          points: result.pointsChanged,
        });
      }
    }
  }, [isOnboardingComplete, state.habits, state.lastDeadlineCheck]);

  // Periodic deadline checking (every minute)
  useEffect(() => {
    if (!isOnboardingComplete) return;
    
    const interval = setInterval(() => {
      if (state.habits.length === 0) return;
      
      if (shouldCheckDeadlines(state.lastDeadlineCheck)) {
        const results = processDeadlineChecks(state.habits, state.penaltyIntensity);
        
        if (results.length > 0) {
          const timestamp = getNextCheckTimestamp();
          updateLastDeadlineCheck(timestamp);
          
          const result = results[0];
          if (result.wasCompleted) {
            completeHabit(result.habit.id, result.pointsChanged);
            setCelebrationHabit({
              name: result.habit.name,
              id: result.habit.id,
              points: result.pointsChanged,
            });
          } else {
            missHabit(result.habit.id, result.pointsChanged);
            setPenaltyHabit({
              name: result.habit.name,
              id: result.habit.id,
              points: result.pointsChanged,
            });
          }
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isOnboardingComplete, state.habits, state.lastDeadlineCheck, state.penaltyIntensity]);

  const handleRestartHabit = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (habit) {
      // Create new habit with same details but new deadline
      const newHabit = {
        ...habit,
        id: uuidv4(),
        currentProgress: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
        currentStreak: 0,
      };
      addHabit(newHabit);
    }
    setCelebrationHabit(null);
    setPenaltyHabit(null);
  };

  const handleArchiveHabit = (habitId: string) => {
    deleteHabit(habitId);
    setCelebrationHabit(null);
    setPenaltyHabit(null);
  };

  useEffect(() => {
    if (isOnboardingComplete === null) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    if (!isOnboardingComplete && !inOnboarding) {
      router.replace('/onboarding/splash');
    } else if (isOnboardingComplete && !inTabs && !segments[0]) {
      router.replace('/(tabs)');
    }
  }, [isOnboardingComplete, segments]);

  if (isOnboardingComplete === null) {
    return null; // Loading
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-habit" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="habit/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="habit/log-progress" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="purchase-confirmed" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
      
      {celebrationHabit && (
        <CelebrationModal
          visible={true}
          habitName={celebrationHabit.name}
          pointsEarned={celebrationHabit.points}
          onRestart={() => handleRestartHabit(celebrationHabit.id)}
          onArchive={() => handleArchiveHabit(celebrationHabit.id)}
        />
      )}
      
      {penaltyHabit && (
        <PenaltyModal
          visible={true}
          habitName={penaltyHabit.name}
          pointsLost={penaltyHabit.points}
          onTryAgain={() => handleRestartHabit(penaltyHabit.id)}
          onArchive={() => handleArchiveHabit(penaltyHabit.id)}
          onClose={() => setPenaltyHabit(null)}
        />
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
