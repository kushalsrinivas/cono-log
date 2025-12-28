import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { ProgressBar } from '@/components/progress-bar';
import { Button } from '@/components/button';

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { state, updateHabit, deleteHabit } = useApp();
  const habit = state.habits.find(h => h.id === id);
  const [showMenu, setShowMenu] = useState(false);

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const progress = (habit.currentProgress / habit.goalValue) * 100;
  const deadline = new Date(habit.deadline);
  const now = new Date();
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysRemaining = Math.ceil(hoursRemaining / 24);

  const handleLogProgress = () => {
    // Navigate to log progress modal
    router.push({
      pathname: '/habit/log-progress',
      params: { habitId: habit.id },
    });
  };

  const handlePauseResume = () => {
    const newStatus = habit.status === 'paused' ? 'active' : 'paused';
    updateHabit({
      ...habit,
      status: newStatus,
    });
    setShowMenu(false);
    Alert.alert(
      newStatus === 'paused' ? 'Habit Paused' : 'Habit Resumed',
      newStatus === 'paused' 
        ? 'This habit won\'t count towards your streak until resumed.'
        : 'This habit is now active again.'
    );
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton} 
          activeOpacity={0.7}
          onPress={() => setShowMenu(!showMenu)}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color={AppColors.white} />
        </TouchableOpacity>
        
        {showMenu && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handlePauseResume}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name={habit.status === 'paused' ? "play" : "pause"} 
                size={20} 
                color={AppColors.white} 
              />
              <Text style={styles.menuItemText}>
                {habit.status === 'paused' ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="delete" size={20} color={AppColors.red} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryBadge}>
          <MaterialCommunityIcons name="heart" size={16} color={AppColors.primary} />
          <Text style={styles.categoryText}>{habit.category.toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>{habit.name}</Text>
        <Text style={styles.description}>
          {habit.goalType === 'duration' 
            ? `Daily ${habit.goalValue} minute goal`
            : `Complete ${habit.goalValue} times`}
        </Text>

        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>WEEKLY GOAL</Text>
          <View style={styles.goalProgress}>
            <Text style={styles.goalNumbers}>
              {habit.currentProgress} / {habit.goalValue} {habit.goalType === 'duration' ? 'min' : 'times'}
            </Text>
            <Text style={styles.goalPercent}>{Math.round(progress)}%</Text>
          </View>
          <ProgressBar progress={progress} height={12} />
          <View style={styles.goalFooter}>
            <View style={styles.goalInfo}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={AppColors.textLight} />
              <Text style={styles.goalInfoText}>
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>On Track</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="scale-balance" size={20} color={AppColors.textLight} />
              <Text style={styles.infoTitle}>Stakes</Text>
            </View>
            <Text style={styles.infoValue}>+/- 50</Text>
            <View style={styles.stakesBreakdown}>
              <Text style={styles.stakesGain}>+50</Text>
              <Text style={styles.stakesLoss}>-50</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="clock-alert-outline" size={20} color={AppColors.textLight} />
              <Text style={styles.infoTitle}>Deadline</Text>
            </View>
            <Text style={styles.infoValue}>{Math.abs(Math.round(hoursRemaining))}h</Text>
            <Text style={styles.riskText}>Risk: -50pts</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={styles.streakValue}>{habit.currentStreak} Day{habit.currentStreak !== 1 ? 's' : ''}</Text>
          <View style={styles.streakBars}>
            {Array.from({ length: Math.min(habit.currentStreak, 7) }).map((_, i) => (
              <View key={i} style={styles.streakBar} />
            ))}
          </View>
        </View>

        <Text style={styles.quote}>
          "Consistency is what transforms average into excellence."
        </Text>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        {habit.status === 'active' && (
          <Button title="+ Log Progress" onPress={handleLogProgress} />
        )}
        {habit.status === 'paused' && (
          <Button 
            title="Resume Habit" 
            onPress={handlePauseResume}
          />
        )}
        {(habit.status === 'completed' || habit.status === 'expired') && (
          <Text style={styles.statusMessage}>
            {habit.status === 'completed' ? '✓ Goal Completed' : '✗ Deadline Missed'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.surfaceDark,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.white,
  },
  menuItemTextDanger: {
    color: AppColors.red,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.primary,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  goalCard: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textLight,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  goalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalNumbers: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  goalPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalInfoText: {
    fontSize: 13,
    color: AppColors.textLight,
  },
  statusBadge: {
    backgroundColor: AppColors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  infoValue: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 8,
  },
  stakesBreakdown: {
    flexDirection: 'row',
    gap: 12,
  },
  stakesGain: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
  },
  stakesLoss: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.red,
  },
  riskText: {
    fontSize: 13,
    color: AppColors.red,
  },
  streakCard: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  streakLabel: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 16,
  },
  streakBars: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBar: {
    width: 8,
    height: 40,
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: AppColors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  spacer: {
    height: 40,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 18,
    color: AppColors.textLight,
    textAlign: 'center',
    marginTop: 40,
  },
});

