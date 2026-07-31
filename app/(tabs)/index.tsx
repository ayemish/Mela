import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { getNewArrivals, getBrands, searchArticles, ApiError } from "@/lib/api";
import type { Article, Brand } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import CategoryCard from "@/components/CategoryCard";
import StatsStrip from "@/components/StatsStrip";
import BrandMarquee from "@/components/BrandMarquee";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const CATEGORIES: {
  label: string;
  icon: "woman-outline" | "man-outline" | "footsteps-outline" | "diamond-outline";
  tint: "gold" | "ink";
}[] = [
  { label: "Women", icon: "woman-outline", tint: "gold" },
  { label: "Men", icon: "man-outline", tint: "ink" },
  { label: "Shoes", icon: "footsteps-outline", tint: "gold" },
  { label: "Jewelry", icon: "diamond-outline", tint: "ink" },
];

export default function HomeScreen() {
  const [newArrivals, setNewArrivals] = useState<Article[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [arrivalsRes, brandsRes, totalRes] = await Promise.allSettled([
        getNewArrivals(3, 6),
        getBrands(),
        searchArticles({ per_page: 1 }),
      ]);
      if (arrivalsRes.status === "fulfilled") setNewArrivals(arrivalsRes.value.hits);
      if (brandsRes.status === "fulfilled") {
        setBrands(brandsRes.value.brands.sort((a, b) => b.count - a.count).slice(0, 14));
      }
      if (totalRes.status === "fulfilled") setTotalProducts(totalRes.value.total);
    } catch (err) {
      // Home screen fails soft — the Search/New Arrivals tabs surface real errors.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = [
    { value: brands.length ? `${brands.length}+` : "—", label: "Brands" },
    {
      value: totalProducts !== null ? `${Math.floor(totalProducts / 100) / 10}k+` : "—",
      label: "Products",
    },
    { value: "Daily", label: "Updates" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero — echoes the web app's reveal-hero section, in a static mobile-friendly form */}
        <View style={styles.hero}>
          <Animated.Text entering={FadeInDown.delay(50).duration(500)} style={styles.eyebrow}>
            PAKISTANI FASHION, CURATED
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(150).duration(500)} style={styles.heroTitle}>
            Mela
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(250).duration(500)} style={styles.heroSubtitle}>
            Search Khaadi, Sapphire, Sana Safinaz, and every brand that defines modern
            South Asian style — all in one place.
          </Animated.Text>
          <Animated.View entering={FadeInUp.delay(350).duration(500)}>
            <Pressable style={styles.cta} onPress={() => router.push("/(tabs)/search")}>
              <Text style={styles.ctaText}>Start Searching</Text>
            </Pressable>
          </Animated.View>
        </View>

        <StatsStrip stats={stats} />

        <View style={styles.divider} />

        <SectionHeader label="Just In" title="New this week" />
        {loading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: spacing.md }} />
        ) : (
          <View style={styles.grid}>
            {newArrivals.map((article, i) => (
              <ProductCard key={article.id} article={article} index={i} />
            ))}
          </View>
        )}

        <Pressable onPress={() => router.push("/(tabs)/new-arrivals")} style={styles.linkRow}>
          <Text style={styles.link}>See all new arrivals</Text>
          <Text style={styles.linkArrow}>→</Text>
        </Pressable>

        <View style={styles.divider} />

        <SectionHeader label="Shop" title="By category" />
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.label}
              label={cat.label}
              icon={cat.icon}
              tint={cat.tint}
              index={i}
              onPress={() => router.push({ pathname: "/(tabs)/search", params: { category: cat.label } })}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <SectionHeader label="Explore" title="Shop by brand" />
        <BrandMarquee brands={brands} />
        <Pressable style={[styles.secondaryCta, { marginTop: spacing.md }]} onPress={() => router.push("/(tabs)/brands")}>
          <Text style={styles.secondaryCtaText}>Browse all brands</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 48,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontFamily: fonts.sansRegular,
    fontSize: 14.5,
    color: colors.inkMuted,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: {
    fontFamily: fonts.sansSemiBold,
    color: "#fff",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -spacing.sm,
  },
  link: {
    fontFamily: fonts.sansMedium,
    color: colors.gold,
    fontSize: 13.5,
  },
  linkArrow: {
    color: colors.gold,
    fontSize: 13.5,
  },
  secondaryCta: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryCtaText: {
    fontFamily: fonts.sansMedium,
    color: colors.gold,
    fontSize: 14,
  },
});