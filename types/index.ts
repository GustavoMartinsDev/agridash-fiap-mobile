// Base types for components
export interface BaseComponentProps {
  className?: string;
  testID?: string;
}

// Form types
export interface FormData {
  email: string;
  senha: string;
  confirmarSenha?: string;
}

export interface ValidationState {
  emailValido: boolean;
  senhaValida: boolean;
  senhasIguais?: boolean;
}

// Dashboard types
export interface VendaData {
  produto: string;
  quantidade: number;
  valor: number;
}

export interface ChartData {
  value: number;
  label?: string;
  frontColor?: string;
  color?: string;
  text?: string;
}

// Navigation types
export type ScreenType = "login" | "register" | "dashboard";

export interface NavigationProps {
  irParaLogin?: () => void;
  irParaRegister?: () => void;
  irParaDashboard?: () => void;
  onLogout?: () => void;
}

// Button types
export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";

// Input types
export type InputType = "text" | "email" | "password" | "number";
export type InputState = "default" | "error" | "success";
