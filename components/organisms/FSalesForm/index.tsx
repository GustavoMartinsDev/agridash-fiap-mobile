import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { FContainer, FButton, FSelect, FSelectOption } from "../../atoms";
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

  useEffect(() => {
    loadCooperados();
    loadProdutosEstoque();
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
      // Filtra apenas produtos com quantidade > 0 e status ativo
      const produtosComEstoque = data.filter(
        (item) => item.quantidade_estoque > 0 && item.status_estoque !== "baixo"
      );
      setProdutosEstoque(produtosComEstoque);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar produtos do estoque");
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

    if (estoque && Number(quantidade) > estoque.quantidade_estoque) {
      Alert.alert("Erro", "Quantidade insuficiente em estoque.");
      return;
    }

    try {
      const vendaData: Omit<any, "id"> = {
        produto,
        quantidade: Number(quantidade),
        valor,
        cooperado,
      };

      await vendasService.adicionarVenda(vendaData);

      if (estoque) {
        const novaQuantidade = estoque.quantidade_estoque - Number(quantidade);
        await estoqueService.atualizarEstoque(estoque.id, novaQuantidade);
      }

      setFormData({
        produto: "",
        quantidade: "",
        cooperado: "",
      });
      setValor(0);
      setEstoque(null);

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
    value: c.id,
  }));

  return (
    <FContainer
      background="white"
      padding="medium"
      className={`rounded-lg shadow-sm ${className}`}
    >
      <FSelect
        options={produtoOptions}
        value={formData.produto}
        placeholder="Selecione o produto"
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, produto: value }))
        }
        className="mb-2"
      />

      {estoque && (
        <FContainer className="mb-2 p-2 bg-farm-green-50 rounded">
          <FInputField
            label="Produto Selecionado"
            value={formData.produto}
            editable={false}
            className="mb-2"
          />
          <FInputField
            label="Quantidade em Estoque"
            value={estoque.quantidade_estoque.toString()}
            editable={false}
            className="mb-2"
          />
          <FInputField
            label="Capacidade do Estoque"
            value={estoque.capacidade_estoque.toString()}
            editable={false}
          />
        </FContainer>
      )}

      <FInputField
        type="number"
        placeholder="Quantidade"
        value={formData.quantidade}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, quantidade: text }))
        }
        className="mb-2"
      />

      {valor > 0 && (
        <FContainer className="mb-2 p-2 bg-farm-amber-50 rounded">
          <FInputField
            label="Valor da Venda"
            value={`R$ ${valor.toFixed(2)}`}
            editable={false}
          />
        </FContainer>
      )}

      <FSelect
        options={cooperadoOptions}
        value={formData.cooperado}
        placeholder="Selecione o cooperado"
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, cooperado: value }))
        }
        className="mb-2"
      />

      <FButton
        variant="primary"
        size="medium"
        fullWidth
        onPress={handleSubmit}
        disabled={!isFormValid()}
        loading={loading}
        className="mt-2"
      >
        Registrar
      </FButton>
    </FContainer>
  );
};
