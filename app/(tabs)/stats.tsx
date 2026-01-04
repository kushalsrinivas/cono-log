import { AppColors } from "@/constants/colors";
import { useApp } from "@/contexts/app-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DayPerformance {
  date: string;
  completed: number;
  missed: number;
  total: number;
  completionRate: number;
}

export default function StatsScreen() {
  const { state } = useApp();
  const router = useRouter();

  // Calculate Last 7 Days Performance
  const last7DaysData = React.useMemo(() => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const performance: DayPerformance[] = days.map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateStr = date.toISOString().split("T")[0];

      const activity = state.dailyActivity.find((a) => a.date === dateStr);
      const completed = activity?.completedHabits.length || 0;
      const pointsLost = activity?.pointsLost || 0;
      const missed = pointsLost > 0 ? Math.ceil(pointsLost / 10) : 0; // Estimate from points
      const total = completed + missed;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      return { date: dateStr, completed, missed, total, completionRate };
    });

    const totalCompleted = performance.reduce((sum, p) => sum + p.completed, 0);
    const totalMissed = performance.reduce((sum, p) => sum + p.missed, 0);
    const avgCompletionRate =
      performance.reduce((sum, p) => sum + p.completionRate, 0) / 7;

    // Find best day
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const bestDayIndex = performance.reduce(
      (maxIdx, curr, idx, arr) =>
        curr.completionRate > arr[maxIdx].completionRate ? idx : maxIdx,
      0
    );
    const bestDay =
      dayNames[(new Date(today).getDay() - 6 + bestDayIndex + 7) % 7];

    return {
      days,
      performance,
      totalCompleted,
      totalMissed,
      avgCompletionRate,
      bestDay,
    };
  }, [state.dailyActivity]);

  // Streak Intelligence
  const streakData = React.useMemo(() => {
    const allHabits = state.habits;
    const activeStreaks = allHabits.filter((h) => h.currentStreak > 0);
    const brokenStreaks = allHabits.filter(
      (h) => h.status === "expired" && h.pointsLost > 0
    );

    // Calculate reliability
    const totalAttempts = state.completedHabitsCount + state.missedHabitsCount;
    const reliability =
      totalAttempts > 0
        ? Math.round((state.completedHabitsCount / totalAttempts) * 100)
        : 0;

    let reliabilityLabel = "Getting Started";
    if (reliability >= 90) reliabilityLabel = "Highly Reliable";
    else if (reliability >= 75) reliabilityLabel = "Very Consistent";
    else if (reliability >= 60) reliabilityLabel = "Building Momentum";
    else if (reliability >= 40) reliabilityLabel = "Needs Attention";
    else if (reliability >= 20) reliabilityLabel = "Unstable";

    return {
      activeStreaks: activeStreaks.length,
      brokenStreaks: brokenStreaks.length,
      reliability,
      reliabilityLabel,
      longestStreak: Math.max(...allHabits.map((h) => h.currentStreak), 0),
    };
  }, [state.habits, state.completedHabitsCount, state.missedHabitsCount]);

  // Habit Deep Dive - Strongest & Weakest
  const habitInsights = React.useMemo(() => {
    const allHabits = [...state.habits];

    // Calculate completion rate for each habit
    const habitsWithStats = allHabits.map((habit) => {
      const total = habit.pointsEarned / 10 + habit.pointsLost / 10; // Rough estimate
      const completed = habit.pointsEarned / 10;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      return {
        ...habit,
        completionRate,
        totalAttempts: Math.ceil(total),
      };
    });

    // Sort by completion rate and streak
    const strongest = [...habitsWithStats]
      .filter((h) => h.totalAttempts > 0)
      .sort((a, b) => {
        if (b.completionRate !== a.completionRate)
          return b.completionRate - a.completionRate;
        return b.currentStreak - a.currentStreak;
      })
      .slice(0, 3);

    const weakest = [...habitsWithStats]
      .filter((h) => h.totalAttempts > 0 && h.completionRate < 100)
      .sort((a, b) => {
        if (a.completionRate !== b.completionRate)
          return a.completionRate - b.completionRate;
        return a.currentStreak - b.currentStreak;
      })
      .slice(0, 3);

    return { strongest, weakest };
  }, [state.habits]);

  // Momentum Score
  const momentumData = React.useMemo(() => {
    const last3DaysActivity = state.dailyActivity
      .slice(-3)
      .reduce((sum, a) => sum + a.completedHabits.length, 0);
    const last7DaysActivity = state.dailyActivity
      .slice(-7)
      .reduce((sum, a) => sum + a.completedHabits.length, 0);

    const last3Avg = last3DaysActivity / 3;
    const last7Avg = last7DaysActivity / 7;

    const momentum = last3Avg - last7Avg;
    let trend: "improving" | "stable" | "declining" = "stable";
    if (momentum > 0.5) trend = "improving";
    else if (momentum < -0.5) trend = "declining";

    return { trend, momentum };
  }, [state.dailyActivity]);

  // Points Breakdown
  const pointsBreakdown = React.useMemo(() => {
    const totalEarned = state.dailyActivity.reduce(
      (sum, a) => sum + a.pointsEarned,
      0
    );
    const totalLost = state.dailyActivity.reduce(
      (sum, a) => sum + a.pointsLost,
      0
    );
    const streakBonus = state.habits.reduce(
      (sum, h) =>
        h.pointsEarned > h.currentStreak * 10
          ? h.pointsEarned - h.currentStreak * 10
          : 0,
      0
    );

    return {
      habitCompletions: totalEarned - streakBonus,
      streakBonuses: streakBonus,
      penalties: totalLost,
      net: totalEarned - totalLost,
    };
  }, [state.dailyActivity, state.habits]);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return AppColors.primary;
    if (rate >= 40) return AppColors.amber;
    return AppColors.red;
  };

  const getPerformanceEmoji = (rate: number) => {
    if (rate >= 80) return "🔥";
    if (rate >= 40) return "🙂";
    return "⚠️";
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Progress & Insights</Text>
        </View>

        {/* Hero Score */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroScore}>+{state.totalPoints}</Text>
          <Text style={styles.heroLabel}>TOTAL SCORE</Text>
        </View>

        {/* Momentum Card */}
        <View style={styles.momentumCard}>
          <View style={styles.momentumHeader}>
            <MaterialCommunityIcons
              name={
                momentumData.trend === "improving"
                  ? "trending-up"
                  : momentumData.trend === "declining"
                  ? "trending-down"
                  : "minus"
              }
              size={20}
              color={
                momentumData.trend === "improving"
                  ? AppColors.primary
                  : momentumData.trend === "declining"
                  ? AppColors.red
                  : AppColors.textMuted
              }
            />
            <Text style={styles.momentumTitle}>Momentum</Text>
            <View
              style={[
                styles.trendBadge,
                momentumData.trend === "improving" && styles.trendBadgeUp,
                momentumData.trend === "declining" && styles.trendBadgeDown,
              ]}
            >
              <Text style={styles.trendText}>
                {momentumData.trend === "improving"
                  ? "↑ Improving"
                  : momentumData.trend === "declining"
                  ? "↓ Declining"
                  : "→ Stable"}
              </Text>
            </View>
          </View>
          <Text style={styles.momentumText}>
            {state.currentStreak > 0
              ? `You're on a ${state.currentStreak} day streak! Keep it going.`
              : state.completedHabitsCount > 0
              ? `You've completed ${state.completedHabitsCount} habit${
                  state.completedHabitsCount > 1 ? "s" : ""
                }. Start a streak today!`
              : "Complete your first habit to start building momentum."}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardCompleted]}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={AppColors.primary}
              />
            </View>
            <Text style={styles.statValue}>{state.completedHabitsCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconMuted]}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={AppColors.textMuted}
              />
            </View>
            <Text style={[styles.statValue, styles.statValueMuted]}>
              {state.missedHabitsCount}
            </Text>
            <Text style={styles.statLabel}>Missed</Text>
          </View>
        </View>

        {/* Last 7 Days - Enhanced */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Last 7 Days Performance</Text>

          <View style={styles.weekSummaryCard}>
            <View style={styles.weekSummaryRow}>
              <View style={styles.weekStat}>
                <Text style={styles.weekStatValue}>
                  {last7DaysData.totalCompleted}
                </Text>
                <Text style={styles.weekStatLabel}>Completed</Text>
              </View>
              <View style={styles.weekStatDivider} />
              <View style={styles.weekStat}>
                <Text style={[styles.weekStatValue, styles.weekStatValueMuted]}>
                  {last7DaysData.totalMissed}
                </Text>
                <Text style={styles.weekStatLabel}>Missed</Text>
              </View>
              <View style={styles.weekStatDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekStatValue}>
                  {Math.round(last7DaysData.avgCompletionRate)}%
                </Text>
                <Text style={styles.weekStatLabel}>Avg Rate</Text>
              </View>
            </View>
          </View>

          <View style={styles.heatmap}>
            {last7DaysData.days.map((day, index) => {
              const perf = last7DaysData.performance[index];
              const isToday = index === last7DaysData.days.length - 1;
              const height =
                perf.completionRate > 0
                  ? Math.max(24, (perf.completionRate / 100) * 80)
                  : 12;
              const color = getPerformanceColor(perf.completionRate);

              return (
                <View key={index} style={styles.heatmapDay}>
                  <View
                    style={[
                      styles.heatmapBar,
                      { height, backgroundColor: color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.heatmapLabel,
                      isToday && styles.heatmapLabelToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              );
            })}
          </View>

          <View style={styles.insightBox}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={16}
              color={AppColors.primary}
            />
            <Text style={styles.insightText}>
              You're most consistent on {last7DaysData.bestDay}s.
            </Text>
          </View>
        </View>

        {/* Streak Intelligence */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Streak Intelligence</Text>

          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakStat}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={AppColors.orange}
                />
                <Text style={styles.streakNumber}>{state.currentStreak}</Text>
                <Text style={styles.streakLabel}>Current Streak</Text>
              </View>
              <View style={styles.streakStat}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={24}
                  color={AppColors.primary}
                />
                <Text style={styles.streakNumber}>
                  {streakData.longestStreak}
                </Text>
                <Text style={styles.streakLabel}>Longest Streak</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.reliabilityContainer}>
              <Text style={styles.reliabilityLabel}>Streak Reliability</Text>
              <View style={styles.reliabilityBar}>
                <View
                  style={[
                    styles.reliabilityFill,
                    { width: `${streakData.reliability}%` },
                  ]}
                />
              </View>
              <View style={styles.reliabilityStats}>
                <Text style={styles.reliabilityPercentage}>
                  {streakData.reliability}%
                </Text>
                <Text style={styles.reliabilityBadge}>
                  {streakData.reliabilityLabel}
                </Text>
              </View>
            </View>
          </View>

          {streakData.brokenStreaks > 0 && (
            <View style={styles.insightBox}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color={AppColors.orange}
              />
              <Text style={styles.insightText}>
                {streakData.brokenStreaks} streak
                {streakData.brokenStreaks > 1 ? "s" : ""} broken recently.
              </Text>
            </View>
          )}
        </View>

        {/* Habit Deep Dive */}
        {(habitInsights.strongest.length > 0 ||
          habitInsights.weakest.length > 0) && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Habit Performance</Text>

            {habitInsights.strongest.length > 0 && (
              <View style={styles.habitListCard}>
                <View style={styles.habitListHeader}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={18}
                    color={AppColors.primary}
                  />
                  <Text style={styles.habitListTitle}>Top Performers</Text>
                </View>
                {habitInsights.strongest.map((habit, idx) => (
                  <View key={habit.id} style={styles.habitItem}>
                    <View style={styles.habitRank}>
                      <Text style={styles.habitRankText}>#{idx + 1}</Text>
                    </View>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName} numberOfLines={1}>
                        {habit.name}
                      </Text>
                      <View style={styles.habitStats}>
                        <MaterialCommunityIcons
                          name="fire"
                          size={12}
                          color={AppColors.orange}
                        />
                        <Text style={styles.habitStatText}>
                          {habit.currentStreak} streak
                        </Text>
                        <Text style={styles.habitStatDivider}>•</Text>
                        <Text style={styles.habitStatText}>
                          {Math.round(habit.completionRate)}% rate
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {habitInsights.weakest.length > 0 && (
              <View style={styles.habitListCard}>
                <View style={styles.habitListHeader}>
                  <MaterialCommunityIcons
                    name="alert"
                    size={18}
                    color={AppColors.amber}
                  />
                  <Text style={styles.habitListTitle}>Needs Attention</Text>
                </View>
                {habitInsights.weakest.map((habit, idx) => (
                  <View key={habit.id} style={styles.habitItem}>
                    <View style={[styles.habitRank, styles.habitRankWarning]}>
                      <Text style={styles.habitRankText}>!</Text>
                    </View>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName} numberOfLines={1}>
                        {habit.name}
                      </Text>
                      <View style={styles.habitStats}>
                        <Text style={styles.habitStatText}>
                          {Math.round(habit.completionRate)}% rate
                        </Text>
                        <Text style={styles.habitStatDivider}>•</Text>
                        <Text style={styles.habitStatText}>
                          {habit.pointsLost}pts lost
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                <View style={styles.insightBox}>
                  <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    size={14}
                    color={AppColors.amber}
                  />
                  <Text style={[styles.insightText, { fontSize: 12 }]}>
                    Focus on consistency with these habits.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Points Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Points Breakdown</Text>

          <View style={styles.pointsCard}>
            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={AppColors.primary}
                />
                <Text style={styles.pointsLabel}>Completions</Text>
              </View>
              <Text style={styles.pointsValue}>
                +{pointsBreakdown.habitCompletions}
              </Text>
            </View>

            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color={AppColors.orange}
                />
                <Text style={styles.pointsLabel}>Streak Bonuses</Text>
              </View>
              <Text style={styles.pointsValue}>
                +{pointsBreakdown.streakBonuses}
              </Text>
            </View>

            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={AppColors.red}
                />
                <Text style={styles.pointsLabel}>Penalties</Text>
              </View>
              <Text style={[styles.pointsValue, styles.pointsValueNegative]}>
                -{pointsBreakdown.penalties}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <MaterialCommunityIcons
                  name="equal"
                  size={20}
                  color={AppColors.primary}
                />
                <Text style={[styles.pointsLabel, styles.pointsLabelTotal]}>
                  Net Total
                </Text>
              </View>
              <Text style={[styles.pointsValue, styles.pointsValueTotal]}>
                {pointsBreakdown.net}
              </Text>
            </View>
          </View>

          <View style={styles.insightBox}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={16}
              color={AppColors.primary}
            />
            <Text style={styles.insightText}>
              {state.completedHabitsCount > 0
                ? `You're earning ${Math.round(
                    pointsBreakdown.net / state.completedHabitsCount
                  )} pts per habit on average.`
                : "Complete habits to start earning points!"}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.white,
  },
  heroContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  heroScore: {
    fontSize: 64,
    fontWeight: "800",
    color: AppColors.primary,
    letterSpacing: -3,
    textShadowColor: AppColors.primary + "30",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: AppColors.textMuted,
    letterSpacing: 2,
    marginTop: 8,
  },
  momentumCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: AppColors.surfaceDark + "30",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b5443",
    padding: 16,
  },
  momentumHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  momentumTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.white,
    flex: 1,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: AppColors.textMuted + "20",
  },
  trendBadgeUp: {
    backgroundColor: AppColors.primary + "20",
  },
  trendBadgeDown: {
    backgroundColor: AppColors.red + "20",
  },
  trendText: {
    fontSize: 10,
    fontWeight: "700",
    color: AppColors.textMuted,
  },
  momentumText: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statCardCompleted: {
    borderColor: AppColors.primary + "30",
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  statIconMuted: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: AppColors.white,
    letterSpacing: -1,
  },
  statValueMuted: {
    color: AppColors.textLight,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.white,
    marginBottom: 16,
  },
  weekSummaryCard: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  weekSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weekStat: {
    flex: 1,
    alignItems: "center",
  },
  weekStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.white,
    marginBottom: 4,
  },
  weekStatValueMuted: {
    color: AppColors.textLight,
  },
  weekStatLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  weekStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  heatmap: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    height: 120,
    marginBottom: 12,
  },
  heatmapDay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    position: "relative",
    height: "100%",
  },
  heatmapBar: {
    width: "80%",
    borderRadius: 4,
    minHeight: 12,
  },
  heatmapLabel: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontFamily: "monospace",
    marginTop: 4,
  },
  heatmapLabelToday: {
    color: AppColors.white,
    fontWeight: "700",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    margin: -5,
    backgroundColor: AppColors.white,
    position: "absolute",
    bottom: 0,
  },
  insightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: AppColors.surfaceDark + "50",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary + "20",
  },
  insightText: {
    fontSize: 13,
    color: AppColors.textLight,
    flex: 1,
    lineHeight: 18,
  },
  streakCard: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  streakRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  streakStat: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.white,
  },
  streakLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  reliabilityContainer: {
    gap: 12,
  },
  reliabilityLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.textLight,
  },
  reliabilityBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  reliabilityFill: {
    height: "100%",
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  reliabilityStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reliabilityPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.white,
  },
  reliabilityBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.primary,
    backgroundColor: AppColors.primary + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  habitListCard: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  habitListHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  habitListTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.white,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  habitRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  habitRankWarning: {
    backgroundColor: AppColors.amber + "20",
  },
  habitRankText: {
    fontSize: 12,
    fontWeight: "700",
    color: AppColors.primary,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.white,
    marginBottom: 4,
  },
  habitStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  habitStatText: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  habitStatDivider: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginHorizontal: 4,
  },
  pointsCard: {
    backgroundColor: AppColors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pointsLabel: {
    fontSize: 14,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  pointsLabelTotal: {
    fontWeight: "700",
    color: AppColors.white,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.white,
    fontFamily: "monospace",
  },
  pointsValueNegative: {
    color: AppColors.red,
  },
  pointsValueTotal: {
    fontSize: 20,
    color: AppColors.primary,
  },
  bottomSpacer: {
    height: 20,
  },
});
