import React, { useState, useEffect } from "react";
import { Dimensions, Alert } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import {
  DashboardTemplate,
  Section,
  FText,
  FContainer,
  FButton,
} from "../components";
import {
  FSalesForm,
  FStockForm,
  FSalesList,
  FChartContainer,
} from "../components/organisms";
import { NavigationProps, Venda, Estoque, ChartData } from "../types";
import { vendasService, estoqueService } from "../services/firebase";

const screenWidth = Dimensions.get("window").width;

export interface DashboardPageProps extends NavigationProps {}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [activeTab, setActiveTab] = useState<"vendas" | "estoque">("vendas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vendasData, estoqueData] = await Promise.all([
        vendasService.getVendas(),
        estoqueService.getEstoque(),
      ]);
      setVendas(vendasData);
      setEstoque(estoqueData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const vendasPorMes = () => {
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const vendasPorMes = new Array(12).fill(0);

    vendas.forEach((venda) => {
      const mes = venda.data.getMonth();
      vendasPorMes[mes] += venda.valor;
    });

    return meses.map((mes, index) => ({
      value: vendasPorMes[index],
      label: mes,
    }));
  };

  const estoqueData = (): ChartData[] => {
    return estoque.map((item) => ({
      value: item.quantidade,
      label: item.produto,
      frontColor: "#4e7934",
    }));
  };

  const categoriasData = (): ChartData[] => {
    const produtosCategorias: Record<string, { value: number; color: string }> =
      {
        Soja: { value: 0, color: "#4e7934" },
        Milho: { value: 0, color: "#b2a177" },
        Arroz: { value: 0, color: "#7c6f57" },
        Feijão: { value: 0, color: "#c0392b" },
        Trigo: { value: 0, color: "#e67e22" },
      };

    vendas.forEach((venda) => {
      if (produtosCategorias[venda.produto]) {
        produtosCategorias[venda.produto].value += venda.valor;
      }
    });

    return Object.entries(produtosCategorias)
      .map(([produto, data]) => ({
        value: data.value,
        color: data.color,
        text: produto,
      }))
      .filter((item) => item.value > 0);
  };

  const handleNovaVenda = async () => {
    try {
      const vendasData = await vendasService.getVendas();
      setVendas(vendasData);
    } catch (error) {
      console.error("Erro ao recarregar vendas:", error);
    }
  };

  const handleNovoEstoque = (novoEstoque: Estoque) => {
    setEstoque((prev) => [
      novoEstoque,
      ...prev.filter((e) => e.produto !== novoEstoque.produto),
    ]);
  };

  if (loading) {
    return (
      <DashboardTemplate title="Dashboard Farm Fiap" onLogout={onLogout}>
        <FContainer className="flex-1 justify-center items-center">
          <FText variant="title" color="primary">
            Carregando...
          </FText>
        </FContainer>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate title="Dashboard Farm Fiap" onLogout={onLogout}>
      <FContainer className="flex-row mb-4">
        <FButton
          variant={activeTab === "vendas" ? "primary" : "secondary"}
          size="medium"
          onPress={() => setActiveTab("vendas")}
          className="flex-1 mr-2"
        >
          Vendas
        </FButton>
        <FButton
          variant={activeTab === "estoque" ? "primary" : "secondary"}
          size="medium"
          onPress={() => setActiveTab("estoque")}
          className="flex-1 ml-2"
        >
          Estoque
        </FButton>
      </FContainer>

      <Section title="Vendas por Mês">
        <FChartContainer>
          <LineChart
            data={vendasPorMes()}
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
        </FChartContainer>
      </Section>

      <Section title="Estoque Atual">
        <FChartContainer>
          <BarChart
            data={estoqueData()}
            width={screenWidth - 32}
            height={180}
            barWidth={32}
            spacing={24}
            yAxisColor="#b2a177"
            xAxisColor="#b2a177"
            xAxisLabelTextStyle={{ color: "#7c6f57" }}
            yAxisTextStyle={{ color: "#7c6f57" }}
          />
        </FChartContainer>
      </Section>

      <Section title="Categorias de Produtos">
        <FChartContainer>
          <PieChart
            data={categoriasData()}
            donut
            showText
            textColor="white"
            radius={70}
            innerRadius={40}
            centerLabelComponent={() => (
              <FText color="primary" className="font-bold">
                Total
              </FText>
            )}
          />
        </FChartContainer>
      </Section>

      {activeTab === "vendas" ? (
        <>
          <Section title="Registrar Venda">
            <FSalesForm onSubmit={handleNovaVenda} className="mb-4" />
          </Section>

          <Section title="Histórico de Vendas">
            <FSalesList vendas={vendas} />
          </Section>
        </>
      ) : (
        <>
          <Section title="Gerenciar Estoque">
            <FStockForm onSubmit={handleNovoEstoque} className="mb-4" />
          </Section>

          <Section title="Estoque Atual">
            <FContainer>
              {estoque.map((item, index) => (
                <FContainer
                  key={index}
                  className="p-3 mb-2 bg-white rounded-lg shadow"
                >
                  <FText variant="subtitle" color="primary" className="mb-1">
                    {item.produto}
                  </FText>
                  <FText variant="body" color="secondary">
                    Quantidade: {item.quantidade} / {item.capacidade}
                  </FText>
                  <FText variant="caption" color="secondary">
                    Ocupação:{" "}
                    {((item.quantidade / item.capacidade) * 100).toFixed(1)}%
                  </FText>
                </FContainer>
              ))}
            </FContainer>
          </Section>
        </>
      )}
    </DashboardTemplate>
  );
};
