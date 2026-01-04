import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';

interface PenaltyModalProps {
  visible: boolean;
  habitName: string;
  pointsLost: number;
  onTryAgain: () => void;
  onArchive: () => void;
  onClose?: () => void;
}

export function PenaltyModal({
  visible,
  habitName,
  pointsLost,
  onTryAgain,
  onArchive,
  onClose,
}: PenaltyModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onClose}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Status Update</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Hero Icon */}
          <View style={styles.heroIconContainer}>
            <View style={styles.iconGlow} />
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons 
                name="timer-sand" 
                size={48} 
                color={AppColors.orange}
              />
            </View>
          </View>

          {/* Headline & Description */}
          <View style={styles.textContent}>
            <Text style={styles.title}>Deadline Missed</Text>
            <Text style={styles.description}>
              You didn't mark <Text style={styles.habitNameBold}>{habitName}</Text> as complete in time.
            </Text>
          </View>

          {/* Status & Points */}
          <View style={styles.statusContainer}>
            {/* Status Chip */}
            <View style={styles.statusChip}>
              <MaterialCommunityIcons name="history" size={20} color={AppColors.textMuted} />
              <Text style={styles.statusText}>STATUS: EXPIRED</Text>
            </View>

            {/* Points Chip */}
            <View style={styles.pointsChip}>
              <MaterialCommunityIcons name="alert" size={20} color="#f97316" />
              <Text style={styles.pointsText}>−{pointsLost} Points</Text>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={onTryAgain}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="restart" size={20} color={AppColors.backgroundDark} />
            <Text style={styles.primaryButtonText}>Restart with new deadline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onArchive} activeOpacity={0.9}>
            <MaterialCommunityIcons name="archive" size={18} color={AppColors.textMuted} />
            <Text style={styles.secondaryButtonText}>Archive this habit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -0.3,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  heroIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.orange,
    opacity: 0.15,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AppColors.surfaceDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContent: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  habitNameBold: {
    color: AppColors.white,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 16,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: AppColors.surfaceDark + '80',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textMuted,
    letterSpacing: 2,
  },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.white,
    fontFamily: 'monospace',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.backgroundDark,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textMuted,
    letterSpacing: 0.3,
  },
});

