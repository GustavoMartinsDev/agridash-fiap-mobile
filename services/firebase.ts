import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Cooperado, Estoque, Venda } from "../types";
import { notificacaoService } from "./notificacaoService";

export const cooperadosService = {
  async getCooperados(): Promise<Cooperado[]> {
    const querySnapshot = await getDocs(collection(db, "cooperados"));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Cooperado
    );
  },

  async adicionarCooperado(cooperado: Omit<Cooperado, "id">): Promise<void> {
    await addDoc(collection(db, "cooperados"), cooperado);
  },
};

export const produtosService = {
  // Os produtos agora estão na coleção estoque
  async getProdutoByNome(nomeProduto: string): Promise<Estoque | null> {
    return estoqueService.getEstoquePorProduto(nomeProduto);
  },
};

export const estoqueService = {
  async getEstoque(): Promise<Estoque[]> {
    const querySnapshot = await getDocs(collection(db, "estoque"));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Estoque
    );
  },

  async getEstoquePorProduto(nomeProduto: string): Promise<Estoque | null> {
    const q = query(
      collection(db, "estoque"),
      where("nome_produto", "==", nomeProduto)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Estoque;
  },

  async adicionarEstoque(estoque: Omit<Estoque, "id">): Promise<void> {
    await addDoc(collection(db, "estoque"), estoque);
  },

  async atualizarEstoque(
    id: string,
    novaQuantidade: number,
    usuarioId?: string
  ): Promise<void> {
    try {
      // Buscar dados atuais do estoque antes da atualização
      const estoqueRef = doc(db, "estoque", id);
      const estoqueSnapshot = await getDoc(estoqueRef);

      if (!estoqueSnapshot.exists()) {
        throw new Error("Produto não encontrado no estoque");
      }

      const estoqueAtual = estoqueSnapshot.data() as Estoque;
      const quantidadeAnterior = estoqueAtual.quantidade_estoque;

      // Atualizar a quantidade
      await updateDoc(estoqueRef, {
        quantidade_estoque: novaQuantidade,
      });

      // Criar notificação sobre a alteração no estoque
      if (usuarioId) {
        const diferenca = novaQuantidade - quantidadeAnterior;
        const operacao = diferenca > 0 ? "adicionada" : "removida";
        const quantidadeDiferenca = Math.abs(diferenca);

        const titulo = "Estoque Atualizado";
        const mensagem = `${quantidadeDiferenca} unidade(s) ${operacao} do produto "${estoqueAtual.nome_produto}". Quantidade atual: ${novaQuantidade}`;

        await notificacaoService.criarNotificacao(
          titulo,
          mensagem,
          "",
          "estoque"
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      throw error;
    }
  },

  async atualizarStatusEstoque(id: string, novoStatus: string): Promise<void> {
    const estoqueRef = doc(db, "estoque", id);
    await updateDoc(estoqueRef, {
      status_estoque: novoStatus,
    });
  },
};

export const vendasService = {
  async getVendas(): Promise<Venda[]> {
    const q = query(collection(db, "vendas"), orderBy("data", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          data: doc.data().data.toDate(),
        }) as Venda
    );
  },

  async adicionarVenda(venda: Omit<Venda, "id">): Promise<void> {
    await addDoc(collection(db, "vendas"), {
      ...venda,
      data: new Date(),
    });
  },

  onVendasChange(callback: (vendas: Venda[]) => void) {
    const q = query(collection(db, "vendas"), orderBy("data", "desc"));
    return onSnapshot(q, (querySnapshot) => {
      const vendas = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            data: doc.data().data.toDate(),
          }) as Venda
      );
      callback(vendas);
    });
  },
};
