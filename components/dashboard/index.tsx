import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
    <SafeAreaView className="flex-1 bg-farm-green-50">
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
        backgroundColor="#e6f2d6"
      />
      <ScrollView
        className="flex-1 bg-farm-green-50 p-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-farm-green-800 mb-0 self-start">
            Dashboard Farm Fiap
          </Text>
          {onLogout && (
            <TouchableOpacity
              className="bg-farm-red-600 py-2 px-4 rounded-lg"
              onPress={onLogout}
            >
              <Text className="text-white font-bold text-base">Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Gráfico de vendas por mês */}
        <Text className="text-xl font-bold text-farm-amber-700 mt-6 mb-2">
          Vendas por Mês
        </Text>
        <View className="self-center mb-2">
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
        <Text className="text-xl font-bold text-farm-amber-700 mt-6 mb-2">
          Estoque Atual
        </Text>
        <View className="self-center mb-2">
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
        <Text className="text-xl font-bold text-farm-amber-700 mt-6 mb-2">
          Categorias de Produtos
        </Text>
        <View className="self-center mb-2">
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
        <Text className="text-xl font-bold text-farm-amber-700 mt-6 mb-2">
          Registrar Venda
        </Text>
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <TextInput
            className="h-11 border border-farm-amber-400 rounded-lg px-3 mb-2 text-farm-green-800 text-base"
            placeholder="Produto"
            placeholderTextColor="#7c6f57"
            value={produto}
            onChangeText={setProduto}
          />
          <TextInput
            className="h-11 border border-farm-amber-400 rounded-lg px-3 mb-2 text-farm-green-800 text-base"
            placeholder="Quantidade"
            placeholderTextColor="#7c6f57"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />
          <TextInput
            className="h-11 border border-farm-amber-400 rounded-lg px-3 mb-2 text-farm-green-800 text-base"
            placeholder="Valor (R$)"
            placeholderTextColor="#7c6f57"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          <TouchableOpacity
            className="bg-farm-green-800 rounded-lg items-center justify-center h-11 mt-2"
            onPress={registrarVenda}
          >
            <Text className="text-white font-bold text-base">Registrar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de vendas */}
        <Text className="text-xl font-bold text-farm-amber-700 mt-6 mb-2">
          Histórico de Vendas
        </Text>
        <View className="bg-white rounded-lg p-3 mb-4 min-h-[44px]">
          {vendas.length === 0 && (
            <Text className="text-farm-amber-700">
              Nenhuma venda registrada.
            </Text>
          )}
          {vendas.map((v, i) => (
            <View key={i} className="border-b border-farm-green-50 py-1">
              <Text className="text-farm-green-800 text-base">
                {v.produto} - {v.quantidade} un. - R$ {v.valor.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
