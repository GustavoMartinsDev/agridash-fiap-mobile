import React, { useState } from "react";
import { Alert, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FContainer, FButton, FText } from "../../atoms";
import { FInputField, FLinkButton } from "../../molecules";
import { useAuth } from "../../../context/AuthContext";
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
  const [fadeAnim] = useState(new Animated.Value(0));
  const { signIn, user } = useAuth();

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
      await signIn({ email, password: senha });

      if (onSubmit) {
        onSubmit(formData);
      } else {
        irParaDashboard?.();
      }

      Alert.alert("Sucesso", `Bem-vindo, ${email}!`);
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <FContainer className={`w-full ${className}`}>
        <FContainer
          className="mx-4 p-8 rounded-2xl bg-white shadow-lg border border-neutral-100"
          style={{ minWidth: 320, maxWidth: 420, alignSelf: "center" }}
        >
          <FInputField
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChangeText={validarEmail}
            error={
              !validation.emailValido ? "Digite um e-mail válido." : undefined
            }
            className="mb-4"
          />

          <FInputField
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChangeText={validarSenha}
            className="mb-2"
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
                  Entrar
                </FText>
              </FButton>
            </LinearGradient>
          </FContainer>
          <FContainer className="items-center">
            <FContainer className="px-4 py-3 rounded-full bg-success-50 border border-success-200">
              <FLinkButton onPress={irParaRegister!}>
                <FText
                  variant="body"
                  className="text-success-700 font-semibold"
                >
                  Criar nova conta
                </FText>
              </FLinkButton>
            </FContainer>
          </FContainer>
        </FContainer>
      </FContainer>
    </Animated.View>
  );
};
