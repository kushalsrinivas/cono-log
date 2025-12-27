import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';

interface PointsBadgeProps {
  points: number;
  size?: 'small' | 'large';
}

export function PointsBadge({ points, size = 'large' }: PointsBadgeProps) {
  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      <Text style={[styles.points, isLarge && styles.pointsLarge]}>{points.toLocaleString()}</Text>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons
          name="star"
          size={isLarge ? 18 : 14}
          color={AppColors.primary}
        />
        <Text style={[styles.label, isLarge && styles.labelLarge]}>
          {isLarge ? 'TOTAL PTS' : 'POINTS'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.white,
    letterSpacing: -1,
  },
  pointsLarge: {
    fontSize: 48,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  labelLarge: {
    fontSize: 12,
  },
});

