import React, { useState, useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  DashboardTemplate,
  Section,
  FText,
  FContainer,
  FButton,
} from "../components";
import { FNotificationModal } from "../components/molecules";
import { FSalesForm, FStockForm, FSalesList } from "../components/organisms";
import { NavigationProps, Venda, Estoque } from "../types";
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

  const {
    notificacoesNaoLidas,
    quantidadeNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes({
    usuarioId: user?.uid!,
  });

  const handleLogout = async () => {
    try {
      await logout();
      onLogout?.();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout");
    }
  };

  const abrirModalNotificacoes = () => {
    setModalNotificacaoVisivel(true);
  };

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
      <FText variant="body" className="text-green-800  font-bold mb-2">
        Olá, {user?.displayName}
      </FText>
      {quantidadeNaoLidas > 0 && (
        <TouchableOpacity onPress={abrirModalNotificacoes}>
          <FContainer className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-lg shadow-sm">
            <FContainer className="flex-row justify-between items-center">
              <FContainer className="flex-1">
                <FText
                  variant="body"
                  className="text-warning-800 font-semibold"
                >
                  {quantidadeNaoLidas}{" "}
                  {quantidadeNaoLidas > 1 ? "notificações" : "notificação"} não
                  lida(s)
                </FText>
                <FText variant="caption" className="text-warning-600 mt-1">
                  {notificacoesNaoLidas[0]?.titulo ||
                    "Novas notificações disponíveis"}
                </FText>
              </FContainer>
              <FText className="text-warning-600 font-bold">Ver todas →</FText>
            </FContainer>
          </FContainer>
        </TouchableOpacity>
      )}

      <FContainer className="flex-row mb-4 bg-white p-2 rounded-lg shadow-sm border">
        <FButton
          variant={activeTab === "vendas" ? "primary" : "secondary"}
          size="medium"
          onPress={() => setActiveTab("vendas")}
          className={`flex-1 ml-1  ${
            activeTab === "vendas"
              ? "bg-blue-600 shadow-md border"
              : "bg-white border-2 border-blue-600"
          }`}
        >
          <FText className={`font-bold text-blue-600`}>Vendas</FText>
        </FButton>
        <FButton
          variant={activeTab === "estoque" ? "primary" : "secondary"}
          size="medium"
          onPress={() => setActiveTab("estoque")}
          className={`flex-1 ml-1 ${
            activeTab === "estoque"
              ? "bg-blue-600 shadow-md border"
              : "bg-white border-2 border-blue-600"
          }`}
        >
          <FText className={`font-bold text-blue-600`}>Estoque</FText>
        </FButton>
      </FContainer>

      {activeTab === "vendas" ? (
        <>
          <Section title="Registrar Venda">
            <FSalesForm onSubmit={handleNovaVenda} className="mb-4 border" />
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
        </>
      )}

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
