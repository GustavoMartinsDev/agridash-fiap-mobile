import React from "react";
import { FContainer, FText } from "../../atoms";
import type { Estoque } from "../../../types";

interface FProductInfoProps {
  produto: Estoque;
  showOccupationOnly?: boolean;
  className?: string;
}

export const FProductInfo: React.FC<FProductInfoProps> = ({
  produto,
  showOccupationOnly = false,
  className = "",
}) => {
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

  const ocupacaoPercentual = (
    (produto.quantidade_estoque / produto.capacidade_estoque) *
    100
  ).toFixed(1);

  if (showOccupationOnly) {
    return (
      <FContainer
        className={`p-3 bg-success-50 rounded-lg border border-success-200 ${className}`}
      >
        <FContainer className="flex-row justify-between items-center">
          <FText variant="body" color="primary" className="font-bold">
            📊 Ocupação Atual
          </FText>
          <FText variant="title" className="text-success-600 font-bold">
            {ocupacaoPercentual}%
          </FText>
        </FContainer>
      </FContainer>
    );
  }

  return (
    <FContainer
      className={`p-3 rounded-lg border ${getStatusBgColor(
        produto.quantidade_estoque,
        produto.capacidade_estoque
      )} ${className}`}
    >
      <FContainer className="flex-row justify-between items-center mb-2">
        <FText variant="subtitle" color="primary" className="font-bold">
          📦 {produto.nome_produto}
        </FText>
        <FText
          variant="caption"
          className={`font-bold ${getStatusColor(
            produto.quantidade_estoque,
            produto.capacidade_estoque
          )}`}
        >
          {getStatusText(
            produto.quantidade_estoque,
            produto.capacidade_estoque
          )}
        </FText>
      </FContainer>

      <FContainer className="flex-row justify-between mb-2">
        <FText variant="caption" color="secondary">
          Atual: {produto.quantidade_estoque} unidades
        </FText>
        <FText variant="caption" color="secondary">
          Capacidade: {produto.capacidade_estoque} unidades
        </FText>
      </FContainer>

      <FContainer className="flex-row justify-between">
        <FText variant="caption" color="secondary">
          Ocupação: {ocupacaoPercentual}%
        </FText>
        <FText variant="caption" color="secondary">
          Status: {produto.status_estoque}
        </FText>
      </FContainer>
    </FContainer>
  );
};
