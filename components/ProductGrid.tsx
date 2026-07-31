import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import ProductCard from "./ProductCard";
import type { Article } from "@/lib/types";
import { colors, fonts, spacing } from "@/constants/theme";

interface Props {
  articles: Article[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  onEndReached: () => void;
  onRefresh: () => void;
  emptyLabel?: string;
  ListHeaderComponent?: React.ComponentProps<typeof FlatList>["ListHeaderComponent"];
}

export default function ProductGrid({
  articles,
  loading,
  loadingMore,
  error,
  onEndReached,
  onRefresh,
  emptyLabel = "No products found — try adjusting your filters.",
  ListHeaderComponent,
}: Props) {
  if (loading && articles.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard article={item} />}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        <RefreshControl
          refreshing={loading && articles.length > 0}
          onRefresh={onRefresh}
          tintColor={colors.gold}
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={{ marginVertical: spacing.lg }} color={colors.gold} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: "space-between",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  errorText: {
    fontFamily: fonts.sansRegular,
    color: colors.danger,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: fonts.sansRegular,
    color: colors.inkMuted,
    textAlign: "center",
  },
});