import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { Button } from '@/components/button';
import { ProgressBar } from '@/components/progress-bar';

const { height } = Dimensions.get('window');

export default function LogProgressModal() {
  const router = useRouter();
  const { habitId } = useLocalSearchParams();
  const { state, logProgress } = useApp();
  const habit = state.habits.find(h => h.id === habitId);
  const [amount, setAmount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressData = useMemo(() => {
    if (!habit) return null;

    const currentProgress = habit.currentProgress;
    const newProgress = Math.min(currentProgress + amount, habit.goalValue);
    const progressPercent = (currentProgress / habit.goalValue) * 100;
    const newProgressPercent = (newProgress / habit.goalValue) * 100;
    
    // Calculate potential points if this completes the goal
    let points = 0;
    if (newProgress >= habit.goalValue) {
      const deadline = new Date(habit.deadline);
      const now = new Date();
      const hoursEarly = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      const bonus = hoursEarly >= 24 ? 5 : 0;
      points = 10 + bonus;
    } else {
      // Partial progress - show incremental value
      points = Math.round((amount / habit.goalValue) * 10);
    }
    
    return {
      currentProgress,
      newProgress,
      progressPercent,
      newProgressPercent,
      points,
    };
  }, [habit, amount]);

  if (!habit) {
    return null;
  }

  const handleConfirm = () => {
    if (amount <= 0) return;
    
    logProgress(habit.id, amount);
    router.back();
  };

  const increment = () => {
    setAmount(prev => prev + 1);
  };

  const decrement = () => {
    setAmount(prev => Math.max(1, prev - 1));
  };

  const unit = habit.goalType === 'duration' ? 'min' : 'time';
  const unitLabel = amount === 1 ? unit : unit + 's';

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={() => router.back()}
    >
      <View style={styles.overlay}>
        {/* Bottom Sheet */}
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.label}>LOG ACTIVITY</Text>
            <Text style={styles.title}>{habit.name}</Text>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={18} color={AppColors.textMuted} />
              <Text style={styles.streak}>Streak: {habit.currentStreak} Days</Text>
            </View>
          </View>

          {/* Stepper Control */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity 
              style={styles.decreaseButton} 
              onPress={decrement} 
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="minus" size={30} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <View style={styles.valueDisplay}>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{amount}</Text>
                <Text style={styles.plusIndicator}>+</Text>
              </View>
              <Text style={styles.unitLabel}>{unitLabel.toUpperCase()}</Text>
            </View>

            <TouchableOpacity 
              style={styles.increaseButton} 
              onPress={increment} 
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={36} color={AppColors.backgroundDark} />
            </TouchableOpacity>
          </View>

          {/* Live Feedback Card */}
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackRow}>
              <View>
                <Text style={styles.feedbackLabel}>IMPACT</Text>
                <View style={styles.pointsContainer}>
                  <MaterialCommunityIcons name="lightning-bolt" size={20} color={AppColors.primary} />
                  <Text style={styles.pointsText}>+{progressData?.points} pts</Text>
                </View>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Goal Progress</Text>
                <Text style={styles.progressNumbers}>
                  {progressData?.currentProgress} <Text style={styles.arrow}>→</Text>{' '}
                  <Text style={styles.progressNew}>{progressData?.newProgress}</Text> / {habit.goalValue}
                </Text>
              </View>
            </View>
            
            {/* Enhanced Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                {/* Current Progress */}
                <View style={[
                  styles.progressCurrent,
                  { width: `${progressData?.progressPercent}%` }
                ]} />
                {/* Anticipated Progress */}
                <View style={[
                  styles.progressNew,
                  { 
                    left: `${progressData?.progressPercent}%`,
                    width: `${(progressData?.newProgressPercent || 0) - (progressData?.progressPercent || 0)}%`
                  }
                ]} />
              </View>
            </View>
          </View>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmText}>Confirm Log</Text>
              <MaterialCommunityIcons name="check-circle" size={22} color={AppColors.backgroundDark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AppColors.backgroundDark,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary + 'B3',
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -0.5,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  streak: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textMuted,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 40,
    flex: 1,
    maxHeight: 200,
  },
  decreaseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.surfaceDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  valueDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  value: {
    fontSize: 80,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -4,
    lineHeight: 80,
  },
  plusIndicator: {
    position: 'absolute',
    top: 8,
    right: -24,
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  unitLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: AppColors.textMuted,
    marginTop: 4,
    letterSpacing: 2,
  },
  increaseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  feedbackCard: {
    backgroundColor: AppColors.surfaceDark + '80',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  feedbackLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.primary,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textLight,
    marginBottom: 2,
  },
  progressNumbers: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  arrow: {
    marginHorizontal: 4,
  },
  progressNew: {
    color: AppColors.white,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 16,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressCurrent: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)',
  },
  progressNew: {
    position: 'absolute',
    top: 0,
    height: '100%',
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  confirmButton: {
    width: '100%',
    height: 56,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
});

