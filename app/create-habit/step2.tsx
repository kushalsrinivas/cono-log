import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { GoalType } from '@/types/habit';
import { Button } from '@/components/button';

export default function CreateHabitStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [goalType, setGoalType] = useState<GoalType>('duration');
  const [goalValue, setGoalValue] = useState('30');
  const [error, setError] = useState('');

  const handleNext = () => {
    const value = parseInt(goalValue);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid number');
      return;
    }
    router.push({
      pathname: '/create-habit/step3',
      params: {
        ...params,
        goalType,
        goalValue: value.toString(),
      },
    });
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
        <Text style={styles.headerTitle}>CREATE HABIT</Text>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotFilled]} />
          <View style={[styles.dot, styles.dotFilled]} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How do you measure success?</Text>
        <Text style={styles.subtitle}>Choose how you'll track your progress daily.</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, goalType === 'count' && styles.toggleButtonActive]}
            onPress={() => setGoalType('count')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color={goalType === 'count' ? AppColors.backgroundDark : AppColors.white}
            />
            <Text style={[styles.toggleLabel, goalType === 'count' && styles.toggleLabelActive]}>
              REPETITION
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, goalType === 'duration' && styles.toggleButtonActive]}
            onPress={() => setGoalType('duration')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={32}
              color={goalType === 'duration' ? AppColors.backgroundDark : AppColors.white}
            />
            <Text style={[styles.toggleLabel, goalType === 'duration' && styles.toggleLabelActive]}>
              DURATION
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.goalInputContainer}>
          <TextInput
            style={styles.goalInput}
            value={goalValue}
            onChangeText={(text) => {
              setGoalValue(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={4}
          />
          <Text style={styles.goalUnit}>{goalType === 'duration' ? 'min' : 'times'}</Text>
        </View>

        <Text style={styles.goalLabel}>DAILY GOAL</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons name="star" size={24} color={AppColors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Point Reward</Text>
            <Text style={styles.infoText}>
              Hitting this target daily earns you <Text style={styles.infoHighlight}>50 points</Text>{' '}
              towards your level up.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Next Step" onPress={handleNext} />
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
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
    letterSpacing: 1.5,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.textMuted,
  },
  dotFilled: {
    backgroundColor: AppColors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    marginBottom: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: 1,
  },
  toggleLabelActive: {
    color: AppColors.backgroundDark,
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goalInput: {
    fontSize: 80,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    minWidth: 120,
  },
  goalUnit: {
    fontSize: 32,
    fontWeight: '600',
    color: AppColors.textLight,
    marginLeft: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 32,
  },
  errorText: {
    fontSize: 14,
    color: AppColors.red,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 20,
  },
  infoHighlight: {
    color: AppColors.white,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});

