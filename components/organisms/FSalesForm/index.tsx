import React, { useState, useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import {
  FContainer,
  FButton,
  FSelect,
  FSelectOption,
  FText,
  FAlert,
  AlertMessageColor,
  FAlertModel,
} from "../../atoms";
import { FInputField, FProductInfo } from "../../molecules";
import {
  VendaData,
  BaseComponentProps,
  Cooperado,
  Produto,
  Estoque,
} from "../../../types";
import {
  cooperadosService,
  produtosService,
  estoqueService,
  vendasService,
} from "../../../services/firebase";

export interface FSalesFormProps extends BaseComponentProps {
  onSubmit?: () => void;
  loading?: boolean;
  usuarioId?: string;
}

export const FSalesForm: React.FC<FSalesFormProps> = ({
  onSubmit,
  loading = false,
  className = "",
  usuarioId,
}) => {
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: "",
    cooperado: "",
  });

  const [cooperados, setCooperados] = useState<Cooperado[]>([]);
  const [produtosEstoque, setProdutosEstoque] = useState<Estoque[]>([]);
  const [estoque, setEstoque] = useState<Estoque | null>(null);
  const [valor, setValor] = useState<number>(0);
  const [vendas, setVendas] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [alert, setAlert] = useState<FAlertModel>();
  const [filtros, setFiltros] = useState({
    produto: "",
    cooperado: "",
    dataInicio: "",
    dataFim: "",
  });
  const [vendasFiltradas, setVendasFiltradas] = useState<any[]>([]);

  useEffect(() => {
    loadCooperados();
    loadProdutosEstoque();
    loadVendas();
  }, []);

  useEffect(() => {
    if (formData.produto && formData.quantidade) {
      calculateValue();
      loadEstoque();
    }
  }, [formData.produto, formData.quantidade]);

  const showAlert = (
    text: string,
    type: AlertMessageColor = AlertMessageColor.Error
  ) => {
    const alertPopUp: FAlertModel = {
      type,
      textAlert: text,
      options: {
        visible: true,
        onDismiss: () => setAlert(undefined),
        action: { label: "X" },
        duration: 3000,
        children: null,
      },
    };
    setAlert(alertPopUp);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [vendas, filtros]);

  const loadCooperados = async () => {
    try {
      const data = await cooperadosService.getCooperados();
      setCooperados(data);
    } catch (error) {
      showAlert("Falha ao carregar cooperados");
    }
  };

  const loadProdutosEstoque = async () => {
    try {
      const data = await estoqueService.getEstoque();
      setProdutosEstoque(data);
    } catch (error) {
      showAlert("Falha ao carregar produtos do estoque");
    }
  };

  const loadVendas = async () => {
    try {
      const data = await vendasService.getVendas();
      const vendasOrdenadas = data.sort((a, b) => {
        return (b as any).id - (a as any).id;
      });
      setVendas(vendasOrdenadas);
      setVendasFiltradas(vendasOrdenadas);
    } catch (error) {
      showAlert("Falha ao carregar histórico de vendas");
    }
  };

  const loadEstoque = async () => {
    try {
      const estoqueData = await estoqueService.getEstoquePorProduto(
        formData.produto
      );
      setEstoque(estoqueData);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    }
  };

  const calculateValue = async () => {
    try {
      const produto = await produtosService.getProdutoByNome(formData.produto);
      if (produto && formData.quantidade) {
        const totalValue =
          produto.valor_unitario_venda * Number(formData.quantidade);
        setValor(totalValue);
      }
    } catch (error) {
      console.error("Erro ao calcular valor:", error);
    }
  };

  const handleSubmit = async () => {
    const { produto, quantidade, cooperado } = formData;

    if (!produto || !quantidade || !cooperado) {
      showAlert("Preencha todos os campos.");
      return;
    }

    const quantidadeNum = Number(quantidade);

    if (quantidadeNum <= 0) {
      showAlert("A quantidade deve ser maior que zero.");
      return;
    }

    if (!estoque) {
      showAlert("Produto não encontrado no estoque.");
      return;
    }

    if (quantidadeNum > estoque.quantidade_estoque) {
      showAlert(
        `Quantidade insuficiente em estoque. Disponível: ${estoque.quantidade_estoque} unidades.`
      );
      return;
    }

    if (quantidadeNum > estoque.capacidade_estoque) {
      showAlert(
        `Quantidade não pode exceder a capacidade máxima do estoque (${estoque.capacidade_estoque} unidades).`
      );
      return;
    }

    try {
      const vendaData: Omit<any, "id"> = {
        produto,
        quantidade: quantidadeNum,
        valor,
        cooperado,
        data_venda: new Date().toISOString(),
      };

      await vendasService.adicionarVenda(vendaData);

      const novaQuantidade = estoque.quantidade_estoque - quantidadeNum;
      await estoqueService.atualizarEstoque(
        estoque.id,
        novaQuantidade,
        usuarioId
      );

      setFormData({
        produto: "",
        quantidade: "",
        cooperado: "",
      });
      setValor(0);
      setEstoque(null);

      await loadProdutosEstoque();
      await loadVendas();

      showAlert(
        "A venda foi adicionada ao histórico.",
        AlertMessageColor.Success
      );
      onSubmit?.();
    } catch (error) {
      showAlert("Falha ao registrar venda.");
    }
  };

  const isFormValid = () => {
    const { produto, quantidade, cooperado } = formData;
    return produto && quantidade && cooperado;
  };

  const aplicarFiltros = () => {
    let vendasFiltradas = [...vendas];

    if (filtros.produto) {
      vendasFiltradas = vendasFiltradas.filter((venda) =>
        venda.produto.toLowerCase().includes(filtros.produto.toLowerCase())
      );
    }

    if (filtros.cooperado) {
      vendasFiltradas = vendasFiltradas.filter((venda) =>
        venda.cooperado.toLowerCase().includes(filtros.cooperado.toLowerCase())
      );
    }

    if (filtros.dataInicio) {
      vendasFiltradas = vendasFiltradas.filter((venda) => {
        const dataVenda = new Date(venda.data_venda);
        const dataInicio = new Date(filtros.dataInicio);
        return dataVenda >= dataInicio;
      });
    }

    if (filtros.dataFim) {
      vendasFiltradas = vendasFiltradas.filter((venda) => {
        const dataVenda = new Date(venda.data_venda);
        const dataFim = new Date(filtros.dataFim);
        return dataVenda <= dataFim;
      });
    }

    setVendasFiltradas(vendasFiltradas);
  };

  const limparFiltros = () => {
    setFiltros({
      produto: "",
      cooperado: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const calcularTotalVendas = () => {
    return vendasFiltradas.reduce((total, venda) => {
      const valor = typeof venda.valor === "number" ? venda.valor : 0;
      return total + valor;
    }, 0);
  };

  const calcularQuantidadeTotal = () => {
    return vendasFiltradas.reduce((total, venda) => {
      return total + (venda.quantidade || 0);
    }, 0);
  };

  const produtoOptions: FSelectOption[] = produtosEstoque.map((estoque) => ({
    label: estoque.nome_produto,
    value: estoque.nome_produto,
  }));

  const cooperadoOptions: FSelectOption[] = cooperados.map((c) => ({
    label: `${c.nome}`,
    value: c.nome,
  }));

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <FContainer
      background="white"
      padding="medium"
      className={`rounded-lg shadow-sm ${className}`}
    >
      <FContainer className="flex-row justify-between items-center mb-4">
        <FText variant="title" color="primary">
          Registro de Vendas
        </FText>
        <FButton
          variant={showHistory ? "secondary" : "primary"}
          size="small"
          onPress={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Formulário" : "Histórico"}
        </FButton>
      </FContainer>

      {!showHistory ? (
        <>
          {estoque && <FProductInfo produto={estoque} className="mb-4" />}

          <FSelect
            options={produtoOptions}
            value={formData.produto}
            label="Produto"
            placeholder="Selecione o produto"
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, produto: value }))
            }
            className="mb-3"
          />

          <FInputField
            label="Quantidade"
            type="number"
            placeholder="Quantidade"
            value={formData.quantidade}
            onChangeText={(text: string) =>
              setFormData((prev) => ({ ...prev, quantidade: text }))
            }
            className="mb-3"
          />

          {valor > 0 && (
            <FContainer className="mb-3 p-3 bg-success-50 rounded-lg border border-success-200">
              <FContainer className="flex-row justify-between items-center">
                <FText variant="body" color="primary" className="font-bold">
                  💰 Valor Total da Venda
                </FText>
                <FText variant="title" className="text-success-600 font-bold">
                  R$ {valor?.toFixed(2)}
                </FText>
              </FContainer>
            </FContainer>
          )}

          <FSelect
            options={cooperadoOptions}
            value={formData.cooperado}
            label="Cooperado"
            placeholder="Selecione o cooperado"
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, cooperado: value }))
            }
            className="mb-4"
          />

          <FButton
            variant="success"
            size="medium"
            fullWidth
            onPress={handleSubmit}
            disabled={!isFormValid()}
            loading={loading}
            className="mt-2"
          >
            Registrar
          </FButton>
        </>
      ) : (
        <>
          <FText variant="subtitle" color="primary" className="mb-3">
            📊 Histórico de Vendas
          </FText>

          {/* Seção de Filtros */}
          <FContainer className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <FText variant="body" color="primary" className="font-bold mb-2">
              🔍 Filtros
            </FText>

            <FContainer className="flex-row mb-2">
              <FContainer className="flex-1 mr-2">
                <FInputField
                  label="Produto"
                  placeholder="Buscar por produto"
                  value={filtros.produto}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, produto: text }))
                  }
                  className="mb-2"
                />
              </FContainer>
              <FContainer className="flex-1">
                <FInputField
                  label="Cooperado"
                  placeholder="Buscar por cooperado"
                  value={filtros.cooperado}
                  onChangeText={(text) =>
                    setFiltros((prev) => ({ ...prev, cooperado: text }))
                  }
                  className="mb-2"
                />
              </FContainer>
            </FContainer>

            <FButton
              variant="secondary"
              size="small"
              onPress={limparFiltros}
              className="self-end"
            >
              🗑️ Limpar Filtros
            </FButton>
          </FContainer>

          {/* Resumo das Vendas */}
          <FContainer className="mb-4 p-3 bg-success-50 rounded-lg border border-success-200">
            <FContainer className="flex-row justify-between items-center mb-2">
              <FText variant="body" color="primary" className="font-bold">
                💰 Total em Vendas
              </FText>
              <FText variant="title" className="text-success-600 font-bold">
                R$ {calcularTotalVendas()?.toFixed(2)}
              </FText>
            </FContainer>

            <FContainer className="flex-row justify-between items-center">
              <FText variant="caption" color="secondary">
                📦 {calcularQuantidadeTotal()} unidades vendidas
              </FText>
              <FText variant="caption" color="secondary">
                🛒 {vendasFiltradas.length} vendas encontradas
              </FText>
            </FContainer>
          </FContainer>

          <ScrollView className="max-h-80">
            {vendasFiltradas.length === 0 ? (
              <FContainer className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <FText variant="body" color="secondary" className="text-center">
                  {vendas.length === 0
                    ? "📝 Nenhuma venda registrada ainda"
                    : "🔍 Nenhuma venda encontrada com os filtros aplicados"}
                </FText>
              </FContainer>
            ) : (
              vendasFiltradas.map((venda, index) => (
                <FContainer
                  key={venda.id || index}
                  className="mb-3 p-4 bg-white rounded-lg border border-neutral-200 shadow-sm"
                >
                  <FContainer className="flex-row justify-between items-center mb-3">
                    <FContainer className="flex-row items-center">
                      <FText
                        variant="body"
                        color="primary"
                        className="font-bold mr-2"
                      >
                        🛒 {venda.produto}
                      </FText>
                      <FContainer className="px-2 py-1 bg-success-100 rounded">
                        <FText
                          variant="caption"
                          className="text-success-700 font-bold"
                        >
                          #{venda.id || index + 1}
                        </FText>
                      </FContainer>
                    </FContainer>
                    <FText
                      variant="title"
                      className="text-success-600 font-bold"
                    >
                      R${" "}
                      {typeof venda.valor === "number"
                        ? venda?.valor?.toFixed(2)
                        : "0,00"}
                    </FText>
                  </FContainer>

                  <FContainer className="flex-row justify-between items-center mb-2">
                    <FContainer className="flex-row items-center">
                      <FText
                        variant="caption"
                        color="secondary"
                        className="mr-4"
                      >
                        👤 {venda.cooperado}
                      </FText>
                      <FText variant="caption" color="secondary">
                        📦 {venda.quantidade} unidades
                      </FText>
                    </FContainer>
                    <FText variant="caption" color="secondary">
                      🕐{" "}
                      {venda.data_venda
                        ? formatDate(venda.data_venda)
                        : "Data não informada"}
                    </FText>
                  </FContainer>

                  <FContainer className="flex-row justify-between items-center">
                    <FText variant="caption" className="text-brand-600">
                      💵 Valor unitário: R${" "}
                      {venda.quantidade > 0
                        ? (venda.valor / venda.quantidade)?.toFixed(2)
                        : "0,00"}
                    </FText>
                    <FContainer className="px-2 py-1 bg-brand-50 rounded">
                      <FText
                        variant="caption"
                        className="text-brand-700 font-bold"
                      >
                        ✅ Concluída
                      </FText>
                    </FContainer>
                  </FContainer>
                </FContainer>
              ))
            )}
          </ScrollView>
        </>
      )}

      <FAlert
        textAlert={alert?.textAlert ?? ""}
        type={alert?.type ?? AlertMessageColor.Info}
        options={alert?.options}
      />
    </FContainer>
  );
};
