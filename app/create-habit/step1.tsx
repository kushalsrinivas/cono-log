import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import { HabitCategory } from '@/types/habit';
import { Input } from '@/components/input';
import { CategoryChip } from '@/components/category-chip';
import { Button } from '@/components/button';

export default function CreateHabitStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    // Store in route params
    router.push({
      pathname: '/create-habit/step2',
      params: { name: name.trim(), category },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="close" size={24} color={AppColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Habit</Text>
        <Text style={styles.stepIndicator}>Step 1 of 3</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '33%' }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Input
            label="What do you want to achieve?"
            placeholder="e.g., Read 10 pages"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            error={error}
            autoFocus
          />
          <View style={styles.helperRow}>
            <MaterialCommunityIcons name="auto-fix" size={16} color={AppColors.primary} />
            <Text style={styles.helperText}>Small steps earn big points.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipsContainer}>
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat.id}
                icon={cat.icon}
                label={cat.label}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

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
    paddingBottom: 8,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
    width: 80,
    textAlign: 'right',
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
  },
  section: {
    marginTop: 32,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  helperText: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});

