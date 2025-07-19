export interface BaseComponentProps {
  className?: string;
  testID?: string;
}

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

export interface VendaData {
  produto: string;
  quantidade: number;
  valor: number;
  cooperado?: string;
  data?: Date;
}

export interface ChartData {
  value: number;
  label?: string;
  frontColor?: string;
  color?: string;
  text?: string;
}

export interface Cooperado {
  id: string;
  nome: string;
  fazenda: string;
}

export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  preco: number;
}

export interface Estoque {
  id: string;
  produto: string;
  quantidade: number;
  capacidade: number;
  data: Date;
}

export interface Venda {
  id: string;
  produto: string;
  quantidade: number;
  valor: number;
  cooperado: string;
  data: Date;
}

export interface User {
  uid: string;
  email: string;
}

export type ScreenType = "login" | "register" | "dashboard";

export interface NavigationProps {
  irParaLogin?: () => void;
  irParaRegister?: () => void;
  irParaDashboard?: () => void;
  onLogout?: () => void;
}

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export type InputType = "text" | "email" | "password" | "number";
export type InputState = "default" | "error" | "success";
