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
  id?: string;
  id_produto?: string;
  nome: string;
  codigo: string;
  preco: number;
}

export interface Estoque {
  id: string;
  id_produto: number;
  nome_produto: string;
  quantidade_estoque: number;
  capacidade_estoque: number;
  status_estoque: string;
  unidade_medida: string;
  valor_unitario_producao: number;
  valor_unitario_venda: number;
}

export interface Venda {
  id: string;
  produto: string; // mantenho produto para compatibilidade
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

export type ButtonVariant = "primary" | "secondary" | "danger" | "success";
export type ButtonSize = "small" | "medium" | "large";

export type InputType = "text" | "email" | "password" | "number";
export type InputState = "default" | "error" | "success";
