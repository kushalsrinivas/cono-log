import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';

interface CelebrationModalProps {
  visible: boolean;
  habitName: string;
  pointsEarned: number;
  daysCompleted?: number;
  onRestart: () => void;
  onArchive: () => void;
}

export function CelebrationModal({
  visible,
  habitName,
  pointsEarned,
  daysCompleted = 30,
  onRestart,
  onArchive,
}: CelebrationModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons 
                name="check" 
                size={64} 
                color={AppColors.primary}
                style={{ fontWeight: '700' }}
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Goal Achieved!</Text>
            
            {/* Reward Badge */}
            <View style={styles.rewardContainer}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color={AppColors.primary} />
              <Text style={styles.rewardText}>+{pointsEarned} Bonus Points</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              You have successfully completed{'\n'}
              <Text style={styles.habitNameBold}>'{habitName}'</Text> for {daysCompleted} days.
            </Text>
          </View>

          {/* Status Chip */}
          <View style={styles.statusChip}>
            <MaterialCommunityIcons name="check-circle" size={16} color={AppColors.textMuted} />
            <Text style={styles.statusText}>COMPLETED</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={onRestart} activeOpacity={0.9}>
              <MaterialCommunityIcons name="replay" size={20} color={AppColors.backgroundDark} />
              <Text style={styles.primaryButtonText}>Restart Habit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onArchive} activeOpacity={0.9}>
              <MaterialCommunityIcons name="archive" size={20} color={AppColors.textMuted} />
              <Text style={styles.secondaryButtonText}>Archive Habit</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#16211a',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AppColors.primary + '10',
    borderWidth: 1,
    borderColor: AppColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -0.5,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  description: {
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  habitNameBold: {
    color: AppColors.white,
    fontWeight: '600',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textLight,
    letterSpacing: 2,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.white,
  },
});

