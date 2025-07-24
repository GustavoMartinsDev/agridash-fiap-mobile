import React, { useState } from "react";
import { Alert, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FContainer, FButton, FText } from "../../atoms";
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
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validarEmail = (text: string) => {
    setFormData((prev) => ({ ...prev, email: text }));
    setValidation((prev) => ({
      ...prev,
      emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text),
    }));
  };

  const validarSenha = (text: string) => {
    setFormData((prev) => ({ ...prev, senha: text }));

    const temComprimentoMinimo = text.length >= 6;
    const temMaiuscula = /[A-Z]/.test(text);
    const temMinuscula = /[a-z]/.test(text);
    const temNumero = /[0-9]/.test(text);
    const temCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      text
    );

    const senhaValida =
      temComprimentoMinimo &&
      temMaiuscula &&
      temMinuscula &&
      temNumero &&
      temCaracterEspecial;

    setValidation((prev) => ({
      ...prev,
      senhaValida,
      senhaDetalhes: {
        comprimento: temComprimentoMinimo,
        maiuscula: temMaiuscula,
        minuscula: temMinuscula,
        numero: temNumero,
        especial: temCaracterEspecial,
      },
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

  const getSenhaErrorMessage = () => {
    if (!formData.senha || validation.senhaValida) return undefined;

    const detalhes = validation.senhaDetalhes;
    if (!detalhes) return "Senha deve ter pelo menos 8 caracteres";

    const criteriosFaltando = [];
    if (!detalhes.comprimento) criteriosFaltando.push("• Mínimo 6 caracteres");
    if (!detalhes.maiuscula)
      criteriosFaltando.push("• Uma letra maiúscula (A-Z)");
    if (!detalhes.minuscula)
      criteriosFaltando.push("• Uma letra minúscula (a-z)");
    if (!detalhes.numero) criteriosFaltando.push("• Um número (0-9)");
    if (!detalhes.especial)
      criteriosFaltando.push("• Um caractere especial (!@#$...)");

    return criteriosFaltando.join("\n");
  };

  const renderSenhaIndicadores = () => {
    if (!formData.senha) return null;

    const detalhes = validation.senhaDetalhes;
    if (!detalhes) return null;

    return (
      <FContainer className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <FText
          variant="caption"
          className="text-neutral-600 font-semibold mb-2"
        >
          🔐 Força da Senha:
        </FText>

        <FContainer className="space-y-1">
          <FContainer className="flex-row items-center">
            <FText
              variant="caption"
              className={
                detalhes.comprimento ? "text-success-600" : "text-danger-600"
              }
            >
              {detalhes.comprimento ? "✅" : "❌"} Mínimo 6 caracteres
            </FText>
          </FContainer>

          <FContainer className="flex-row items-center">
            <FText
              variant="caption"
              className={
                detalhes.maiuscula ? "text-success-600" : "text-danger-600"
              }
            >
              {detalhes.maiuscula ? "✅" : "❌"} Letra maiúscula (A-Z)
            </FText>
          </FContainer>

          <FContainer className="flex-row items-center">
            <FText
              variant="caption"
              className={
                detalhes.minuscula ? "text-success-600" : "text-danger-600"
              }
            >
              {detalhes.minuscula ? "✅" : "❌"} Letra minúscula (a-z)
            </FText>
          </FContainer>

          <FContainer className="flex-row items-center">
            <FText
              variant="caption"
              className={
                detalhes.numero ? "text-success-600" : "text-danger-600"
              }
            >
              {detalhes.numero ? "✅" : "❌"} Número (0-9)
            </FText>
          </FContainer>

          <FContainer className="flex-row items-center">
            <FText
              variant="caption"
              className={
                detalhes.especial ? "text-success-600" : "text-danger-600"
              }
            >
              {detalhes.especial ? "✅" : "❌"} Caractere especial (!@#$...)
            </FText>
          </FContainer>
        </FContainer>

        <FContainer className="mt-3">
          <FContainer className="flex-row items-center mb-1">
            <FText variant="caption" className="text-neutral-600 mr-2">
              Força:
            </FText>
            <FText
              variant="caption"
              className={
                validation.senhaValida
                  ? "text-success-600 font-bold"
                  : Object.values(detalhes).filter(Boolean).length >= 3
                    ? "text-warning-600 font-bold"
                    : "text-danger-600 font-bold"
              }
            >
              {validation.senhaValida
                ? "🟢 Forte"
                : Object.values(detalhes).filter(Boolean).length >= 3
                  ? "🟡 Média"
                  : "🔴 Fraca"}
            </FText>
          </FContainer>

          <FContainer className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <FContainer
              className={`h-full rounded-full ${
                validation.senhaValida
                  ? "bg-success-500"
                  : Object.values(detalhes).filter(Boolean).length >= 3
                    ? "bg-warning-500"
                    : "bg-danger-500"
              }`}
              style={{
                width: `${(Object.values(detalhes).filter(Boolean).length / 5) * 100}%`,
              }}
            />
          </FContainer>
        </FContainer>
      </FContainer>
    );
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <FContainer className={`w-full ${className}`}>
        <FContainer
          className="mx-4 p-8 rounded-2xl bg-white shadow-lg border border-neutral-100"
          style={{ minWidth: 320, maxWidth: 420, alignSelf: "center" }}
        >
          <FInputField
            type="email"
            placeholder="✉️ E-mail"
            value={formData.email}
            onChangeText={validarEmail}
            error={
              !validation.emailValido ? "Digite um e-mail válido." : undefined
            }
            className="mb-4"
          />

          <FInputField
            type="password"
            placeholder="🔒 Senha"
            value={formData.senha}
            onChangeText={validarSenha}
            error={getSenhaErrorMessage()}
            showError={false}
            className="mb-2"
          />

          {renderSenhaIndicadores()}

          <FInputField
            type="password"
            placeholder="🔐 Confirmar senha"
            value={formData.confirmarSenha}
            onChangeText={validarConfirmarSenha}
            error={
              !validation.senhasIguais ? "As senhas não coincidem." : undefined
            }
            className="mb-6"
          />

          <FContainer className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={
                isFormValid() && !loading && !externalLoading
                  ? ["#16a34a", "#059669", "#0284c7"]
                  : ["#9ca3af", "#6b7280"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 12 }}
            >
              <FButton
                variant="primary"
                size="large"
                fullWidth
                onPress={handleSubmit}
                disabled={!isFormValid()}
                loading={loading || externalLoading}
                className="bg-transparent border-0 h-14"
              >
                <FText variant="body" className="text-white font-bold text-lg">
                  Criar Conta
                </FText>
              </FButton>
            </LinearGradient>
          </FContainer>

          <FContainer className="items-center">
            <FContainer className="px-4 py-3 rounded-full bg-brand-50 border border-brand-200">
              <FLinkButton onPress={irParaLogin!}>
                <FText variant="body" className="text-brand-700 font-semibold">
                  👈 Já tenho uma conta
                </FText>
              </FLinkButton>
            </FContainer>
          </FContainer>
        </FContainer>
      </FContainer>
    </Animated.View>
  );
};
