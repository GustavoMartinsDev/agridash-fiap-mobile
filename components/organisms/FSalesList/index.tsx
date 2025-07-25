import React from "react";
import { FContainer, FText } from "../../atoms";
import { VendaData, BaseComponentProps } from "../../../types";

export interface FSalesListProps extends BaseComponentProps {
  vendas: VendaData[];
  emptyMessage?: string;
}

export const FSalesList: React.FC<FSalesListProps> = ({
  vendas,
  emptyMessage = "Nenhuma venda registrada.",
  className = "",
}) => {
  return (
    <FContainer
      background="white"
      padding="small"
      className={`rounded-lg min-h-[44px] ${className}`}
    >
      {vendas.length === 0 ? (
        <FText color="secondary">{emptyMessage}</FText>
      ) : (
        vendas.map((venda, index) => (
          <FContainer
            key={index}
            className="border-b border-farm-green-50 py-1"
          >
            <FText color="primary" className="text-base">
              {venda.produto} - {venda.quantidade} un. - R${" "}
              {venda?.valor?.toFixed(2)}
            </FText>
          </FContainer>
        ))
      )}
    </FContainer>
  );
};
