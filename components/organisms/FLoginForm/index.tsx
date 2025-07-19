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

export interface FLoginFormProps extends NavigationProps, BaseComponentProps {
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

export const FLoginForm: React.FC<FLoginFormProps> = ({
  irParaRegister,
  irParaDashboard,
  onSubmit,
  loading = false,
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

  const handleSubmit = () => {
    const { emailValido, senhaValida } = validation;
    const { email, senha } = formData;

    if (emailValido && senhaValida && email && senha) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        irParaDashboard?.();
      }
    } else {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
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
        variant="primary"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!isFormValid()}
        loading={loading}
        className="mb-4"
      >
        Entrar
      </FButton>

      <FLinkButton onPress={irParaRegister!} className="self-center">
        Criar conta
      </FLinkButton>
    </FContainer>
  );
};
