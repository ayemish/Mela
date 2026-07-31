import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getBrands, ApiError } from "@/lib/api";
import type { Brand } from "@/lib/types";
import { colors, fonts, spacing } from "@/constants/theme";

export default function BrandsScreen() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBrands();
      setBrands(res.brands.sort((a, b) => b.count - a.count));
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
        <Text style={styles.eyebrow}>EXPLORE</Text>
        <Text style={styles.heading}>Brands</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.gold} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => item.brand}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                router.push({ pathname: "/(tabs)/search", params: { brand: item.brand } })
              }
            >
              <View style={styles.rowLeft}>
                <Text style={styles.rank}>{String(index + 1).padStart(2, "0")}</Text>
                <Text style={styles.brandName}>{item.brand}</Text>
              </View>
              <View style={styles.rowRight}>
                <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
              </View>
            </Pressable>
          )}
        />
      )}
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
    paddingBottom: spacing.sm,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rank: {
    fontFamily: fonts.serif,
    fontStyle: "italic",
    fontSize: 13,
    color: colors.gold,
    width: 22,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  brandName: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  count: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: colors.inkMuted,
  },
  error: {
    fontFamily: fonts.sansRegular,
    color: colors.danger,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});