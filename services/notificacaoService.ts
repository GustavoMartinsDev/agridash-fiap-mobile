import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
  Unsubscribe,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
  idUsuario: string;
  tipo: string;
  idUsuarioLeitura?: string;
  dataLeitura?: string;
}

class NotificacaoService {
  private collection = collection(db, "notificacoes");

  escutarNotificacoesNaoLidas(
    usuarioId: string,
    callback: (notificacoes: Notificacao[]) => void
  ): Unsubscribe {
    try {
      const q = query(
        this.collection,
        where("lida", "==", false),
        where("idUsuario", "in", [usuarioId, ""])
      );

      return onSnapshot(
        q,
        (snapshot) => {
          const notificacoes = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              return {
                ...data,
                // Manter o id do campo interno, não o ID do documento
              } as Notificacao;
            })
            .sort(
              (a, b) =>
                new Date(b.dataCriacao).getTime() -
                new Date(a.dataCriacao).getTime()
            );

          callback(notificacoes);
        },
        (error) => {
          callback([]);
        }
      );
    } catch (error) {
      callback([]);
      return () => {};
    }
  }

  async marcarComoLida(
    notificacaoId: string,
    usuarioId: string
  ): Promise<void> {
    try {
      const q = query(
        this.collection,
        where("id", "==", parseInt(notificacaoId))
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Notificação não encontrada");
      }

      const docSnapshot = querySnapshot.docs[0];
      const notificacaoRef = doc(db, "notificacoes", docSnapshot.id);

      await updateDoc(notificacaoRef, {
        lida: true,
        idUsuarioLeitura: usuarioId,
        dataLeitura: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw new Error("Não foi possível marcar a notificação como lida");
    }
  }

  async marcarVariasComoLidas(
    notificacaoIds: string[],
    usuarioId: string
  ): Promise<void> {
    const batch = writeBatch(db);

    for (const notificacaoId of notificacaoIds) {
      try {
        // Buscar o documento pelo campo 'id' interno
        const q = query(
          this.collection,
          where("id", "==", parseInt(notificacaoId))
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const notificacaoRef = doc(db, "notificacoes", docSnapshot.id);

          batch.update(notificacaoRef, {
            lida: true,
            idUsuarioLeitura: usuarioId,
            dataLeitura: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Erro ao processar notificação ${notificacaoId}:`, error);
      }
    }

    await batch.commit();
  }

  async criarNotificacao(
    titulo: string,
    mensagem: string,
    usuarioId: string,
    tipo: string = "estoque"
  ): Promise<void> {
    try {
      // Buscar o último ID para criar um auto incremento
      const q = query(this.collection, orderBy("id", "desc"));
      const querySnapshot = await getDocs(q);

      let novoId = 1;
      if (!querySnapshot.empty) {
        const ultimaNotificacao = querySnapshot.docs[0].data() as Notificacao;
        novoId = (ultimaNotificacao.id || 0) + 1;
      }

      const novaNotificacao: Omit<
        Notificacao,
        "idUsuarioLeitura" | "dataLeitura"
      > = {
        id: novoId,
        titulo,
        mensagem,
        lida: false,
        dataCriacao: new Date().toISOString(),
        idUsuario: usuarioId,
        tipo,
      };

      await addDoc(this.collection, novaNotificacao);
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw new Error("Não foi possível criar a notificação");
    }
  }
}

export const notificacaoService = new NotificacaoService();
