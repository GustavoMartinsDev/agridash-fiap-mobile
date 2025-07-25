import React, { useState } from "react";
import { Modal, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { FContainer, FText, FButton } from "../../atoms";
import { Notificacao } from "../../../services/notificacaoService";

interface FNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notificacoes: Notificacao[];
  onMarcarComoLida: (id: string) => void;
  onMarcarTodasComoLidas: () => void;
}

export const FNotificationModal: React.FC<FNotificationModalProps> = ({
  visible,
  onClose,
  notificacoes,
  onMarcarComoLida,
  onMarcarTodasComoLidas,
}) => {
  const { height } = Dimensions.get("window");
  const [marcandoLida, setMarcandoLida] = useState<string | null>(null);
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  const handleMarcarComoLida = async (id: string) => {
    console.log("Modal - ID recebido:", id, "Tipo:", typeof id);
    setMarcandoLida(id);
    try {
      await onMarcarComoLida(id);
    } finally {
      setMarcandoLida(null);
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    setMarcandoTodas(true);
    try {
      await onMarcarTodasComoLidas();
    } finally {
      setMarcandoTodas(false);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      // Se for um timestamp do Firestore (objeto com seconds)
      if (
        typeof dataString === "object" &&
        dataString !== null &&
        "seconds" in dataString
      ) {
        const data = new Date((dataString as any).seconds * 1000);
        return data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Se for uma string ISO
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return "Data inválida";
      }

      return data.toLocaleDateString("pt-BR", {
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

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "📢";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: height * 0.8,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <FContainer className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <FText variant="title" className="text-gray-800">
              🔔 Notificações ({notificacoes.length})
            </FText>
            <TouchableOpacity onPress={onClose}>
              <FText variant="body" className="text-gray-500 text-xl">
                ✕
              </FText>
            </TouchableOpacity>
          </FContainer>

          {/* Botão marcar todas como lidas */}
          {notificacoes.length > 0 && (
            <FContainer className="mb-4">
              <FButton
                variant="secondary"
                size="small"
                onPress={handleMarcarTodasComoLidas}
                className="bg-blue-100 border border-blue-300"
                disabled={marcandoTodas}
              >
                <FText className="text-blue-700 font-bold">
                  {marcandoTodas
                    ? "⏳ Marcando..."
                    : "✓ Marcar todas como lidas"}
                </FText>
              </FButton>
            </FContainer>
          )}

          {/* Lista de notificações */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: height * 0.6 }}
          >
            {notificacoes.length === 0 ? (
              <FContainer className="items-center py-8">
                <FText variant="body" className="text-gray-500 text-center">
                  🎉 Nenhuma notificação não lida!
                </FText>
                <FText
                  variant="caption"
                  className="text-gray-400 text-center mt-2"
                >
                  Você está em dia com suas notificações.
                </FText>
              </FContainer>
            ) : (
              notificacoes.map((notificacao) => (
                <FContainer
                  key={notificacao.id}
                  className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Header da notificação */}
                  <FContainer className="flex-row justify-between items-start mb-2">
                    <FContainer className="flex-1 mr-3">
                      <FContainer className="flex-row items-center mb-1">
                        <FText variant="caption" className="text-xl mr-2">
                          {getIconePorTipo(notificacao.tipo)}
                        </FText>
                        <FText
                          variant="body"
                          className="text-gray-800 font-bold flex-1"
                        >
                          {notificacao.titulo}
                        </FText>
                      </FContainer>
                      <FText variant="caption" className="text-gray-500">
                        {formatarData(notificacao.dataCriacao)}
                      </FText>
                    </FContainer>

                    <TouchableOpacity
                      onPress={() => handleMarcarComoLida(notificacao.id)}
                      disabled={marcandoLida === notificacao.id}
                      style={{
                        backgroundColor:
                          marcandoLida === notificacao.id
                            ? "#9ca3af"
                            : "#10b981",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <FText className="text-white font-bold text-sm">
                        {marcandoLida === notificacao.id ? "⏳" : "✓ Lida"}
                      </FText>
                    </TouchableOpacity>
                  </FContainer>

                  {/* Mensagem */}
                  <FText variant="caption" className="text-gray-700 leading-5">
                    {notificacao.mensagem}
                  </FText>
                </FContainer>
              ))
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
