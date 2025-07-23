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

export interface FLoginFormProps extends NavigationProps, BaseComponentProps {
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

export const FLoginForm: React.FC<FLoginFormProps> = ({
  irParaRegister,
  irParaDashboard,
  onSubmit,
  loading: externalLoading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    senha: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    emailValido: true,
    senhaValida: true,
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
    }));
  };

  const handleSubmit = async () => {
    const { emailValido, senhaValida } = validation;
    const { email, senha } = formData;

    if (!emailValido || !senhaValida || !email || !senha) {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
      return;
    }

    setLoading(true);

    try {
      const user = await authService.login(email, senha);

      if (onSubmit) {
        onSubmit(formData);
      } else {
        irParaDashboard?.();
      }

      Alert.alert("Sucesso", `Bem-vindo, ${user.email}!`);
    } catch (error: any) {
      console.error("Erro no login:", error);

      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique o e-mail.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta. Tente novamente.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Esta conta foi desabilitada.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
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
        errorMessage = "Sistema em modo demo. Login simulado com sucesso!";

        if (onSubmit) {
          onSubmit(formData);
        } else {
          irParaDashboard?.();
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
    const { emailValido, senhaValida } = validation;
    const { email, senha } = formData;
    return emailValido && senhaValida && email && senha;
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
        className="mb-4"
      />

      <FButton
        variant="success"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!isFormValid()}
        loading={loading || externalLoading}
        className="mb-4 success"
      >
        Entrar
      </FButton>

      <FLinkButton onPress={irParaRegister!} className="self-center">
        Criar conta
      </FLinkButton>
    </FContainer>
  );
};
