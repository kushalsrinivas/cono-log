import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';

interface DeadlineCountdownProps {
  hoursRemaining: number;
  isUrgent?: boolean; // less than 12 hours
}

export function DeadlineCountdown({ hoursRemaining, isUrgent = false }: DeadlineCountdownProps) {
  const formatTime = () => {
    if (hoursRemaining < 1) {
      return 'Less than 1 hour';
    } else if (hoursRemaining < 24) {
      return `${Math.floor(hoursRemaining)} hrs left`;
    } else {
      const days = Math.floor(hoursRemaining / 24);
      return `${days} day${days > 1 ? 's' : ''} left`;
    }
  };

  return (
    <View style={[styles.badge, isUrgent && styles.urgentBadge]}>
      <Text style={[styles.text, isUrgent && styles.urgentText]}>{formatTime()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: AppColors.surfaceDark,
  },
  urgentBadge: {
    backgroundColor: AppColors.primary,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: AppColors.textLight,
  },
  urgentText: {
    color: AppColors.backgroundDark,
  },
});

