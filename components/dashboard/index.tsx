import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

type DashboardProps = {
  onLogout?: () => void;
};

export default function Dashboard({ onLogout }: DashboardProps) {
  // Dados fictícios para gráficos
  const vendasPorMes = [
    { value: 20, label: "Jan" },
    { value: 45, label: "Fev" },
    { value: 28, label: "Mar" },
    { value: 80, label: "Abr" },
    { value: 99, label: "Mai" },
    { value: 43, label: "Jun" },
  ];

  const estoque = [
    { value: 40, label: "Milho", frontColor: "#4e7934" },
    { value: 30, label: "Soja", frontColor: "#b2a177" },
    { value: 20, label: "Trigo", frontColor: "#7c6f57" },
    { value: 10, label: "Café", frontColor: "#c0392b" },
  ];

  const categorias = [
    { value: 40, color: "#4e7934", text: "Grãos" },
    { value: 30, color: "#b2a177", text: "Legumes" },
    { value: 20, color: "#7c6f57", text: "Frutas" },
    { value: 10, color: "#c0392b", text: "Outros" },
  ];

  // Controle de formulário de vendas
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [vendas, setVendas] = useState<
    { produto: string; quantidade: number; valor: number }[]
  >([]);

  function registrarVenda() {
    if (!produto || !quantidade || !valor) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setVendas([
      ...vendas,
      { produto, quantidade: Number(quantidade), valor: Number(valor) },
    ]);
    setProduto("");
    setQuantidade("");
    setValor("");
    Alert.alert("Venda registrada!", "A venda foi adicionada ao histórico.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
        backgroundColor="#e6f2d6"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Dashboard Farm Fiap</Text>
          {onLogout && (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Gráfico de vendas por mês */}
        <Text style={styles.sectionTitle}>Vendas por Mês</Text>
        <View style={styles.chart}>
          <LineChart
            data={vendasPorMes}
            width={screenWidth - 32}
            height={180}
            color="#4e7934"
            thickness={3}
            hideDataPoints
            areaChart
            startFillColor="#e6f2d6"
            endFillColor="#e6f2d6"
            yAxisColor="#b2a177"
            xAxisColor="#b2a177"
            xAxisLabelTextStyle={{ color: "#7c6f57" }}
            yAxisTextStyle={{ color: "#7c6f57" }}
            noOfSections={4}
          />
        </View>

        {/* Gráfico de barras de estoque */}
        <Text style={styles.sectionTitle}>Estoque Atual</Text>
        <View style={styles.chart}>
          <BarChart
            data={estoque}
            width={screenWidth - 32}
            height={180}
            barWidth={32}
            spacing={24}
            yAxisColor="#b2a177"
            xAxisColor="#b2a177"
            xAxisLabelTextStyle={{ color: "#7c6f57" }}
            yAxisTextStyle={{ color: "#7c6f57" }}
          />
        </View>

        {/* Gráfico de pizza de categorias */}
        <Text style={styles.sectionTitle}>Categorias de Produtos</Text>
        <View style={styles.chart}>
          <PieChart
            data={categorias}
            donut
            showText
            textColor="white"
            radius={70}
            innerRadius={40}
            centerLabelComponent={() => (
              <Text style={{ color: "#4e7934", fontWeight: "bold" }}>
                Total
              </Text>
            )}
          />
        </View>

        {/* Formulário de vendas */}
        <Text style={styles.sectionTitle}>Registrar Venda</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Produto"
            placeholderTextColor="#7c6f57"
            value={produto}
            onChangeText={setProduto}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            placeholderTextColor="#7c6f57"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Valor (R$)"
            placeholderTextColor="#7c6f57"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.botao} onPress={registrarVenda}>
            <Text style={styles.textoBotao}>Registrar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de vendas */}
        <Text style={styles.sectionTitle}>Histórico de Vendas</Text>
        <View style={styles.listaVendas}>
          {vendas.length === 0 && (
            <Text style={{ color: "#7c6f57" }}>Nenhuma venda registrada.</Text>
          )}
          {vendas.map((v, i) => (
            <View key={i} style={styles.vendaItem}>
              <Text style={styles.vendaTexto}>
                {v.produto} - {v.quantidade} un. - R$ {v.valor.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e6f2d6",
  },
  container: {
    flex: 1,
    backgroundColor: "#e6f2d6",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4e7934",
    marginBottom: 0,
    alignSelf: "flex-start",
  },
  logoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7c6f57",
    marginTop: 24,
    marginBottom: 8,
  },
  chart: {
    alignSelf: "center",
    marginBottom: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 44,
    borderColor: "#b2a177",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    color: "#4e7934",
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#4e7934",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    marginTop: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listaVendas: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 44,
  },
  vendaItem: {
    borderBottomColor: "#e6f2d6",
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  vendaTexto: {
    color: "#4e7934",
    fontSize: 16,
  },
});
