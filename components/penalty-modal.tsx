import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { Button } from '@/components/button';

interface PenaltyModalProps {
  visible: boolean;
  habitName: string;
  pointsLost: number;
  onTryAgain: () => void;
  onArchive: () => void;
}

export function PenaltyModal({
  visible,
  habitName,
  pointsLost,
  onTryAgain,
  onArchive,
}: PenaltyModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="alert-circle" size={80} color={AppColors.amber} />
          </View>

          <Text style={styles.title}>Goal missed</Text>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>{pointsLost} points</Text>
          </View>

          <Text style={styles.habitName}>{habitName}</Text>
          
          <Text style={styles.message}>
            No worries. Progress isn't always linear.
          </Text>

          <View style={styles.actions}>
            <Button title="Try again" onPress={onTryAgain} />
            <TouchableOpacity style={styles.archiveButton} onPress={onArchive}>
              <Text style={styles.archiveText}>Archive</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 16,
  },
  pointsContainer: {
    backgroundColor: AppColors.red + '20',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  points: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.red,
  },
  habitName: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  archiveButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textLight,
  },
});

