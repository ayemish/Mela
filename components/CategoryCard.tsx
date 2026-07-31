import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: "gold" | "ink";
  index: number;
  onPress: () => void;
}

/** Big tappable tile used on the Home screen's category grid — an icon on a
 *  soft tinted background, in the same gold/ink palette as the rest of the
 *  app (no external images, so it stays crisp on every device for free). */
export default function CategoryCard({ label, icon, tint, index, onPress }: Props) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isGold = tint === "gold";

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 90).duration(400).springify().damping(16)}
      style={[
        styles.card,
        { backgroundColor: isGold ? "rgba(201,169,110,0.14)" : "rgba(26,26,26,0.055)" },
        pressStyle,
      ]}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: isGold ? colors.gold : colors.ink },
        ]}
      >
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
});