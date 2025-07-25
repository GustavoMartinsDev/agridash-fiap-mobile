import React, { useState, useMemo } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { FContainer, FText, FInput, FButton } from "../../atoms";
import { VendaData, BaseComponentProps } from "../../../types";
import { Icon } from "react-native-paper";
import { theme } from "../../../ui";

export interface FSalesListProps extends BaseComponentProps {
  vendas: VendaData[];
  emptyMessage?: string;
}

export const FSalesList: React.FC<FSalesListProps> = ({
  vendas,
  emptyMessage = "Nenhuma venda registrada.",
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<
    "produto" | "quantidade" | "valor"
  >("produto");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 5;

  const filteredVendas = useMemo(() => {
    let filtered = vendas.filter((venda) =>
      venda.produto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [vendas, searchTerm, sortField, sortDirection]);

  const paginatedVendas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVendas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVendas, currentPage]);

  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);

  const handleSort = (field: "produto" | "quantidade" | "valor") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: "produto" | "quantidade" | "valor") => {
    if (sortField !== field) return "swap-vertical";
    return sortDirection === "asc" ? "arrow-up" : "arrow-down";
  };

  return (
    <FContainer className={`bg-white rounded-lg shadow-sm ${className}`}>
      <FContainer className="p-4 border-b border-gray-200">
        <FInput
          placeholder="Buscar por produto..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="mb-4"
        />

        <FContainer className="flex-row justify-between items-center">
          <FText variant="body" className="text-gray-600 font-semibold">
            {filteredVendas.length}{" "}
            {filteredVendas.length === 1 ? "venda" : "vendas"}
          </FText>
          <FText variant="caption" className="text-gray-500">
            Página {currentPage} de {totalPages}
          </FText>
        </FContainer>
      </FContainer>

      {filteredVendas.length === 0 ? (
        <FContainer className="p-8 items-center">
          <Icon
            source="alert-circle-outline"
            size={48}
            color={theme.colors.gray[400]}
          />
          <FText variant="body" className="text-gray-500 mt-3 text-center">
            {searchTerm ? "Nenhuma venda encontrada" : emptyMessage}
          </FText>
        </FContainer>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FContainer className="min-w-full">
              <FContainer className="flex-row bg-gray-50 border-b border-gray-200">
                <TouchableOpacity
                  className="flex-1 px-4 py-3 flex-row items-center justify-between"
                  onPress={() => handleSort("produto")}
                >
                  <FText variant="body" className="text-gray-700 font-bold">
                    Produto
                  </FText>
                  <Icon
                    source={getSortIcon("produto")}
                    size={16}
                    color={theme.colors.gray[500]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-24 px-4 py-3 flex-row items-center justify-between border-l border-gray-200"
                  onPress={() => handleSort("quantidade")}
                >
                  <FText variant="body" className="text-gray-700 font-bold">
                    Qtd
                  </FText>
                  <Icon
                    source={getSortIcon("quantidade")}
                    size={16}
                    color={theme.colors.gray[500]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-32 px-4 py-3 flex-row items-center justify-between border-l border-gray-200"
                  onPress={() => handleSort("valor")}
                >
                  <FText variant="body" className="text-gray-700 font-bold">
                    Valor
                  </FText>
                  <Icon
                    source={getSortIcon("valor")}
                    size={16}
                    color={theme.colors.gray[500]}
                  />
                </TouchableOpacity>
              </FContainer>

              {paginatedVendas.map((venda, index) => (
                <FContainer
                  key={index}
                  className={`flex-row border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <FContainer className="flex-1 px-4 py-4 justify-center">
                    <FText variant="body" className="text-gray-800 font-medium">
                      {venda.produto}
                    </FText>
                  </FContainer>

                  <FContainer className="w-24 px-4 py-4 justify-center items-center border-l border-gray-100">
                    <FContainer className="bg-blue-100 px-2 py-1 rounded-full">
                      <FText
                        variant="caption"
                        className="text-blue-700 font-bold"
                      >
                        {venda.quantidade}
                      </FText>
                    </FContainer>
                  </FContainer>

                  <FContainer className="w-32 px-4 py-4 justify-center items-end border-l border-gray-100">
                    <FText variant="body" className="text-green-600 font-bold">
                      R$ {venda?.valor?.toFixed(2)}
                    </FText>
                  </FContainer>
                </FContainer>
              ))}
            </FContainer>
          </ScrollView>

          {totalPages > 1 && (
            <FContainer className="flex-row justify-between items-center p-4 border-t border-gray-200">
              <FButton
                variant="secondary"
                size="small"
                onPress={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${currentPage === 1 ? "opacity-50" : ""}`}
              >
                <FContainer className="flex-row items-center">
                  <Icon
                    source="chevron-left"
                    size={16}
                    color={theme.colors.gray[500]}
                  />
                  <FText className="ml-1 text-gray-600">Anterior</FText>
                </FContainer>
              </FButton>

              <FContainer className="flex-row items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <TouchableOpacity
                      key={pageNumber}
                      onPress={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        currentPage === pageNumber
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <FText
                        variant="caption"
                        className={`font-bold ${
                          currentPage === pageNumber
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {pageNumber}
                      </FText>
                    </TouchableOpacity>
                  );
                })}
              </FContainer>

              <FButton
                variant="secondary"
                size="small"
                onPress={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${currentPage === totalPages ? "opacity-50" : ""}`}
              >
                <FContainer className="flex-row items-center">
                  <FText className="mr-1 text-gray-600">Próximo</FText>
                  <Icon
                    source="chevron-right"
                    size={16}
                    color={theme.colors.gray[500]}
                  />
                </FContainer>
              </FButton>
            </FContainer>
          )}
        </>
      )}
    </FContainer>
  );
};
