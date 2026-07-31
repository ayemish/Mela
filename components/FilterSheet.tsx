import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Filters, FacetValue } from "@/lib/types";
import { colors, fonts, radius, spacing } from "@/constants/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
  brandFacets: FacetValue[];
  categoryFacets: FacetValue[];
}

function Chip({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label} ({count})
      </Text>
    </Pressable>
  );
}

export default function FilterSheet({
  visible,
  onClose,
  filters,
  onApply,
  brandFacets,
  categoryFacets,
}: Props) {
  const [draft, setDraft] = useState<Filters>(filters);

  const toggle = (key: "brand" | "category", value: string) => {
    setDraft((prev) => {
      const list = prev[key];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  };

  const reset = () =>
    setDraft({ brand: [], category: [], in_stock: null, price_min: null, price_max: null });

  const apply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Refine</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.ink} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionLabel}>Brand</Text>
            <View style={styles.chipRow}>
              {brandFacets.map((f) => (
                <Chip
                  key={f.value}
                  label={f.value}
                  count={f.count}
                  selected={draft.brand.includes(f.value)}
                  onPress={() => toggle("brand", f.value)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categoryFacets.map((f) => (
                <Chip
                  key={f.value}
                  label={f.value}
                  count={f.count}
                  selected={draft.category.includes(f.value)}
                  onPress={() => toggle("category", f.value)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Price range (PKR)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                placeholderTextColor={colors.inkMuted}
                keyboardType="numeric"
                value={draft.price_min?.toString() ?? ""}
                onChangeText={(t) =>
                  setDraft((prev) => ({ ...prev, price_min: t ? Number(t) : null }))
                }
              />
              <Text style={styles.priceDash}>—</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                placeholderTextColor={colors.inkMuted}
                keyboardType="numeric"
                value={draft.price_max?.toString() ?? ""}
                onChangeText={(t) =>
                  setDraft((prev) => ({ ...prev, price_max: t ? Number(t) : null }))
                }
              />
            </View>

            <View style={styles.stockRow}>
              <Text style={styles.sectionLabel}>In stock only</Text>
              <Switch
                value={draft.in_stock === true}
                onValueChange={(v) => setDraft((prev) => ({ ...prev, in_stock: v ? true : null }))}
                trackColor={{ true: colors.gold, false: colors.border }}
                thumbColor={colors.surface}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={apply}>
              <Text style={styles.applyText}>Apply filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26,26,26,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: "85%",
    paddingBottom: spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.serif,
    fontStyle: "italic",
    fontSize: 22,
    color: colors.ink,
  },
  scrollContent: {
    padding: spacing.md,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: colors.gold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  chipText: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.ink,
  },
  chipTextSelected: {
    color: "#fff",
    fontFamily: fonts.sansMedium,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontFamily: fonts.sansRegular,
    color: colors.ink,
  },
  priceDash: {
    color: colors.inkMuted,
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  resetButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    fontFamily: fonts.sansMedium,
    color: colors.ink,
  },
  applyButton: {
    flex: 2,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
  },
  applyText: {
    fontFamily: fonts.sansSemiBold,
    color: "#fff",
  },
});