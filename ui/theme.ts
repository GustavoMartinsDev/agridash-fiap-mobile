// Design System - Theme Configuration
export const theme = {
  colors: {
    // Primary Colors
    primary: {
      50: "#EBF8FF",
      100: "#BEE3F8",
      200: "#90CDF4",
      300: "#63B3ED",
      400: "#4299E1",
      500: "#3182CE",
      600: "#2B77CB", // Main primary
      700: "#2C5AA0",
      800: "#2A4365",
      900: "#1A365D",
    },

    // Secondary Colors
    secondary: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },

    // Success Colors
    success: {
      50: "#F0FFF4",
      100: "#C6F6D5",
      200: "#9AE6B4",
      300: "#68D391",
      400: "#48BB78",
      500: "#38A169",
      600: "#25855A",
      700: "#276749",
      800: "#22543D",
      900: "#1C4532",
    },

    // Error Colors
    error: {
      50: "#FED7D7",
      100: "#FEB2B2",
      200: "#FC8181",
      300: "#F56565",
      400: "#E53E3E",
      500: "#C53030",
      600: "#9B2C2C",
      700: "#742A2A",
      800: "#63171B",
      900: "#1A202C",
    },

    // Warning Colors
    warning: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#F59E0B",
      400: "#D97706",
      500: "#B45309",
      600: "#92400E",
      700: "#78350F",
      800: "#451A03",
      900: "#1C1917",
    },

    // Info Colors
    info: {
      50: "#EBF8FF",
      100: "#BEE3F8",
      200: "#90CDF4",
      300: "#63B3ED",
      400: "#4299E1",
      500: "#3182CE",
      600: "#2B77CB",
      700: "#2C5AA0",
      800: "#2A4365",
      900: "#1A365D",
    },

    // Green Colors (Agriculture Theme)
    green: {
      50: "#F0FDF4",
      100: "#DCFCE7",
      200: "#BBF7D0",
      300: "#86EFAC",
      400: "#4ADE80",
      500: "#22C55E",
      600: "#16A34A",
      700: "#15803D",
      800: "#166534", // Main green
      900: "#14532D",
    },

    // Blue Colors (Trust & Technology)
    blue: {
      50: "#EBF8FF",
      100: "#BEE3F8",
      200: "#90CDF4",
      300: "#63B3ED",
      400: "#4299E1",
      500: "#3182CE",
      600: "#2563EB", // Main blue
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },

    // Neutral Colors
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },

    // White & Black
    white: "#FFFFFF",
    black: "#000000",

    // Background Colors
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      tertiary: "#F3F4F6",
    },

    // Text Colors
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      tertiary: "#9CA3AF",
      inverse: "#FFFFFF",
    },

    // Border Colors
    border: {
      light: "#E5E7EB",
      medium: "#D1D5DB",
      dark: "#9CA3AF",
    },

    // Shadow Colors
    shadow: {
      light: "rgba(0, 0, 0, 0.05)",
      medium: "rgba(0, 0, 0, 0.1)",
      dark: "rgba(0, 0, 0, 0.25)",
    },
  },

  // Spacing System (based on 4px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
    "4xl": 96,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },

  // Font Weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 12,
    },
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeBorderRadius = typeof theme.borderRadius;
export type ThemeFontSize = typeof theme.fontSize;
export type ThemeFontWeight = typeof theme.fontWeight;
export type ThemeShadows = typeof theme.shadows;

// Helper functions
export const getColor = (path: string): string => {
  const keys = path.split(".");
  let result: any = theme.colors;

  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path "${path}" not found in theme`);
      return theme.colors.gray[500];
    }
  }

  return result;
};

export const getSpacing = (key: keyof ThemeSpacing): number => {
  return theme.spacing[key];
};

export const getFontSize = (key: keyof ThemeFontSize): number => {
  return theme.fontSize[key];
};

export const getBorderRadius = (key: keyof ThemeBorderRadius): number => {
  return theme.borderRadius[key];
};

export const getShadow = (key: keyof ThemeShadows) => {
  return theme.shadows[key];
};
