import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Cooperado, Produto, Estoque, Venda } from "../types";

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
  async getProdutos(): Promise<Produto[]> {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Produto
    );
  },

  async getProdutoByNome(nome: string): Promise<Produto | null> {
    const q = query(collection(db, "produtos"), where("nome", "==", nome));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Produto;
  },

  async adicionarProduto(produto: Omit<Produto, "id">): Promise<void> {
    await addDoc(collection(db, "produtos"), produto);
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
          data: doc.data().data.toDate(),
        }) as Estoque
    );
  },

  async getEstoquePorProduto(produto: string): Promise<Estoque | null> {
    const q = query(collection(db, "estoque"), where("produto", "==", produto));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
    } as Estoque;
  },

  async adicionarEstoque(produto: string, quantidade: number): Promise<void> {
    await addDoc(collection(db, "estoque"), {
      produto,
      quantidade,
      capacidade: 1000,
      data: new Date(),
    });
  },

  async atualizarEstoque(id: string, novaQuantidade: number): Promise<void> {
    const estoqueRef = doc(db, "estoque", id);
    await updateDoc(estoqueRef, {
      quantidade: novaQuantidade,
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
