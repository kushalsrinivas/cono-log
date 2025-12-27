import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { Button } from '@/components/button';
import { saveOnboardingComplete } from '@/lib/storage';

export default function PrivacyScreen() {
  const router = useRouter();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleContinue = async () => {
    await saveOnboardingComplete(dontShowAgain);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="shield-lock" size={64} color={AppColors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Total Privacy.</Text>
        <Text style={styles.subtitle}>
          We built this app to track habits, not you. Your data is yours.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="check-circle" size={24} color={AppColors.primary} />
            <Text style={styles.featureText}>All data stays on this device</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="account-off" size={24} color={AppColors.primary} />
            <Text style={styles.featureText}>No account required</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="cloud-off-outline" size={24} color={AppColors.primary} />
            <Text style={styles.featureText}>No cloud uploads</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="minus-circle" size={24} color={AppColors.primary} />
            <Text style={styles.featureText}>No third-party tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setDontShowAgain(!dontShowAgain)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkboxBox, dontShowAgain && styles.checkboxBoxChecked]}>
            {dontShowAgain && (
              <MaterialCommunityIcons name="check" size={16} color={AppColors.backgroundDark} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Don't show this again</Text>
        </TouchableOpacity>
        <Button title="Start Tracking" onPress={handleContinue} />
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
    marginBottom: 48,
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 17,
    color: AppColors.white,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: AppColors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    color: AppColors.textLight,
  },
});

