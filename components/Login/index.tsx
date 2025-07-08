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
    <View style={styles.container}>
      <Text style={styles.titulo}>Farm Fiap</Text>
      <Text style={styles.subtitulo}>Controle de Estoque</Text>
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
      <TouchableOpacity
        style={[
          styles.botao,
          !(emailValido && senhaValida && email && senha) &&
            styles.botaoDesabilitado,
        ]}
        onPress={handleLogin}
        disabled={!(emailValido && senhaValida && email && senha)}
      >
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 16 }} onPress={irParaRegister}>
        <Text style={{ color: "#4e7934", textDecorationLine: "underline" }}>
          Criar conta
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
