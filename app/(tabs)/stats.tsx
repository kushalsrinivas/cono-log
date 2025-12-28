import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { useRouter } from 'expo-router';

export default function StatsScreen() {
  const { state } = useApp();
  const router = useRouter();

  // Calculate weekly consistency from real daily activity
  const weeklyData = React.useMemo(() => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completed = days.map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index)); // Go back from 6 days ago to today
      const dateStr = date.toISOString().split('T')[0];
      
      const activity = state.dailyActivity.find(a => a.date === dateStr);
      return activity ? activity.completedHabits.length > 0 : false;
    });
    
    const consistency = Math.round((completed.filter(Boolean).length / days.length) * 100);
    return { days, completed, consistency };
  }, [state.dailyActivity]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.white} />
          </TouchableOpacity>
          <Text style={styles.header}>Progress</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Score */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroScore}>+{state.totalPoints}</Text>
          <Text style={styles.heroLabel}>TOTAL SCORE</Text>
        </View>

        {/* Momentum Card */}
        <View style={styles.momentumCard}>
          <View style={styles.momentumHeader}>
            <MaterialCommunityIcons name="trending-up" size={20} color={AppColors.primary} />
            <Text style={styles.momentumTitle}>Momentum</Text>
          </View>
          <Text style={styles.momentumText}>
            {state.currentStreak > 0 
              ? `You're on a ${state.currentStreak} day streak! Keep it going.`
              : state.completedHabitsCount > 0
              ? `You've completed ${state.completedHabitsCount} habit${state.completedHabitsCount > 1 ? 's' : ''}. Start a streak today!`
              : 'Complete your first habit to start building momentum.'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardCompleted]}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons name="check-circle" size={20} color={AppColors.primary} />
            </View>
            <Text style={styles.statValue}>{state.completedHabitsCount}</Text>
            <Text style={styles.statLabel}>Habits Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconMuted]}>
              <MaterialCommunityIcons name="close-circle" size={20} color={AppColors.textMuted} />
            </View>
            <Text style={[styles.statValue, styles.statValueMuted]}>{state.missedHabitsCount}</Text>
            <Text style={styles.statLabel}>Habits Missed</Text>
          </View>
        </View>

        {/* Weekly Heatmap */}
        <View style={styles.heatmapContainer}>
          <View style={styles.heatmapHeader}>
            <Text style={styles.heatmapTitle}>Last 7 Days</Text>
            <Text style={styles.heatmapConsistency}>{weeklyData.consistency}% Consistency</Text>
          </View>
          
          <View style={styles.heatmap}>
            {weeklyData.days.map((day, index) => {
              const isActive = weeklyData.completed[index];
              const isToday = index === weeklyData.days.length - 1;
              
              return (
                <View key={index} style={styles.heatmapDay}>
                  <View style={[
                    styles.heatmapBar,
                    isActive && styles.heatmapBarActive,
                    isToday && styles.heatmapBarToday,
                  ]} />
                  <Text style={[
                    styles.heatmapLabel,
                    isToday && styles.heatmapLabelToday,
                  ]}>
                    {day}
                  </Text>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              );
            })}
          </View>
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
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroScore: {
    fontSize: 64,
    fontWeight: '800',
    color: AppColors.primary,
    letterSpacing: -3,
    textShadowColor: AppColors.primary + '30',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
    letterSpacing: 2,
    marginTop: 8,
  },
  momentumCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: AppColors.surfaceDark + '30',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b5443',
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
  },
  momentumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  momentumTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
  },
  momentumText: {
    fontSize: 12,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statCardCompleted: {
    borderColor: AppColors.primary + '30',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconMuted: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -1,
  },
  statValueMuted: {
    color: AppColors.textLight,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  heatmapContainer: {
    paddingHorizontal: 24,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  heatmapTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.white,
  },
  heatmapConsistency: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  heatmap: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heatmapDay: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  heatmapBar: {
    width: '100%',
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heatmapBarActive: {
    backgroundColor: AppColors.primary,
  },
  heatmapBarToday: {
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  heatmapLabel: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontFamily: 'monospace',
  },
  heatmapLabelToday: {
    color: AppColors.white,
    fontWeight: '700',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.white,
    position: 'absolute',
    bottom: -2,
  },
});

