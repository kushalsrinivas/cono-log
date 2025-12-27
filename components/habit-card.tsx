import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Habit } from '@/types/habit';
import { AppColors } from '@/constants/colors';
import { ProgressBar } from './progress-bar';
import { DeadlineCountdown } from './deadline-countdown';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

export function HabitCard({ habit, onPress }: HabitCardProps) {
  const progress = (habit.currentProgress / habit.goalValue) * 100;
  const deadline = new Date(habit.deadline);
  const now = new Date();
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isUrgent = hoursRemaining < 12 && hoursRemaining > 0;
  
  const goalUnit = habit.goalType === 'duration' ? 'min' : '';
  const currentDisplay = habit.goalType === 'duration' 
    ? `${habit.currentProgress} / ${habit.goalValue} ${goalUnit}`
    : `${habit.currentProgress} / ${habit.goalValue}`;

  return (
    <TouchableOpacity
      style={[styles.card, isUrgent && styles.urgentCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{habit.name}</Text>
          <Text style={styles.category}>{habit.category}</Text>
        </View>
        <DeadlineCountdown hoursRemaining={hoursRemaining} isUrgent={isUrgent} />
      </View>

      <View style={styles.stakesContainer}>
        <MaterialCommunityIcons name="scale-balance" size={14} color={AppColors.textLight} />
        <Text style={styles.stakesText}>
          Stakes:{' '}
          <Text style={styles.stakesGain}>+{10 + (isUrgent ? 0 : 5)}</Text>
          {' / '}
          <Text style={styles.stakesLoss}>-{habit.pointsLost || 5}</Text>
          {' pts'}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{currentDisplay}</Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <ProgressBar progress={progress} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgentCard: {
    borderLeftColor: AppColors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: AppColors.textLight,
  },
  stakesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.backgroundDark + '80',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  stakesText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textLight,
  },
  stakesGain: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  stakesLoss: {
    color: AppColors.red + 'CC',
    fontWeight: '700',
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textLight,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
});

