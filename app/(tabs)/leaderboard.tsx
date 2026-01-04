import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { useApp } from '@/contexts/app-context';
import { LeaderboardEntry } from '@/types/habit';
import { UnlockPaywallModal } from '@/components/unlock-paywall-modal';

// Mock data for preview
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Sarah M.', points: 1240, rank: 1, streak: 45, isFriend: false },
  { id: '2', name: 'John D.', points: 1180, rank: 2, streak: 38, isFriend: true },
  { id: '3', name: 'Emma W.', points: 1095, rank: 3, streak: 32, isFriend: false },
  { id: '4', name: 'You', points: 450, rank: 12, streak: 15, isFriend: false },
  { id: '5', name: 'Mike R.', points: 420, rank: 13, streak: 12, isFriend: true },
];

export default function LeaderboardScreen() {
  const { state } = useApp();
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends'>('global');

  const isPremium = state.isPremium;

  const handleUnlockPress = () => {
    setShowPaywall(true);
  };

  if (!isPremium) {
    // Locked Preview State
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>COMING SOON</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Lock Icon and Message */}
          <View style={styles.lockSection}>
            <View style={styles.lockIconContainer}>
              <MaterialCommunityIcons name="lock" size={48} color={AppColors.primary} />
            </View>
            <Text style={styles.lockTitle}>Premium Feature</Text>
            <Text style={styles.lockDescription}>
              Compete with friends and see where you rank globally. Unlock leaderboards to prove your consistency.
            </Text>
          </View>

          {/* Preview of Rankings (Blurred) */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview Rankings</Text>
            
            <View style={styles.blurredContainer}>
              {MOCK_LEADERBOARD.slice(0, 5).map((entry, index) => (
                <View key={entry.id} style={styles.leaderboardRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{entry.rank}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <MaterialCommunityIcons 
                        name={entry.name === 'You' ? 'account' : 'account-outline'} 
                        size={20} 
                        color={AppColors.white} 
                      />
                    </View>
                    <Text style={[styles.userName, entry.name === 'You' && styles.userNameYou]}>
                      {entry.name}
                    </Text>
                  </View>
                  <View style={styles.stats}>
                    <MaterialCommunityIcons name="fire" size={16} color={AppColors.orange} />
                    <Text style={styles.statText}>{entry.streak}</Text>
                  </View>
                  <Text style={styles.points}>{entry.points} pts</Text>
                </View>
              ))}
              
              {/* Blur Overlay */}
              <View style={styles.blurOverlay}>
                <MaterialCommunityIcons name="lock-outline" size={32} color={AppColors.primary} />
                <Text style={styles.blurText}>Unlock to see full rankings</Text>
              </View>
            </View>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="earth" size={24} color={AppColors.primary} />
              <Text style={styles.featureText}>Global Rankings</Text>
            </View>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="account-group" size={24} color={AppColors.primary} />
              <Text style={styles.featureText}>Friend Leagues</Text>
            </View>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="chart-line" size={24} color={AppColors.primary} />
              <Text style={styles.featureText}>Historical Stats</Text>
            </View>
          </View>
        </ScrollView>

        {/* Unlock Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlockPress} activeOpacity={0.9}>
            <MaterialCommunityIcons name="lock-open-variant" size={20} color={AppColors.backgroundDark} />
            <Text style={styles.unlockButtonText}>Unlock Leaderboard</Text>
          </TouchableOpacity>
        </View>

        <UnlockPaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
      </SafeAreaView>
    );
  }

  // Premium User - Full Leaderboard
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'global' && styles.tabActive]}
          onPress={() => setSelectedTab('global')}
        >
          <MaterialCommunityIcons 
            name="earth" 
            size={20} 
            color={selectedTab === 'global' ? AppColors.primary : AppColors.textMuted} 
          />
          <Text style={[styles.tabText, selectedTab === 'global' && styles.tabTextActive]}>
            Global
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'friends' && styles.tabActive]}
          onPress={() => setSelectedTab('friends')}
        >
          <MaterialCommunityIcons 
            name="account-group" 
            size={20} 
            color={selectedTab === 'friends' ? AppColors.primary : AppColors.textMuted} 
          />
          <Text style={[styles.tabText, selectedTab === 'friends' && styles.tabTextActive]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User's Current Rank Card */}
        <View style={styles.yourRankCard}>
          <Text style={styles.yourRankLabel}>Your Rank</Text>
          <View style={styles.yourRankContent}>
            <View style={styles.rankBadgeLarge}>
              <Text style={styles.rankTextLarge}>#12</Text>
            </View>
            <View style={styles.yourRankStats}>
              <Text style={styles.yourRankPoints}>{state.totalPoints} pts</Text>
              <View style={styles.streakContainer}>
                <MaterialCommunityIcons name="fire" size={16} color={AppColors.orange} />
                <Text style={styles.yourRankStreak}>{state.currentStreak} day streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardList}>
          {MOCK_LEADERBOARD.map((entry, index) => (
            <View key={entry.id} style={[
              styles.leaderboardRow,
              entry.name === 'You' && styles.leaderboardRowHighlight,
            ]}>
              <View style={[
                styles.rankBadge,
                entry.rank <= 3 && styles.rankBadgeTop,
              ]}>
                <Text style={[
                  styles.rankText,
                  entry.rank <= 3 && styles.rankTextTop,
                ]}>
                  #{entry.rank}
                </Text>
              </View>
              
              <View style={styles.userInfo}>
                <View style={[
                  styles.avatarPlaceholder,
                  entry.name === 'You' && styles.avatarPlaceholderYou,
                ]}>
                  <MaterialCommunityIcons 
                    name={entry.name === 'You' ? 'account' : 'account-outline'} 
                    size={20} 
                    color={AppColors.white} 
                  />
                </View>
                <View>
                  <Text style={[styles.userName, entry.name === 'You' && styles.userNameYou]}>
                    {entry.name}
                  </Text>
                  {entry.isFriend && (
                    <Text style={styles.friendBadge}>Friend</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.stats}>
                <MaterialCommunityIcons name="fire" size={16} color={AppColors.orange} />
                <Text style={styles.statText}>{entry.streak}</Text>
              </View>
              
              <Text style={styles.points}>{entry.points} pts</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
  },
  comingSoonBadge: {
    backgroundColor: AppColors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.primary + '40',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 1.2,
  },
  scrollContent: {
    padding: 24,
  },
  lockSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lockIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AppColors.primary + '10',
    borderWidth: 2,
    borderColor: AppColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 12,
  },
  lockDescription: {
    fontSize: 16,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  previewSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    marginBottom: 16,
  },
  blurredContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.backgroundDark + 'E6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  blurText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  featuresSection: {
    gap: 16,
    marginTop: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: AppColors.surfaceDark,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.white,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  unlockButton: {
    width: '100%',
    height: 56,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  unlockButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: AppColors.surfaceDark,
  },
  tabActive: {
    backgroundColor: AppColors.primary + '20',
    borderWidth: 1,
    borderColor: AppColors.primary + '40',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  tabTextActive: {
    color: AppColors.primary,
  },
  yourRankCard: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AppColors.primary + '30',
  },
  yourRankLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  yourRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rankBadgeLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankTextLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.backgroundDark,
  },
  yourRankStats: {
    gap: 4,
  },
  yourRankPoints: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.white,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yourRankStreak: {
    fontSize: 14,
    color: AppColors.textMuted,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceDark,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  leaderboardRowHighlight: {
    borderColor: AppColors.primary + '40',
    backgroundColor: AppColors.primary + '10',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankBadgeTop: {
    backgroundColor: AppColors.primary + '20',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textLight,
  },
  rankTextTop: {
    color: AppColors.primary,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderYou: {
    backgroundColor: AppColors.primary + '30',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.white,
  },
  userNameYou: {
    fontWeight: '700',
    color: AppColors.primary,
  },
  friendBadge: {
    fontSize: 10,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textLight,
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
    minWidth: 60,
    textAlign: 'right',
  },
});

