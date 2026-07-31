import { StyleSheet, Text, View } from "react-native";
import { sectionLabel, sectionTitle, spacing } from "@/constants/theme";

interface Props {
  label: string;
  title: string;
}

/** Matches .section-label + .section-title from the web app's globals.css:
 *  a small uppercase gold kicker above an italic serif headline. */
export default function SectionHeader({ label, title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={sectionLabel}>{label}</Text>
      <Text style={sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    gap: 4,
  },
});