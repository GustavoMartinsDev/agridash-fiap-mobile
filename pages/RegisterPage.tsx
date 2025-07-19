import React from "react";
import { AuthTemplate, RegisterForm } from "../components";
import { NavigationProps } from "../types";

export interface RegisterPageProps extends NavigationProps {}

export const RegisterPage: React.FC<RegisterPageProps> = ({ irParaLogin }) => {
  return (
    <AuthTemplate title="Cadastro" subtitle="Crie sua conta">
      <RegisterForm irParaLogin={irParaLogin} />
    </AuthTemplate>
  );
};
