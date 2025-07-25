import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import {
  notificacaoService,
  Notificacao,
} from "../services/notificacaoService";

interface UseNotificacoesProps {
  usuarioId: string;
}

export const useNotificacoes = ({ usuarioId }: UseNotificacoesProps) => {
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState<
    Notificacao[]
  >([]);
  const notificacoesAnteriores = useRef<string[]>([]);

  useEffect(() => {
    if (!usuarioId) return;

    const unsubscribe = notificacaoService.escutarNotificacoesNaoLidas(
      usuarioId,
      (novasNotificacoes) => {
        try {
          setNotificacoesNaoLidas(novasNotificacoes);
        } catch (error) {
          console.error("Erro ao processar notificações:", error);
        }
      }
    );

    return () => unsubscribe();
  }, [usuarioId, 10000]);

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      console.log(
        "Hook - ID recebido:",
        notificacaoId,
        "Tipo:",
        typeof notificacaoId
      );
      if (!notificacaoId) {
        throw new Error("ID da notificação é obrigatório");
      }
      await notificacaoService.marcarComoLida(notificacaoId, usuarioId);
      // O listener do Firestore irá atualizar automaticamente a lista
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      Alert.alert("Erro", "Não foi possível marcar a notificação como lida.");
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const ids = notificacoesNaoLidas.map((n) => n.id);
      await notificacaoService.marcarVariasComoLidas(ids, usuarioId);
      // O listener do Firestore irá atualizar automaticamente a lista
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      Alert.alert(
        "Erro",
        "Não foi possível marcar as notificações como lidas."
      );
    }
  };

  return {
    notificacoesNaoLidas,
    quantidadeNaoLidas: notificacoesNaoLidas.length,
    marcarComoLida,
    marcarTodasComoLidas,
  };
};
