import { ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Brand } from "@/lib/types";
import { colors, fonts, radius, spacing } from "@/constants/theme";

/** Horizontally scrolling row of real brand names pulled live from the API —
 *  gives Home some "this is a real, stocked catalog" texture instead of a
 *  static hero. Tapping a pill jumps straight to that brand's results. */
export default function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <Animated.View entering={FadeIn.delay(500).duration(400)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {brands.map((b) => (
          <Pressable
            key={b.brand}
            style={styles.pill}
            onPress={() =>
              router.push({ pathname: "/(tabs)/search", params: { brand: b.brand } })
            }
          >
            <Text style={styles.pillText}>{b.brand}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  pillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.gold,
  },
});