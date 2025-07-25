import { theme } from "./theme";

export const tw = {
  // Background colors
  bg: {
    white: "bg-white",
    gray: {
      50: "bg-gray-50",
      100: "bg-gray-100",
      200: "bg-gray-200",
      500: "bg-gray-500",
      600: "bg-gray-600",
      700: "bg-gray-700",
      800: "bg-gray-800",
    },
    blue: {
      100: "bg-blue-100",
      600: "bg-blue-600",
      700: "bg-blue-700",
    },
    green: {
      50: "bg-green-50",
      600: "bg-green-600",
    },
    warning: {
      50: "bg-warning-50",
    },
    success: {
      50: "bg-success-50",
    },
    danger: {
      50: "bg-danger-50",
    },
  },

  text: {
    gray: {
      500: "text-gray-500",
      600: "text-gray-600",
      700: "text-gray-700",
      800: "text-gray-800",
    },
    blue: {
      600: "text-blue-600",
      700: "text-blue-700",
    },
    green: {
      600: "text-green-600",
      800: "text-green-800",
    },
    warning: {
      600: "text-warning-600",
      800: "text-warning-800",
    },
    success: {
      600: "text-success-600",
    },
    danger: {
      600: "text-danger-600",
    },
  },

  // Border colors
  border: {
    gray: {
      100: "border-gray-100",
      200: "border-gray-200",
    },
    blue: {
      600: "border-blue-600",
    },
    warning: {
      200: "border-warning-200",
    },
    success: {
      200: "border-success-200",
    },
    danger: {
      200: "border-danger-200",
    },
    neutral: {
      100: "border-neutral-100",
    },
    brand: {
      200: "border-brand-200",
    },
  },
};

export const getThemeColor = (colorPath: string): string => {
  const keys = colorPath.split(".");
  let result: any = theme.colors;

  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path "${colorPath}" not found in theme`);
      return theme.colors.gray[500];
    }
  }

  return result;
};
