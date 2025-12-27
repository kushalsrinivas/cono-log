import { AppColors } from "@/constants/colors";
import { useApp } from "@/contexts/app-context";
import { clearAllData } from "@/lib/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { state, updatePenaltyIntensity, resetState } = useApp();
  const [isLight, setIsLight] = useState(state.penaltyIntensity === "light");

  const handleTogglePenalty = () => {
    const newIntensity = isLight ? "normal" : "light";
    setIsLight(!isLight);
    updatePenaltyIntensity(newIntensity);
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            resetState();
            router.replace("/onboarding/splash");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={AppColors.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="scale-balance"
                size={24}
                color={AppColors.primary}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Penalty Intensity</Text>
                <Text style={styles.settingDescription}>
                  {isLight ? "Light (-5 pts)" : "Normal (-10 pts)"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.toggle, isLight && styles.toggleActive]}
              onPress={handleTogglePenalty}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.toggleThumb,
                  isLight && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="delete-forever"
                size={24}
                color={AppColors.red}
              />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Reset All Data
                </Text>
                <Text style={styles.settingDescription}>
                  Clear all habits and progress
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={AppColors.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.aboutCard}>
            <MaterialCommunityIcons
              name="leaf"
              size={48}
              color={AppColors.primary}
            />
            <Text style={styles.appName}>Habbitica</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.tagline}>Made with care for focus</Text>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardDark,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.white,
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.white,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: AppColors.textLight,
  },
  dangerText: {
    color: AppColors.red,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.surfaceDark,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: AppColors.primary,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.white,
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  aboutCard: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.white,
    marginTop: 16,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    fontStyle: "italic",
    color: AppColors.textLight,
  },
});
