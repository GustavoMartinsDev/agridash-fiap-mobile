import React, { useState, useEffect } from "react";
import { Dimensions, Alert, TouchableOpacity } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import {
  DashboardTemplate,
  Section,
  FText,
  FContainer,
  FButton,
} from "../components";
import { FNotificationModal } from "../components/molecules";
import {
  FSalesForm,
  FStockForm,
  FSalesList,
  FChartContainer,
} from "../components/organisms";
import { NavigationProps, Venda, Estoque, ChartData } from "../types";
import { vendasService, estoqueService } from "../services/firebase";
import { useNotificacoes } from "../hooks/useNotificacoes";
import { useAuth } from "../context/AuthContext";

export interface DashboardPageProps extends NavigationProps {}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [activeTab, setActiveTab] = useState<"vendas" | "estoque">("vendas");
  const [loading, setLoading] = useState(true);
  const [modalNotificacaoVisivel, setModalNotificacaoVisivel] = useState(false);
  const { user, logout } = useAuth();

  // Hook para gerenciar notificações usando o ID do usuário logado
  const {
    notificacoesNaoLidas,
    quantidadeNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes({
    usuarioId: user?.uid!, // Usa o UID do usuário logado ou fallback para "1"
  });

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await logout();
      onLogout?.(); // Chama o callback para navegar para tela de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout");
    }
  };

  // Função para abrir modal de notificações
  const abrirModalNotificacoes = () => {
    setModalNotificacaoVisivel(true);
  };

  // Função para fechar modal de notificações
  const fecharModalNotificacoes = () => {
    setModalNotificacaoVisivel(false);
  };

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
      ...prev.filter((e) => e.nome_produto !== novoEstoque.nome_produto),
    ]);
  };

  if (loading) {
    return (
      <DashboardTemplate title="Dashboard AgriDash" onLogout={handleLogout}>
        <FContainer className="flex-1 justify-center items-center">
          <FText variant="title" color="primary">
            Carregando...
          </FText>
        </FContainer>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate title="Dashboard AgriDash" onLogout={handleLogout}>
      {/* Indicador de Notificações */}
      {quantidadeNaoLidas > 0 && (
        <TouchableOpacity onPress={abrirModalNotificacoes}>
          <FContainer className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-lg shadow-sm">
            <FContainer className="flex-row justify-between items-center">
              <FContainer className="flex-1">
                <FText
                  variant="body"
                  className="text-warning-800 font-semibold"
                >
                  🔔 {quantidadeNaoLidas} notificação(ões) não lida(s)
                </FText>
                <FText variant="caption" className="text-warning-600 mt-1">
                  {notificacoesNaoLidas[0]?.titulo ||
                    "Novas notificações disponíveis"}
                </FText>
              </FContainer>
              <FText className="text-warning-600 font-bold">
                📋 Ver todas →
              </FText>
            </FContainer>
          </FContainer>
        </TouchableOpacity>
      )}

      {/* Informações do usuário logado */}
      {user && (
        <FContainer className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <FText variant="body" className="text-green-800 font-bold mb-2">
            👤 Usuário logado
          </FText>
          {user.displayName && (
            <FText variant="caption" className="text-green-700">
              📝 Nome: {user.displayName}
            </FText>
          )}
          <FText variant="caption" className="text-green-700">
            📧 E-mail: {user.email}
          </FText>
          <FText variant="caption" className="text-green-700">
            🆔 ID: {user.uid}
          </FText>
        </FContainer>
      )}

      <FContainer className="flex-row mb-4">
        <FButton
          variant={activeTab === "vendas" ? "primary" : "secondary"}
          size="medium"
          onPress={() => setActiveTab("vendas")}
          className="flex-1 mr-2 bg-farm-green-200"
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

      {/* <Section title="Vendas por Mês">
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
      </Section> */}

      {/* <Section title="Categorias de Produtos">
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
      </Section> */}

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

          {/* <Section title="Estoque Atual">
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
          </Section> */}
        </>
      )}

      {/* Modal de Notificações */}
      <FNotificationModal
        visible={modalNotificacaoVisivel}
        notificacoes={notificacoesNaoLidas}
        onClose={fecharModalNotificacoes}
        onMarcarComoLida={marcarComoLida}
        onMarcarTodasComoLidas={marcarTodasComoLidas}
      />
    </DashboardTemplate>
  );
};
