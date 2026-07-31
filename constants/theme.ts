// Matches the web app's design tokens (frontend/app/globals.css) exactly,
// so the mobile app reads as the same brand, not a different app.
export const colors = {
  background: "#FAFAF8",
  surface: "#FFFFFF",
  ink: "#1A1A1A",
  inkMuted: "#6B6B6B",
  border: "#E8E4DC",
  gold: "#C9A96E",
  goldLight: "#E8D5B0",
  accent: "#C9A96E", // alias for gold, kept for readability at call sites
  danger: "#B3261E",
  outOfStock: "#9A9A9A",
  shadow: "rgba(26, 26, 26, 0.08)",
};

// Kept as an alias so any older references to `accent` still resolve —
// the web app's accent color IS gold.
export const accent = colors.gold;

export const fonts = {
  serif: "PlayfairDisplay_500Medium_Italic",
  serifRegular: "PlayfairDisplay_500Medium",
  serifBold: "PlayfairDisplay_700Bold",
  sans: "Inter_300Light",
  sansRegular: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
};

// Section label: uppercase, wide letter-spacing, gold — used above every
// section title throughout the web app ("NEW ARRIVALS", "TRENDING", etc.)
export const sectionLabel = {
  fontFamily: fonts.sansMedium,
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase" as const,
  color: colors.gold,
};

// Section title: italic serif, matches .section-title in globals.css
export const sectionTitle = {
  fontFamily: fonts.serif,
  fontStyle: "italic" as const,
  fontSize: 26,
  color: colors.ink,
  lineHeight: 32,
};