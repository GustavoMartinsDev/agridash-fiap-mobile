import React, { useState } from "react";
import { Alert } from "react-native";
import { FContainer, FButton } from "../../atoms";
import { FInputField, FLinkButton } from "../../molecules";
import {
  FormData,
  ValidationState,
  NavigationProps,
  BaseComponentProps,
} from "../../../types";

export interface FRegisterFormProps
  extends NavigationProps,
    BaseComponentProps {
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

export const FRegisterForm: React.FC<FRegisterFormProps> = ({
  irParaLogin,
  onSubmit,
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    emailValido: true,
    senhaValida: true,
    senhasIguais: true,
  });

  const validarEmail = (text: string) => {
    setFormData((prev) => ({ ...prev, email: text }));
    setValidation((prev) => ({
      ...prev,
      emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text),
    }));
  };

  const validarSenha = (text: string) => {
    setFormData((prev) => ({ ...prev, senha: text }));
    setValidation((prev) => ({
      ...prev,
      senhaValida: text.length >= 6,
      senhasIguais: text === formData.confirmarSenha,
    }));
  };

  const validarConfirmarSenha = (text: string) => {
    setFormData((prev) => ({ ...prev, confirmarSenha: text }));
    setValidation((prev) => ({
      ...prev,
      senhasIguais: formData.senha === text,
    }));
  };

  const handleSubmit = () => {
    const { emailValido, senhaValida, senhasIguais } = validation;
    const { email, senha, confirmarSenha } = formData;

    if (
      emailValido &&
      senhaValida &&
      senhasIguais &&
      email &&
      senha &&
      confirmarSenha
    ) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        Alert.alert("Cadastro realizado!", "Conta criada com sucesso!");
        irParaLogin?.();
      }
    } else {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
    }
  };

  const isFormValid = () => {
    const { emailValido, senhaValida, senhasIguais } = validation;
    const { email, senha, confirmarSenha } = formData;
    return (
      emailValido &&
      senhaValida &&
      senhasIguais &&
      email &&
      senha &&
      confirmarSenha
    );
  };

  return (
    <FContainer className={`w-full ${className}`}>
      <FInputField
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChangeText={validarEmail}
        error={!validation.emailValido ? "Digite um e-mail válido." : undefined}
        className="mb-2"
      />

      <FInputField
        type="password"
        placeholder="Senha"
        value={formData.senha}
        onChangeText={validarSenha}
        error={
          !validation.senhaValida
            ? "A senha deve ter pelo menos 6 caracteres."
            : undefined
        }
        className="mb-2"
      />

      <FInputField
        type="password"
        placeholder="Confirmar senha"
        value={formData.confirmarSenha}
        onChangeText={validarConfirmarSenha}
        error={
          !validation.senhasIguais ? "As senhas não coincidem." : undefined
        }
        className="mb-4"
      />

      <FButton
        variant="primary"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!isFormValid()}
        loading={loading}
        className="mb-4"
      >
        Cadastrar
      </FButton>

      <FLinkButton onPress={irParaLogin!} className="self-center">
        Já tem conta? Entrar
      </FLinkButton>
    </FContainer>
  );
};
