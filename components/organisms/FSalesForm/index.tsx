import React, { useState } from "react";
import { Alert } from "react-native";
import { FContainer, FButton } from "../../atoms";
import { FInputField } from "../../molecules";
import { VendaData, BaseComponentProps } from "../../../types";

export interface FSalesFormProps extends BaseComponentProps {
  onSubmit: (venda: VendaData) => void;
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
    valor: "",
  });

  const handleSubmit = () => {
    const { produto, quantidade, valor } = formData;

    if (!produto || !quantidade || !valor) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const vendaData: VendaData = {
      produto,
      quantidade: Number(quantidade),
      valor: Number(valor),
    };

    onSubmit(vendaData);

    setFormData({
      produto: "",
      quantidade: "",
      valor: "",
    });

    Alert.alert("Venda registrada!", "A venda foi adicionada ao histórico.");
  };

  const isFormValid = () => {
    const { produto, quantidade, valor } = formData;
    return produto && quantidade && valor;
  };

  return (
    <FContainer
      background="white"
      padding="medium"
      className={`rounded-lg shadow-sm ${className}`}
    >
      <FInputField
        placeholder="Produto"
        value={formData.produto}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, produto: text }))
        }
        className="mb-2"
      />

      <FInputField
        type="number"
        placeholder="Quantidade"
        value={formData.quantidade}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, quantidade: text }))
        }
        className="mb-2"
      />

      <FInputField
        type="number"
        placeholder="Valor (R$)"
        value={formData.valor}
        onChangeText={(text: string) =>
          setFormData((prev) => ({ ...prev, valor: text }))
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
