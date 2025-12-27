import { Button } from "@/components/button";
import { AppColors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ValuePropScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="atom"
              size={64}
              color={AppColors.primary}
            />
          </View>
        </View>

        <Text style={styles.title}>Build habits.</Text>

        <View style={styles.rulesContainer}>
          <View style={styles.rule}>
            <Text style={styles.ruleText}>Miss goals → </Text>
            <Text style={[styles.ruleText, styles.ruleNegative]}>
              lose points.
            </Text>
          </View>
          <View style={styles.rule}>
            <Text style={styles.ruleText}>Make progress → </Text>
            <Text style={[styles.ruleText, styles.rulePositive]}>
              gain points.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Offline-only. Your data stays on your device.
        </Text>
        <Button
          title="Continue"
          onPress={() => router.push("/onboarding/points")}
        />
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 48,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: AppColors.primary + "40",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: AppColors.white,
    marginBottom: 32,
  },
  rulesContainer: {
    gap: 16,
  },
  rule: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ruleText: {
    fontSize: 18,
    color: AppColors.white,
  },
  ruleNegative: {
    color: AppColors.red,
    fontWeight: "600",
  },
  rulePositive: {
    color: AppColors.primary,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: AppColors.textLight,
  },
});
