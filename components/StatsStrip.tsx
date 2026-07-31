import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors, fonts, radius, spacing } from "@/constants/theme";

interface Stat {
  value: string;
  label: string;
}

/** Small trust strip under the hero — real numbers pulled from the API
 *  (brand count, product count), not hardcoded copy. Falls back to a "—"
 *  placeholder per stat while its number is still loading. */
export default function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <Animated.View entering={FadeIn.delay(450).duration(400)} style={styles.row}>
      {stats.map((stat, i) => (
        <View key={stat.label} style={styles.item}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
          {i < stats.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  value: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 10.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.inkMuted,
    marginTop: 2,
  },
  divider: {
    position: "absolute",
    right: 0,
    top: "15%",
    height: "70%",
    width: 1,
    backgroundColor: colors.border,
  },
});