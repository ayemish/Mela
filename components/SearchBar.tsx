import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/constants/theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onOpenFilters,
  activeFilterCount,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={17} color={colors.inkMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          placeholder="Search for lawn, kurta, wedding..."
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
        />
      </View>
      <Pressable style={styles.filterButton} onPress={onOpenFilters}>
        <Ionicons name="options-outline" size={19} color={colors.ink} />
        {activeFilterCount > 0 && (
          <View style={styles.dot}>
            <View style={styles.dotInner} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 10,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  dotInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
});