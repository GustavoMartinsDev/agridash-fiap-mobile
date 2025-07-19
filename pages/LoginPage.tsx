import React from "react";
import { AuthTemplate, LoginForm } from "../components";
import { NavigationProps } from "../types";

export interface LoginPageProps extends NavigationProps {}

export const LoginPage: React.FC<LoginPageProps> = ({
  irParaRegister,
  irParaDashboard,
}) => {
  return (
    <AuthTemplate title="Farm Fiap" subtitle="Controle de Estoque">
      <LoginForm
        irParaRegister={irParaRegister}
        irParaDashboard={irParaDashboard}
      />
    </AuthTemplate>
  );
};
