import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/app-context';

export default function PurchaseConfirmedScreen() {
  const router = useRouter();
  const { unlockPremium } = useApp();

  const handleViewLeaderboard = () => {
    unlockPremium();
    router.replace('/(tabs)/leaderboard');
  };

  const handleBackToHome = () => {
    unlockPremium();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient Background Glow */}
      <View style={styles.ambientGlow} />

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="lock-open-variant" size={64} color={AppColors.primary} />
            
            {/* Decorative Stars */}
            <View style={[styles.decorativeStar, styles.decorativeStarTop]}>
              <MaterialCommunityIcons name="star" size={20} color={AppColors.primary + 'CC'} />
            </View>
            <View style={[styles.decorativeStar, styles.decorativeStarBottom]}>
              <MaterialCommunityIcons name="star-four-points" size={16} color={AppColors.primary + '99'} />
            </View>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.title}>Leaderboard Unlocked</Text>

        {/* Body Text */}
        <Text style={styles.description}>
          Your purchase was successful. You can now compare your progress and compete for the top spot against your friends.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleViewLeaderboard}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>View Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleBackToHome}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Receipt sent to your Apple ID email.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  ambientGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: AppColors.primary + '10',
    transform: [
      { translateX: -150 },
      { translateY: -150 },
    ],
    opacity: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.backgroundDark,
    borderWidth: 2,
    borderColor: AppColors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  decorativeStar: {
    position: 'absolute',
  },
  decorativeStarTop: {
    top: -8,
    right: -8,
    transform: [{ rotate: '15deg' }],
  },
  decorativeStarBottom: {
    bottom: -4,
    left: -8,
    transform: [{ rotate: '-15deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
  },
  footerText: {
    fontSize: 12,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
});

