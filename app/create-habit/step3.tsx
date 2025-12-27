import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { AppColors } from '@/constants/colors';
import { Habit } from '@/types/habit';
import { useApp } from '@/contexts/app-context';
import { Button } from '@/components/button';

export default function CreateHabitStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addHabit } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now

  const handleCreate = () => {
    const habit: Habit = {
      id: uuidv4(),
      name: params.name as string,
      category: params.category as any,
      goalType: params.goalType as any,
      goalValue: parseInt(params.goalValue as string),
      currentProgress: 0,
      deadline: selectedDate.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      pointsEarned: 0,
      pointsLost: 0,
    };

    addHabit(habit);
    router.dismissAll();
    router.replace('/(tabs)');
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
        <Text style={styles.headerTitle}>STEP 3 OF 3</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>When is the deadline?</Text>
        <Text style={styles.subtitle}>Set a strict timeline to earn maximum points.</Text>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => adjustDate(-7)} activeOpacity={0.7}>
              <MaterialCommunityIcons name="chevron-left" size={32} color={AppColors.white} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => adjustDate(7)} activeOpacity={0.7}>
              <MaterialCommunityIcons name="chevron-right" size={32} color={AppColors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => adjustDate(-1)} style={styles.dateArrow}>
              <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textLight} />
            </TouchableOpacity>
            
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDay}>{selectedDate.getDate()}</Text>
              <Text style={styles.selectedDayName}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
            </View>
            
            <TouchableOpacity onPress={() => adjustDate(1)} style={styles.dateArrow}>
              <MaterialCommunityIcons name="chevron-right" size={24} color={AppColors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.deadlineDisplay}>
            <Text style={styles.deadlineLabel}>Selected deadline:</Text>
            <Text style={styles.deadlineDate}>{formatDate(selectedDate)}</Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={AppColors.amber} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Penalty Warning</Text>
            <Text style={styles.warningText}>
              Failing to complete by the deadline will result in a{' '}
              <Text style={styles.warningHighlight}>50 point penalty</Text>. Stay committed!
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Create Habit ✓" onPress={handleCreate} />
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
    letterSpacing: 1.5,
  },
  placeholder: {
    width: 48,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.surfaceDark,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 2,
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
  calendarContainer: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AppColors.cardDark + '40',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
  },
  dateArrow: {
    padding: 8,
  },
  selectedDateContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    fontSize: 48,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
  selectedDayName: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.backgroundDark,
    marginTop: 4,
  },
  deadlineDisplay: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.backgroundDark + '40',
  },
  deadlineLabel: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 4,
  },
  deadlineDate: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.amber + '15',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: AppColors.amber + '40',
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.amber,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 20,
  },
  warningHighlight: {
    color: AppColors.amber,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});

