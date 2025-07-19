import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { FContainer, FInput, FButton, FText, FSelect } from "../../atoms";
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
}

export const FStockForm: React.FC<FStockFormProps> = ({
  onSubmit,
  editData,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: "",
    capacidade: "",
  });
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        const produtosList = await produtosService.getProdutos();
        setProdutos(produtosList);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        Alert.alert("Erro", "Não foi possível carregar os produtos");
      }
    };

    loadProdutos();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        produto: editData.produto,
        quantidade: editData.quantidade.toString(),
        capacidade: editData.capacidade.toString(),
      });
    }
  }, [editData]);

  const resetForm = () => {
    setFormData({
      produto: "",
      quantidade: "",
      capacidade: "",
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (parseInt(formData.quantidade) > parseInt(formData.capacidade)) {
      Alert.alert("Erro", "A quantidade não pode ser maior que a capacidade");
      return;
    }

    setLoading(true);

    try {
      if (editData?.id) {
        await estoqueService.atualizarEstoque(
          editData.id,
          parseInt(formData.quantidade)
        );
        Alert.alert("Sucesso", "Estoque atualizado com sucesso!");
      } else {
        await estoqueService.adicionarEstoque(
          formData.produto,
          parseInt(formData.quantidade)
        );
        Alert.alert("Sucesso", "Estoque criado com sucesso!");
      }

      if (!editData) {
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao salvar estoque:", error);
      Alert.alert("Erro", "Não foi possível salvar o estoque");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const { produto, quantidade, capacidade } = formData;
    return produto && quantidade && capacidade;
  };

  const produtoOptions: FSelectOption[] = produtos.map((p) => ({
    label: p.nome,
    value: p.nome,
  }));

  const produtoSelecionado = produtos.find((p) => p.nome === formData.produto);

  return (
    <FContainer
      background="white"
      padding="medium"
      className={`rounded-lg shadow-sm ${className}`}
    >
      <FText variant="title" color="primary" className="mb-4 text-center">
        {editData ? "Editar Estoque" : "Cadastrar Estoque"}
      </FText>

      <FSelect
        options={produtoOptions}
        value={formData.produto}
        placeholder="Selecione o produto"
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, produto: value }))
        }
        className="mb-2"
      />

      {produtoSelecionado && (
        <FContainer className="mb-2 p-2 bg-farm-green-50 rounded">
          <FText variant="caption" color="secondary" className="mb-1">
            Código do Produto
          </FText>
          <FInput
            value={produtoSelecionado.codigo}
            editable={false}
            className="mb-2"
          />
          <FText variant="caption" color="secondary" className="mb-1">
            Preço por Unidade
          </FText>
          <FInput
            value={`R$ ${produtoSelecionado.preco.toFixed(2)}`}
            editable={false}
          />
        </FContainer>
      )}

      <FInput
        type="number"
        placeholder="Quantidade atual"
        value={formData.quantidade}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, quantidade: text }))
        }
        className="mb-2"
      />

      <FInput
        type="number"
        placeholder="Capacidade máxima"
        value={formData.capacidade}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, capacidade: text }))
        }
        className="mb-2"
      />

      {formData.quantidade && formData.capacidade && (
        <FContainer className="mb-2 p-2 bg-farm-amber-50 rounded">
          <FText variant="body" color="primary" className="text-center">
            Ocupação:{" "}
            {(
              (parseInt(formData.quantidade || "0") /
                parseInt(formData.capacidade || "1")) *
              100
            ).toFixed(1)}
            %
          </FText>
        </FContainer>
      )}

      <FButton
        variant="primary"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!isFormValid()}
        loading={loading}
        className="mt-2"
      >
        {editData ? "Atualizar" : "Cadastrar"}
      </FButton>

      {editData && (
        <FButton
          variant="secondary"
          size="medium"
          fullWidth
          onPress={resetForm}
          className="mt-2"
        >
          Limpar
        </FButton>
      )}
    </FContainer>
  );
};
