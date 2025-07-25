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
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
  usuarioId: string;
  tipo: string;
  usuarioIdLeitura?: string;
  dataLeitura?: string;
}

class NotificacaoService {
  private collection = collection(db, "notificacoes");

  // Escutar notificações não lidas em tempo real
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
                id: doc.id,
                ...data,
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
    debugger;
    const notificacaoSnap = await getDocs(
      query(this.collection, where("id", "==", notificacaoId))
    );

    if (notificacaoSnap.empty) {
      throw new Error("Notificação não encontrada");
    }
    const notificacaoRef = doc(db, "notificacoes", notificacaoId);
    await updateDoc(notificacaoRef, {
      lida: true,
      usuarioIdLeitura: usuarioId,
    });
  }

  async marcarVariasComoLidas(
    notificacaoIds: string[],
    usuarioId: string
  ): Promise<void> {
    const batch = writeBatch(db);

    notificacaoIds.forEach((id) => {
      const notificacaoRef = doc(db, "notificacoes", id);
      batch.update(notificacaoRef, {
        lida: true,
        usuarioIdLeitura: usuarioId,
        dataLeitura: new Date().toISOString(),
      });
    });

    await batch.commit();
  }
}

export const notificacaoService = new NotificacaoService();
