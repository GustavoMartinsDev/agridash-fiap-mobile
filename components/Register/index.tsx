import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

type Props = {
  irParaLogin: () => void;
};

export default function Register({ irParaLogin }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [senhaValida, setSenhaValida] = useState(true);
  const [senhasIguais, setSenhasIguais] = useState(true);

  function validarEmail(text: string) {
    setEmail(text);
    setEmailValido(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
  }

  function validarSenha(text: string) {
    setSenha(text);
    setSenhaValida(text.length >= 6);
    setSenhasIguais(text === confirmar);
  }

  function validarConfirmar(text: string) {
    setConfirmar(text);
    setSenhasIguais(senha === text);
  }

  function handleRegister() {
    if (
      emailValido &&
      senhaValida &&
      senhasIguais &&
      email &&
      senha &&
      confirmar
    ) {
      Alert.alert("Cadastro realizado!", "Conta criada com sucesso!");
      irParaLogin();
    } else {
      Alert.alert("Erro", "Verifique os campos e tente novamente.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>
      <Text style={styles.subtitulo}>Crie sua conta</Text>
      <TextInput
        style={[styles.input, !emailValido && styles.inputErro]}
        placeholder="E-mail"
        placeholderTextColor="#7c6f57"
        value={email}
        onChangeText={validarEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!emailValido && (
        <Text style={styles.erro}>Digite um e-mail válido.</Text>
      )}
      <TextInput
        style={[styles.input, !senhaValida && styles.inputErro]}
        placeholder="Senha"
        placeholderTextColor="#7c6f57"
        value={senha}
        onChangeText={validarSenha}
        secureTextEntry
      />
      {!senhaValida && (
        <Text style={styles.erro}>
          A senha deve ter pelo menos 6 caracteres.
        </Text>
      )}
      <TextInput
        style={[styles.input, !senhasIguais && styles.inputErro]}
        placeholder="Confirmar senha"
        placeholderTextColor="#7c6f57"
        value={confirmar}
        onChangeText={validarConfirmar}
        secureTextEntry
      />
      {!senhasIguais && (
        <Text style={styles.erro}>As senhas não coincidem.</Text>
      )}
      <TouchableOpacity
        style={[
          styles.botao,
          !(
            emailValido &&
            senhaValida &&
            senhasIguais &&
            email &&
            senha &&
            confirmar
          ) && styles.botaoDesabilitado,
        ]}
        onPress={handleRegister}
        disabled={
          !(
            emailValido &&
            senhaValida &&
            senhasIguais &&
            email &&
            senha &&
            confirmar
          )
        }
      >
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 16 }} onPress={irParaLogin}>
        <Text style={{ color: "#4e7934", textDecorationLine: "underline" }}>
          Já tem conta? Entrar
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2d6",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4e7934",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    color: "#7c6f57",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderColor: "#b2a177",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    color: "#4e7934",
  },
  inputErro: {
    borderColor: "#c0392b",
  },
  erro: {
    color: "#c0392b",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  botao: {
    width: "100%",
    height: 48,
    backgroundColor: "#4e7934",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botaoDesabilitado: {
    backgroundColor: "#b2a177",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
