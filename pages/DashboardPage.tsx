import React, { useState } from "react";
import { Dimensions } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import {
  DashboardTemplate,
  Section,
  SalesForm,
  SalesList,
  ChartContainer,
  FText,
} from "../components";
import { NavigationProps, VendaData, ChartData } from "../types";

const screenWidth = Dimensions.get("window").width;

export interface DashboardPageProps extends NavigationProps {}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  // Mock data for charts
  const vendasPorMes: ChartData[] = [
    { value: 20, label: "Jan" },
    { value: 45, label: "Fev" },
    { value: 28, label: "Mar" },
    { value: 80, label: "Abr" },
    { value: 99, label: "Mai" },
    { value: 43, label: "Jun" },
  ];

  const estoque: ChartData[] = [
    { value: 40, label: "Milho", frontColor: "#4e7934" },
    { value: 30, label: "Soja", frontColor: "#b2a177" },
    { value: 20, label: "Trigo", frontColor: "#7c6f57" },
    { value: 10, label: "Café", frontColor: "#c0392b" },
  ];

  const categorias: ChartData[] = [
    { value: 40, color: "#4e7934", text: "Grãos" },
    { value: 30, color: "#b2a177", text: "Legumes" },
    { value: 20, color: "#7c6f57", text: "Frutas" },
    { value: 10, color: "#c0392b", text: "Outros" },
  ];

  const [vendas, setVendas] = useState<VendaData[]>([]);

  const handleNovaVenda = (venda: VendaData) => {
    setVendas((prev) => [...prev, venda]);
  };

  return (
    <DashboardTemplate title="Dashboard Farm Fiap" onLogout={onLogout}>
      {/* Gráfico de vendas por mês */}
      <Section title="Vendas por Mês">
        <ChartContainer>
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
        </ChartContainer>
      </Section>

      {/* Gráfico de barras de estoque */}
      <Section title="Estoque Atual">
        <ChartContainer>
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
        </ChartContainer>
      </Section>

      {/* Gráfico de pizza de categorias */}
      <Section title="Categorias de Produtos">
        <ChartContainer>
          <PieChart
            data={categorias}
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
        </ChartContainer>
      </Section>

      {/* Formulário de vendas */}
      <Section title="Registrar Venda">
        <SalesForm onSubmit={handleNovaVenda} className="mb-4" />
      </Section>

      {/* Lista de vendas */}
      <Section title="Histórico de Vendas">
        <SalesList vendas={vendas} />
      </Section>
    </DashboardTemplate>
  );
};
