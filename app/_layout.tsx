import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useApp } from '@/contexts/app-context';
import { getOnboardingStatus } from '@/lib/storage';
import { checkDeadlines } from '@/lib/deadline-checker';
import { CelebrationModal } from '@/components/celebration-modal';
import { PenaltyModal } from '@/components/penalty-modal';
import { v4 as uuidv4 } from 'uuid';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const { state, completeHabit, missHabit, addHabit, deleteHabit } = useApp();
  const [celebrationHabit, setCelebrationHabit] = useState<{ name: string; id: string; points: number } | null>(null);
  const [penaltyHabit, setPenaltyHabit] = useState<{ name: string; id: string; points: number } | null>(null);

  useEffect(() => {
    getOnboardingStatus().then(status => {
      setIsOnboardingComplete(status.completed);
    });
  }, []);

  // Check deadlines on app focus
  useEffect(() => {
    if (!isOnboardingComplete || state.habits.length === 0) return;

    const results = checkDeadlines(state.habits, new Date(), state.penaltyIntensity);
    
    if (results.length > 0) {
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
  }, [isOnboardingComplete]);

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
