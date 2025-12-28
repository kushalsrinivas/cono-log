import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { PricingOption } from '@/types/habit';
import { useRouter } from 'expo-router';

interface UnlockPaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function UnlockPaywallModal({ visible, onClose }: UnlockPaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingOption>('lifetime');
  const router = useRouter();

  const handleGetAccess = () => {
    // Navigate to purchase confirmation
    onClose();
    router.push('/purchase-confirmed');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color={AppColors.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Image - Neon Trophy */}
          <View style={styles.heroContainer}>
            <View style={styles.neonTrophyContainer}>
              <View style={styles.neonGlow} />
              <MaterialCommunityIcons name="trophy" size={120} color={AppColors.primary} />
            </View>
          </View>

          {/* Headline & Description */}
          <View style={styles.textContent}>
            <Text style={styles.title}>Join the Elite</Text>
            <Text style={styles.description}>
              Prove your consistency. Compare your scores with friends and the world.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="earth" size={24} color={AppColors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Global Rankings</Text>
                <Text style={styles.featureSubtitle}>Compare with the world</Text>
              </View>
              <MaterialCommunityIcons name="check" size={20} color={AppColors.primary} />
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="account-group" size={24} color={AppColors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Friend Leagues</Text>
                <Text style={styles.featureSubtitle}>Compete with friends</Text>
              </View>
              <MaterialCommunityIcons name="check" size={20} color={AppColors.primary} />
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="chart-line" size={24} color={AppColors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Historical Stats</Text>
                <Text style={styles.featureSubtitle}>Detailed point history</Text>
              </View>
              <MaterialCommunityIcons name="check" size={20} color={AppColors.primary} />
            </View>
          </View>

          {/* Pricing Options */}
          <View style={styles.pricingContainer}>
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedPlan === 'annual' && styles.pricingCardSelected,
              ]}
              onPress={() => setSelectedPlan('annual')}
              activeOpacity={0.8}
            >
              <Text style={styles.planLabel}>Annual</Text>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>per year</Text>
            </TouchableOpacity>

            <View style={styles.pricingCardWrapper}>
              {selectedPlan === 'lifetime' && (
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>BEST VALUE</Text>
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.pricingCard,
                  selectedPlan === 'lifetime' && styles.pricingCardSelected,
                ]}
                onPress={() => setSelectedPlan('lifetime')}
                activeOpacity={0.8}
              >
                <Text style={styles.planLabel}>Lifetime</Text>
                <Text style={styles.planPrice}>$19.99</Text>
                <Text style={styles.planPeriod}>one-time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.getAccessButton} 
            onPress={handleGetAccess}
            activeOpacity={0.9}
          >
            <Text style={styles.getAccessText}>Get Access</Text>
          </TouchableOpacity>

          <View style={styles.legalFooter}>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  neonTrophyContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neonGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: AppColors.primary,
    opacity: 0.15,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  featuresList: {
    gap: 12,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceDark + '80',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
  },
  featureSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  pricingCardWrapper: {
    flex: 1,
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bestValueText: {
    backgroundColor: AppColors.primary,
    color: AppColors.backgroundDark,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    letterSpacing: 1,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pricingCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '08',
  },
  planLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 2,
  },
  planPeriod: {
    fontSize: 10,
    color: AppColors.textMuted,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  getAccessButton: {
    width: '100%',
    height: 56,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  getAccessText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
  legalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontSize: 10,
    color: AppColors.textMuted,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 10,
    color: AppColors.textMuted,
  },
});

