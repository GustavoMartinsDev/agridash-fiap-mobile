import React, { useState } from "react";
import { Alert, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FContainer, FButton, FText } from "../../atoms";
import { FInputField, FLinkButton, FPasswordStrength } from "../../molecules";
import { useAuth } from "../../../context/AuthContext";
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
    nome: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    emailValido: true,
    senhaValida: true,
    senhasIguais: true,
  });

  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { signUp } = useAuth();

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

  const validarNome = (text: string) => {
    setFormData((prev) => ({ ...prev, nome: text }));
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
    const { email, senha, confirmarSenha, nome } = formData;

    if (
      !emailValido ||
      !senhaValida ||
      !senhasIguais ||
      !email ||
      !senha ||
      !confirmarSenha ||
      !nome
    ) {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
      return;
    }

    setLoading(true);

    try {
      await signUp({ email, password: senha, displayName: nome });

      Alert.alert("Sucesso", `Conta criada com sucesso! Bem-vindo, ${nome}!`);

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
    return (
      <FPasswordStrength
        password={formData.senha}
        isValid={validation.senhaValida}
        details={validation.senhaDetalhes}
      />
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
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChangeText={validarNome}
            className="mb-4"
          />

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
            error={getSenhaErrorMessage()}
            showError={false}
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
          />

          {renderSenhaIndicadores()}

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
                  Já tenho uma conta
                </FText>
              </FLinkButton>
            </FContainer>
          </FContainer>
        </FContainer>
      </FContainer>
    </Animated.View>
  );
};
