import React, { useState, useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import {
  FContainer,
  FInput,
  FButton,
  FText,
  FSelect,
  FAlert,
  AlertMessageColor,
  FAlertModel,
} from "../../atoms";
import { FProductInfo } from "../../molecules";
import { estoqueService, produtosService } from "../../../services/firebase";
import type { Produto, Estoque } from "../../../types";

export interface FSelectOption {
  label: string;
  value: string;
}

interface FStockFormProps {
  onSubmit?: (estoque: Estoque) => void;
  editData?: Estoque | null;
  className?: string;
  usuarioId?: string;
}

export const FStockForm: React.FC<FStockFormProps> = ({
  onSubmit,
  editData,
  className = "",
  usuarioId,
}) => {
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: "",
  });
  const [loading, setLoading] = useState(false);
  const [produtosEstoque, setProdutosEstoque] = useState<Estoque[]>([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState<Estoque | null>(
    null
  );
  const [alert, setAlert] = useState<FAlertModel>();

  useEffect(() => {
    loadProdutosEstoque();
  }, []);

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

  const loadProdutosEstoque = async () => {
    try {
      const estoqueData = await estoqueService.getEstoque();
      setProdutosEstoque(estoqueData);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
      showAlert("Não foi possível carregar o estoque");
    }
  };

  const handleProdutoSelect = (nomeProduto: string) => {
    const estoque = produtosEstoque.find((e) => e.nome_produto === nomeProduto);
    setEstoqueSelecionado(estoque || null);
    setFormData({
      produto: nomeProduto,
      quantidade: estoque ? estoque.quantidade_estoque.toString() : "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.produto || !formData.quantidade) {
      showAlert("Por favor, selecione um produto e informe a quantidade");
      return;
    }

    if (!estoqueSelecionado) {
      showAlert("Produto não encontrado no estoque");
      return;
    }

    const novaQuantidade = parseInt(formData.quantidade);
    if (novaQuantidade < 0) {
      showAlert("A quantidade não pode ser negativa");
      return;
    }

    if (novaQuantidade > estoqueSelecionado.capacidade_estoque) {
      showAlert("A quantidade não pode ser maior que a capacidade máxima");
      return;
    }

    setLoading(true);

    try {
      const novoStatus = getStatusText(
        novaQuantidade,
        estoqueSelecionado.capacidade_estoque
      );

      await estoqueService.atualizarEstoque(
        estoqueSelecionado.id,
        novaQuantidade,
        usuarioId
      );

      await estoqueService.atualizarStatusEstoque(
        estoqueSelecionado.id,
        novoStatus
      );

      showAlert(
        "Quantidade e status atualizados com sucesso!",
        AlertMessageColor.Success
      );

      await loadProdutosEstoque();

      const estoqueAtualizado = await estoqueService.getEstoquePorProduto(
        formData.produto
      );
      setEstoqueSelecionado(estoqueAtualizado);
      setFormData((prev) => ({
        ...prev,
        quantidade: estoqueAtualizado
          ? estoqueAtualizado.quantidade_estoque.toString()
          : "",
      }));

      if (estoqueAtualizado) {
        onSubmit?.(estoqueAtualizado);
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      showAlert("Não foi possível atualizar o estoque");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      produto: "",
      quantidade: "",
    });
    setEstoqueSelecionado(null);
  };

  const produtoOptions: FSelectOption[] = produtosEstoque.map((estoque) => ({
    label: estoque.nome_produto,
    value: estoque.nome_produto,
  }));

  const getStatusColor = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "text-danger-600";
    if (percentual <= 50) return "text-warning-600";
    return "text-success-600";
  };

  const getStatusText = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "Baixo";
    if (percentual <= 80) return "Médio";
    return "Alto";
  };

  const getStatusBgColor = (quantidade: number, capacidade: number) => {
    const percentual = (quantidade / capacidade) * 100;
    if (percentual <= 20) return "bg-danger-50 border-danger-200";
    if (percentual <= 50) return "bg-warning-50 border-warning-200";
    return "bg-success-50 border-success-200";
  };

  return (
    <FContainer
      background="white"
      padding="medium"
      className={`rounded-lg shadow-sm ${className}`}
    >
      <FText variant="title" color="primary" className="mb-4">
        Gerenciar Estoque
      </FText>

      {/* Lista de Produtos em Estoque */}
      <FText variant="subtitle" color="primary" className="mb-3">
        📊 Produtos em Estoque ({produtosEstoque.length} produtos)
      </FText>

      <ScrollView className="max-h-60 mb-4">
        {produtosEstoque.length === 0 ? (
          <FContainer className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <FText variant="body" color="secondary" className="text-center">
              📝 Nenhum produto cadastrado ainda
            </FText>
          </FContainer>
        ) : (
          produtosEstoque.map((estoque, index) => (
            <FContainer
              key={estoque.id}
              className={`mb-3 p-3 rounded-lg border shadow-sm ${
                estoqueSelecionado?.id === estoque.id
                  ? getStatusBgColor(
                      estoque.quantidade_estoque,
                      estoque.capacidade_estoque
                    )
                  : "bg-white border-neutral-200"
              }`}
            >
              <FContainer className="flex-row justify-between items-center mb-2">
                <FText variant="body" color="primary" className="font-bold">
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

              <FContainer className="flex-row justify-between items-center mb-2">
                <FText variant="caption" color="secondary">
                  📊 Quantidade: {estoque.quantidade_estoque}
                </FText>
                <FText variant="caption" color="secondary">
                  🏭 Capacidade: {estoque.capacidade_estoque}
                </FText>
              </FContainer>

              <FContainer className="flex-row justify-between items-center">
                <FText variant="caption" color="secondary">
                  📈 Ocupação:{" "}
                  {(
                    (estoque.quantidade_estoque / estoque.capacidade_estoque) *
                    100
                  )?.toFixed(1)}
                  %
                </FText>
                <FText variant="caption" color="secondary">
                  {estoque.valor_unitario_venda.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </FText>
              </FContainer>
            </FContainer>
          ))
        )}
      </ScrollView>

      {estoqueSelecionado && (
        <FProductInfo produto={estoqueSelecionado} className="mb-4" />
      )}

      {/* Formulário de Edição */}
      <FSelect
        options={produtoOptions}
        value={formData.produto}
        placeholder="Selecione o produto"
        onSelect={handleProdutoSelect}
        className="mb-3"
      />

      <FInput
        type="number"
        placeholder="Nova quantidade"
        value={formData.quantidade}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, quantidade: text }))
        }
        className="mb-3"
      />

      {formData.quantidade && estoqueSelecionado && (
        <FContainer className="mb-3 p-3 bg-success-50 rounded-lg border border-success-200">
          <FContainer className="flex-row justify-between items-center">
            <FText variant="body" color="primary" className="font-bold">
              📊 Nova Ocupação
            </FText>
            <FText variant="title" className="text-success-600 font-bold">
              {(
                (parseInt(formData.quantidade || "0") /
                  estoqueSelecionado.capacidade_estoque) *
                100
              )?.toFixed(1)}
              %
            </FText>
          </FContainer>
        </FContainer>
      )}

      <FButton
        variant="success"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!formData.produto || !formData.quantidade}
        loading={loading}
        className="mt-2"
      >
        Atualizar Quantidade
      </FButton>

      <FButton
        variant="secondary"
        size="medium"
        fullWidth
        onPress={resetForm}
        className="mt-2 bg-gray-300 border border-gray-400"
      >
        <FText className="text-gray-700 font-semibold">Cancelar</FText>
      </FButton>

      <FAlert
        textAlert={alert?.textAlert ?? ""}
        type={alert?.type ?? AlertMessageColor.Info}
        options={alert?.options}
      />
    </FContainer>
  );
};
