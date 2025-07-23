import React, { useState, useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import {
  FContainer,
  FButton,
  FSelect,
  FSelectOption,
  FText,
} from "../../atoms";
import { FInputField } from "../../molecules";
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
}

export const FSalesForm: React.FC<FSalesFormProps> = ({
  onSubmit,
  loading = false,
  className = "",
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

  const loadCooperados = async () => {
    try {
      const data = await cooperadosService.getCooperados();
      setCooperados(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar cooperados");
    }
  };

  const loadProdutosEstoque = async () => {
    try {
      const data = await estoqueService.getEstoque();
      setProdutosEstoque(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar produtos do estoque");
    }
  };

  const loadVendas = async () => {
    try {
      const data = await vendasService.getVendas();
      const vendasOrdenadas = data.sort((a, b) => {
        return (b as any).id - (a as any).id;
      });
      setVendas(vendasOrdenadas);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar histórico de vendas");
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
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const quantidadeNum = Number(quantidade);

    if (quantidadeNum <= 0) {
      Alert.alert("Erro", "A quantidade deve ser maior que zero.");
      return;
    }

    if (!estoque) {
      Alert.alert("Erro", "Produto não encontrado no estoque.");
      return;
    }

    if (quantidadeNum > estoque.quantidade_estoque) {
      Alert.alert(
        "Erro",
        `Quantidade insuficiente em estoque. Disponível: ${estoque.quantidade_estoque} unidades.`
      );
      return;
    }

    if (quantidadeNum > estoque.capacidade_estoque) {
      Alert.alert(
        "Erro",
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
      await estoqueService.atualizarEstoque(estoque.id, novaQuantidade);

      setFormData({
        produto: "",
        quantidade: "",
        cooperado: "",
      });
      setValor(0);
      setEstoque(null);

      await loadProdutosEstoque();
      await loadVendas();

      Alert.alert("Venda registrada!", "A venda foi adicionada ao histórico.");
      onSubmit?.();
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar venda.");
    }
  };

  const isFormValid = () => {
    const { produto, quantidade, cooperado } = formData;
    return produto && quantidade && cooperado;
  };

  const produtoOptions: FSelectOption[] = produtosEstoque.map((estoque) => ({
    label: estoque.nome_produto,
    value: estoque.nome_produto,
  }));

  const cooperadoOptions: FSelectOption[] = cooperados.map((c) => ({
    label: `${c.nome}`,
    value: c.nome,
  }));

  const getStatusColor = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "text-danger-600";
    if (percentual <= 50) return "text-warning-600";
    return "text-success-600";
  };

  const getStatusText = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "Crítico";
    if (percentual <= 50) return "Baixo";
    return "Normal";
  };

  const getStatusBgColor = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "bg-danger-50 border-danger-200";
    if (percentual <= 50) return "bg-warning-50 border-warning-200";
    return "bg-success-50 border-success-200";
  };

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
          {estoque && (
            <FContainer
              className={`mb-4 p-3 rounded-lg border ${getStatusBgColor(estoque.quantidade_estoque, estoque.capacidade_estoque)}`}
            >
              <FContainer className="flex-row justify-between items-center mb-2">
                <FText variant="subtitle" color="primary" className="font-bold">
                  📦 {estoque.nome_produto}
                </FText>
                <FText
                  variant="caption"
                  className={`font-bold ${getStatusColor(estoque.quantidade_estoque, estoque.capacidade_estoque)}`}
                >
                  {getStatusText(
                    estoque.quantidade_estoque,
                    estoque.capacidade_estoque
                  )}
                </FText>
              </FContainer>

              <FContainer className="flex-row justify-between mb-2">
                <FText variant="caption" color="secondary">
                  Em estoque: {estoque.quantidade_estoque} unidades
                </FText>
                <FText variant="caption" color="secondary">
                  Capacidade: {estoque.capacidade_estoque} unidades
                </FText>
              </FContainer>

              <FContainer className="flex-row justify-between">
                <FText variant="caption" color="secondary">
                  Ocupação:{" "}
                  {(
                    (estoque.quantidade_estoque / estoque.capacidade_estoque) *
                    100
                  ).toFixed(1)}
                  %
                </FText>
                <FText variant="caption" color="secondary">
                  Status: {estoque.status_estoque}
                </FText>
              </FContainer>
            </FContainer>
          )}

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
                  R$ {valor.toFixed(2)}
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
            ✅ Registrar Venda
          </FButton>
        </>
      ) : (
        <>
          <FText variant="subtitle" color="primary" className="mb-3">
            📊 Histórico de Vendas ({vendas.length} vendas)
          </FText>

          <ScrollView className="max-h-96">
            {vendas.length === 0 ? (
              <FContainer className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <FText variant="body" color="secondary" className="text-center">
                  📝 Nenhuma venda registrada ainda
                </FText>
              </FContainer>
            ) : (
              vendas.map((venda, index) => (
                <FContainer
                  key={venda.id || index}
                  className="mb-3 p-3 bg-white rounded-lg border border-neutral-200 shadow-sm"
                >
                  <FContainer className="flex-row justify-between items-center mb-2">
                    <FText variant="body" color="primary" className="font-bold">
                      🛒 {venda.produto}
                    </FText>
                    <FText
                      variant="caption"
                      className="text-success-600 font-bold"
                    >
                      R${" "}
                      {typeof venda.valor === "number"
                        ? venda.valor.toFixed(2)
                        : "0,00"}
                    </FText>
                  </FContainer>

                  <FContainer className="flex-row justify-between items-center mb-2">
                    <FText variant="caption" color="secondary">
                      👤 {venda.cooperado}
                    </FText>
                    <FText variant="caption" color="secondary">
                      📦 {venda.quantidade} unidades
                    </FText>
                  </FContainer>

                  <FContainer className="flex-row justify-between items-center">
                    <FText variant="caption" color="secondary">
                      🕐{" "}
                      {venda.data_venda
                        ? formatDate(venda.data_venda)
                        : "Data não informada"}
                    </FText>
                    <FText variant="caption" className="text-success-600">
                      #{venda.id || index + 1}
                    </FText>
                  </FContainer>
                </FContainer>
              ))
            )}
          </ScrollView>
        </>
      )}
    </FContainer>
  );
};
