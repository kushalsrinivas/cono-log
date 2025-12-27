import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { Button } from '@/components/button';

export default function LogProgressModal() {
  const router = useRouter();
  const { habitId } = useLocalSearchParams();
  const { state, logProgress } = useApp();
  const habit = state.habits.find(h => h.id === habitId);
  const [amount, setAmount] = useState('1');

  if (!habit) {
    return null;
  }

  const handleConfirm = () => {
    const value = parseInt(amount);
    if (isNaN(value) || value <= 0) return;

    logProgress(habit.id, value);
    router.back();
  };

  const increment = () => {
    setAmount((prev) => (parseInt(prev) + 1).toString());
  };

  const decrement = () => {
    setAmount((prev) => {
      const val = parseInt(prev);
      return val > 1 ? (val - 1).toString() : '1';
    });
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={() => router.back()}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Log Progress</Text>
          <Text style={styles.currentProgress}>
            Current: {habit.currentProgress} / {habit.goalValue}{' '}
            {habit.goalType === 'duration' ? 'min' : ''}
          </Text>

          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperButton} onPress={decrement} activeOpacity={0.7}>
              <MaterialCommunityIcons name="minus" size={32} color={AppColors.white} />
            </TouchableOpacity>

            <TextInput
              style={styles.stepperInput}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={4}
            />

            <TouchableOpacity style={styles.stepperButton} onPress={increment} activeOpacity={0.7}>
              <MaterialCommunityIcons name="plus" size={32} color={AppColors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.unit}>{habit.goalType === 'duration' ? 'minutes' : 'times'}</Text>

          <View style={styles.preview}>
            <Text style={styles.previewText}>
              This will add {amount} to your progress
            </Text>
            <Text style={styles.pointsPreview}>+5 points</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 8,
  },
  currentProgress: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 32,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperInput: {
    fontSize: 48,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    minWidth: 100,
  },
  unit: {
    fontSize: 16,
    color: AppColors.textLight,
    marginBottom: 32,
  },
  preview: {
    backgroundColor: AppColors.backgroundDark + '80',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  previewText: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 8,
  },
  pointsPreview: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceDark,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textLight,
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
});

