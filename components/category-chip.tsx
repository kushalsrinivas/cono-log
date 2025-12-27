import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { HabitCategory } from '@/types/habit';

interface CategoryChipProps {
  category: HabitCategory;
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ category, icon, label, selected, onPress }: CategoryChipProps) {
  const isCustom = category === 'Custom';

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
        isCustom && !selected && styles.customChip,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={selected ? AppColors.backgroundDark : AppColors.white}
      />
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.unselectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingLeft: 12,
    paddingRight: 16,
    borderRadius: 8,
  },
  selectedChip: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 4,
  },
  unselectedChip: {
    backgroundColor: AppColors.surfaceDark,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  customChip: {
    borderWidth: 1,
    borderColor: AppColors.textMuted,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: AppColors.backgroundDark,
  },
  unselectedLabel: {
    color: AppColors.white,
  },
});

