/**
 * Shared chart palette — pulls from the design tokens so charts match the rest
 * of the UI in the dark theme. Values are resolved hex (Recharts needs concrete
 * colours, not CSS variables, for SVG fills).
 */
export const CHART_COLORS = {
  primary: "#6c37c3",
  secondary: "#b0b3d7",
  success: "#3fb984",
  warning: "#e0a73b",
  destructive: "#e5555a",
  info: "#5b8dff",
  grid: "#2a2540",
  axis: "#9a95ae",
  surface: "#16131f",
} as const;

export const SENTIMENT_COLORS = {
  positive: CHART_COLORS.success,
  neutral: CHART_COLORS.secondary,
  negative: CHART_COLORS.destructive,
} as const;
