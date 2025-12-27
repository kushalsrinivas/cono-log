import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';

export default function StatsScreen() {
  const { state } = useApp();

  const bestCategory = React.useMemo(() => {
    const completedByCategory = state.habits
      .filter(h => h.status === 'completed')
      .reduce((acc, habit) => {
        acc[habit.category] = (acc[habit.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const entries = Object.entries(completedByCategory);
    if (entries.length === 0) return 'None yet';
    
    const best = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
    return best[0];
  }, [state.habits]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Progress</Text>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsNumber}>{state.totalPoints.toLocaleString()}</Text>
          <View style={styles.pointsLabel}>
            <MaterialCommunityIcons name="star" size={24} color={AppColors.primary} />
            <Text style={styles.pointsText}>TOTAL POINTS</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={32} color={AppColors.primary} />
            <Text style={styles.statValue}>{state.completedHabitsCount}</Text>
            <Text style={styles.statLabel}>Habits Completed</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="close-circle" size={32} color={AppColors.red + 'CC'} />
            <Text style={styles.statValue}>{state.missedHabitsCount}</Text>
            <Text style={styles.statLabel}>Habits Missed</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={32} color={AppColors.orange} />
            <Text style={styles.statValue}>{state.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="trophy" size={32} color={AppColors.primary} />
            <Text style={styles.statValue}>{bestCategory}</Text>
            <Text style={styles.statLabel}>Best Category</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {state.completedHabitsCount > 0
              ? "You kept moving forward this week."
              : "Start building your first habit to see your progress."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 32,
    textAlign: 'center',
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pointsNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -3,
    marginBottom: 8,
  },
  pointsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textLight,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  summaryText: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

