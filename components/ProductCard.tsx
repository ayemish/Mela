import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { Article } from "@/lib/types";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductCard({ article, index = 0 }: { article: Article; index?: number }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - spacing.md * 2 - spacing.md) / 2; // 2-col grid, gutters match content padding
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(Math.min(index, 8) * 60)
        .duration(400)
        .springify()
        .damping(16)}
      style={[styles.card, { width: cardWidth }, pressStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={() => Linking.openURL(article.url)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: article.image_url ?? undefined }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {!article.in_stock && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Out of stock</Text>
          </View>
        )}
      </View>
      <Text style={styles.brand} numberOfLines={1}>
        {article.brand}
      </Text>
      <Text style={styles.name} numberOfLines={2}>
        {article.name}
      </Text>
      <Text style={styles.price}>
        {article.currency} {article.price.toLocaleString()}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  imageWrap: {
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
    // Soft elevation echoing the web app's .card-3d hover shadow, applied
    // statically since mobile has no hover state.
    ...Platform.select({
      ios: {
        shadowColor: "#1A1A1A",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    bottom: spacing.xs,
    left: spacing.xs,
    backgroundColor: "rgba(26,26,26,0.72)",
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.3,
  },
  brand: {
    fontFamily: fonts.sansMedium,
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.gold,
  },
  name: {
    fontFamily: fonts.sansRegular,
    fontSize: 13.5,
    color: colors.ink,
    marginTop: 3,
    lineHeight: 18,
  },
  price: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 5,
    letterSpacing: 0.2,
  },
});