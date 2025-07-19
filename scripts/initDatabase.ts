import {
  produtosService,
  cooperadosService,
  estoqueService,
} from "../services/firebase";

export const initializeDatabase = async () => {
  try {
    const produtosExistentes = await produtosService.getProdutos();
    const cooperadosExistentes = await cooperadosService.getCooperados();
    const estoqueExistente = await estoqueService.getEstoque();

    if (
      produtosExistentes.length > 0 ||
      cooperadosExistentes.length > 0 ||
      estoqueExistente.length > 0
    ) {
      console.log("Database already has data");
      return;
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const resetDatabase = async () => {
  console.log("Use Firebase console to clear data if needed");
};

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
