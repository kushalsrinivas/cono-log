import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding/value-prop');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.content}>
        <Text style={styles.title}>Focus</Text>
        <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />
      </View>
      <Text style={styles.subtitle}>OFFLINE MODE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    backgroundColor: AppColors.primary,
    opacity: 0.05,
    borderRadius: 250,
    filter: 'blur(100px)',
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: -1,
  },
  loader: {
    marginTop: 16,
  },
  subtitle: {
    position: 'absolute',
    bottom: 48,
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textLight,
    opacity: 0.6,
    letterSpacing: 3,
  },
});

