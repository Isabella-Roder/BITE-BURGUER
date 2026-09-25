import type { Produto } from "../types/Produto";

export async function listarProdutos(): Promise<Produto[]> {
    const response = await fetch('/api/produtos');

    if (!response.ok) {
        throw new Error(`Erro ao carregar produtos (${response.status})`);
    }
    return response.json();
}