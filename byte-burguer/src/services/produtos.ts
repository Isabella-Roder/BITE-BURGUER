import type { NovoProduto, Produto } from "../types/Produto";

export async function listarProdutos(): Promise<Produto[]> {
    const response = await fetch('/api/produtos');

    if (!response.ok) {
        throw new Error(`Erro ao carregar produtos (${response.status})`);
    }
    return response.json();
}

export async function cadastrarProduto(dados: NovoProduto): Promise<Produto> {
    const response = await fetch(`/api/produtos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        throw new Error(`Erro ao cadastrar produto (${response.status})`);
    }

    return response.json();
}