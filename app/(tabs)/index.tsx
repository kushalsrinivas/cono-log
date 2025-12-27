import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { HabitCard } from '@/components/habit-card';
import { Button } from '@/components/button';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useApp();
  const hasHabits = state.habits.length > 0;
  const activeHabits = state.habits.filter(h => h.status === 'active');
  const completedHabits = state.habits.filter(h => h.status === 'completed');

  if (!hasHabits) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyHeader}>Today</Text>
          
          <View style={styles.pointsCard}>
            <Text style={styles.pointsNumber}>0</Text>
            <View style={styles.pointsLabel}>
              <MaterialCommunityIcons name="star" size={16} color={AppColors.primary} />
              <Text style={styles.pointsText}>POINTS</Text>
            </View>
          </View>

          <View style={styles.illustrationContainer}>
            <View style={styles.neonCircle}>
              <MaterialCommunityIcons name="sprout" size={80} color={AppColors.primary} />
            </View>
          </View>

          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>
            Start with one small goal. Consistency beats intensity.
          </Text>

          <Button
            title="+ Create your first habit"
            onPress={() => router.push('/create-habit/step1')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Active Habits</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="cog" size={24} color={AppColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{state.totalPoints.toLocaleString()}</Text>
            <View style={styles.statLabel}>
              <MaterialCommunityIcons name="star" size={18} color={AppColors.primary} />
              <Text style={styles.statText}>TOTAL PTS</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.streakRow}>
              <Text style={styles.statNumber}>{state.currentStreak}</Text>
              <Text style={styles.streakDays}>days</Text>
            </View>
            <View style={styles.statLabel}>
              <MaterialCommunityIcons name="fire" size={18} color={AppColors.orange} />
              <Text style={styles.statText}>STREAK</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S TARGETS</Text>
          <Text style={styles.sectionCount}>{activeHabits.length} Remaining</Text>
        </View>

        <View style={styles.habitsContainer}>
          {activeHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => router.push(`/habit/${habit.id}`)}
            />
          ))}

          {completedHabits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              style={styles.completedHabitCard}
              onPress={() => router.push(`/habit/${habit.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.completedIconContainer}>
                <MaterialCommunityIcons name="check-circle" size={32} color={AppColors.primary} />
              </View>
              <View style={styles.completedInfo}>
                <Text style={styles.completedTitle}>{habit.name}</Text>
                <Text style={styles.completedPoints}>+{habit.pointsEarned} pts earned</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-habit/step1')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={32} color={AppColors.backgroundDark} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 32,
  },
  pointsCard: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.cardDark,
  },
  pointsNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -2,
  },
  pointsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  neonCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: AppColors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -1,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textLight,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  habitsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  completedHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardDark + '40',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    opacity: 0.7,
  },
  completedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedInfo: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
    textDecorationLine: 'line-through',
    textDecorationColor: AppColors.primary + '80',
    marginBottom: 2,
  },
  completedPoints: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  spacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
});
