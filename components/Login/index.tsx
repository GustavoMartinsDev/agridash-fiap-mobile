import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

type Props = {
  irParaRegister: () => void;
  irParaDashboard: () => void; // Adicione esta prop
};

export default function Login({ irParaRegister, irParaDashboard }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [senhaValida, setSenhaValida] = useState(true);

  function validarEmail(text: string) {
    setEmail(text);
    setEmailValido(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
  }

  function validarSenha(text: string) {
    setSenha(text);
    setSenhaValida(text.length >= 6);
  }

  function handleLogin() {
    if (emailValido && senhaValida && email && senha) {
      irParaDashboard();
    } else {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
    }
  }

  return (
    <View className="flex-1 bg-farm-green-50 items-center justify-center p-6">
      <Text className="text-3xl font-bold text-farm-green-800 mb-2">
        Farm Fiap
      </Text>
      <Text className="text-lg text-farm-amber-700 mb-8">
        Controle de Estoque
      </Text>
      <TextInput
        className={`w-full h-12 bg-white border rounded-lg px-4 mb-2 text-base text-farm-green-800 ${
          !emailValido ? "border-farm-red-600" : "border-farm-amber-400"
        }`}
        placeholder="E-mail"
        placeholderTextColor="#7c6f57"
        value={email}
        onChangeText={validarEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!emailValido && (
        <Text className="text-farm-red-600 mb-2 self-start">
          Digite um e-mail válido.
        </Text>
      )}
      <TextInput
        className={`w-full h-12 bg-white border rounded-lg px-4 mb-2 text-base text-farm-green-800 ${
          !senhaValida ? "border-farm-red-600" : "border-farm-amber-400"
        }`}
        placeholder="Senha"
        placeholderTextColor="#7c6f57"
        value={senha}
        onChangeText={validarSenha}
        secureTextEntry
      />
      {!senhaValida && (
        <Text className="text-farm-red-600 mb-2 self-start">
          A senha deve ter pelo menos 6 caracteres.
        </Text>
      )}
      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center mt-4 ${
          emailValido && senhaValida && email && senha
            ? "bg-farm-green-800"
            : "bg-farm-amber-400"
        }`}
        onPress={handleLogin}
        disabled={!(emailValido && senhaValida && email && senha)}
      >
        <Text className="text-white text-lg font-bold">Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={irParaRegister}>
        <Text className="text-farm-green-800 underline">Criar conta</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
