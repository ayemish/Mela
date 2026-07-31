import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SearchBar from "@/components/SearchBar";
import FilterSheet from "@/components/FilterSheet";
import ProductGrid from "@/components/ProductGrid";
import { usePaginatedSearch } from "@/lib/usePaginatedSearch";
import { EMPTY_FILTERS, type Filters } from "@/lib/types";
import { colors, fonts, spacing } from "@/constants/theme";

export default function SearchScreen() {
  const { brand: brandParam, category: categoryParam } = useLocalSearchParams<{
    brand?: string;
    category?: string;
  }>();
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState(""); // committed query (on submit)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Arriving from the Brands tab with a preset brand filter.
  useEffect(() => {
    if (brandParam) {
      setFilters((prev) => ({ ...prev, brand: [brandParam] }));
    }
  }, [brandParam]);

  // Arriving from the Home tab's category chips with a preset category filter.
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: [categoryParam] }));
    }
  }, [categoryParam]);

  const sort = query ? undefined : "first_seen_at:desc"; // relevance-ranked once there's a real query
  const { articles, facets, total, loading, loadingMore, error, refresh, loadMore } =
    usePaginatedSearch(query, filters, sort ?? "first_seen_at:desc");

  const activeFilterCount =
    filters.brand.length +
    filters.category.length +
    (filters.in_stock ? 1 : 0) +
    (filters.price_min !== null ? 1 : 0) +
    (filters.price_max !== null ? 1 : 0);

  const brandFacets = useMemo(() => facets["brand"] ?? [], [facets]);
  const categoryFacets = useMemo(() => facets["category"] ?? [], [facets]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text style={styles.heading}>Search</Text>
      </View>
      <SearchBar
        value={inputValue}
        onChangeText={setInputValue}
        onSubmit={() => setQuery(inputValue.trim())}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {!loading && (
        <Text style={styles.resultCount}>
          {total.toLocaleString()} {total === 1 ? "result" : "results"}
          {filters.brand.length === 1 ? ` · ${filters.brand[0]}` : ""}
          {filters.category.length === 1 ? ` · ${filters.category[0]}` : ""}
        </Text>
      )}
      <ProductGrid
        articles={articles}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        onEndReached={loadMore}
        onRefresh={refresh}
      />
      <FilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
        brandFacets={brandFacets}
        categoryFacets={categoryFacets}
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
  resultCount: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.inkMuted,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
});