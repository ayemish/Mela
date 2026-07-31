import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import ProductGrid from "@/components/ProductGrid";
import { getNewArrivals, ApiError } from "@/lib/api";
import type { Article } from "@/lib/types";
import { colors, fonts, spacing } from "@/constants/theme";

export default function NewArrivalsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNewArrivals(7, 48);
      setArticles(res.hits);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>JUST IN</Text>
        <Text style={styles.heading}>What's New</Text>
      </View>
      <ProductGrid
        articles={articles}
        loading={loading}
        loadingMore={false}
        error={error}
        onEndReached={() => {}}
        onRefresh={load}
        emptyLabel="Nothing new in the last week — check back soon."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.gold,
    marginBottom: 2,
  },
  heading: {
    fontFamily: fonts.serif,
    fontStyle: "italic",
    fontSize: 26,
    color: colors.ink,
  },
  subheading: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
    paddingBottom: spacing.xs,
  },
});