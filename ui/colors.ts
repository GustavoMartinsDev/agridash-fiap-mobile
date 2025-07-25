import { theme } from "./theme";

export const colors = {
  primary: theme.colors.primary[600],
  secondary: theme.colors.secondary[600],
  success: theme.colors.success[500],
  error: theme.colors.error[500],
  warning: theme.colors.warning[500],
  info: theme.colors.info[500],

  green: {
    50: theme.colors.green[50],
    100: theme.colors.green[100],
    500: theme.colors.green[500],
    600: theme.colors.green[600],
    700: theme.colors.green[700],
    800: theme.colors.green[800],
  },

  blue: {
    50: theme.colors.blue[50],
    100: theme.colors.blue[100],
    500: theme.colors.blue[500],
    600: theme.colors.blue[600],
    700: theme.colors.blue[700],
  },

  gray: {
    50: theme.colors.gray[50],
    100: theme.colors.gray[100],
    200: theme.colors.gray[200],
    300: theme.colors.gray[300],
    400: theme.colors.gray[400],
    500: theme.colors.gray[500],
    600: theme.colors.gray[600],
    700: theme.colors.gray[700],
    800: theme.colors.gray[800],
  },

  white: theme.colors.white,
  black: theme.colors.black,

  background: {
    primary: theme.colors.background.primary,
    secondary: theme.colors.background.secondary,
  },

  text: {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    inverse: theme.colors.text.inverse,
  },

  border: {
    light: theme.colors.border.light,
    medium: theme.colors.border.medium,
    dark: theme.colors.border.dark,
  },
};

export { theme };
