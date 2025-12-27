import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { Button } from '@/components/button';

export default function PointsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="star" size={64} color={AppColors.primary} />
          </View>
        </View>

        <Text style={styles.title}>How Scoring Works</Text>
        <Text style={styles.subtitle}>Build streaks to earn points. Keep the momentum going.</Text>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconSuccess]}>
              <MaterialCommunityIcons name="check-circle" size={32} color={AppColors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Completing habits</Text>
              <Text style={styles.cardSubtitle}>Standard progress</Text>
            </View>
            <Text style={styles.cardPoints}>+10 pts</Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconSuccess]}>
              <MaterialCommunityIcons name="lightning-bolt" size={32} color={AppColors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Finishing before noon</Text>
              <Text style={styles.cardSubtitle}>Early bird bonus</Text>
            </View>
            <Text style={styles.cardPoints}>+5 bonus</Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconWarning]}>
              <MaterialCommunityIcons name="alert-circle" size={32} color={AppColors.red + 'CC'} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Missing a deadline</Text>
              <Text style={styles.cardSubtitle}>Break the chain</Text>
            </View>
            <Text style={styles.cardPointsNegative}>-2 pts</Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <MaterialCommunityIcons name="information" size={16} color={AppColors.textLight} />
          <Text style={styles.disclaimerText}>Don't worry, penalties are tiny.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Got it" onPress={() => router.push('/onboarding/privacy')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.primary + '20',
    borderWidth: 2,
    borderColor: AppColors.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconSuccess: {
    backgroundColor: AppColors.primary + '20',
  },
  cardIconWarning: {
    backgroundColor: AppColors.red + '20',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: AppColors.textLight,
  },
  cardPoints: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.primary,
  },
  cardPointsNegative: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.red + 'CC',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  disclaimerText: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});

