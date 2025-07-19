import React, { useState } from "react";
import { Alert } from "react-native";
import { FContainer, FButton } from "../../atoms";
import { FInputField, FLinkButton } from "../../molecules";
import { authService } from "../../../services/auth";
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
  loading: externalLoading = false,
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

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    const { emailValido, senhaValida, senhasIguais } = validation;
    const { email, senha, confirmarSenha } = formData;

    if (
      !emailValido ||
      !senhaValida ||
      !senhasIguais ||
      !email ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
      return;
    }

    setLoading(true);

    try {
      const user = await authService.register(email, senha);

      Alert.alert(
        "Sucesso",
        `Conta criada com sucesso! Bem-vindo, ${user.email}!`
      );

      if (onSubmit) {
        onSubmit(formData);
      } else {
        irParaLogin?.();
      }
    } catch (error: any) {
      console.error("Erro no registro:", error);

      let errorMessage = "Erro ao criar conta. Tente novamente.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está em uso. Tente fazer login.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Criação de contas desabilitada no momento.";
      } else if (
        error.code === "auth/invalid-api-key" ||
        (error.error &&
          error.error.message &&
          error.error.message.includes("API key not valid"))
      ) {
        errorMessage =
          "Chave de API do Firebase inválida. Verifique as configurações.";
      } else if (
        error.message &&
        error.message.includes("Firebase not configured")
      ) {
        errorMessage = "Sistema em modo demo. Cadastro simulado com sucesso!";

        Alert.alert("Sucesso", "Conta criada com sucesso no modo demo!");

        if (onSubmit) {
          onSubmit(formData);
        } else {
          irParaLogin?.();
        }
        return;
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      } else if (error.error && error.error.message) {
        errorMessage = `Erro: ${error.error.message}`;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
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
        loading={loading || externalLoading}
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
