import type { PedidoRequest, PedidoResponse, StatusPedido } from "../types/Pedido";

export async function cadastrarPedido(dados: PedidoRequest): Promise<PedidoResponse> {
    const response = await fetch(`/api/pedidos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        const erro = await response.json().catch(() => null);
        throw new Error(erro?.mensagem ?? `Erro ao enviar pedido (${response.status})`);
    }

    return response.json();
}

export async function listarPedidos(status?: StatusPedido): Promise<PedidoResponse[]> {
    const url = status ? `/api/pedidos?status=${status}` : '/api/pedidos';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro ao carregar pedidos (${response.status})`);
    }

    return response.json();
}

export async function atualizarStatusPedido(id: string, status: StatusPedido): Promise<PedidoResponse> {
    const response = await fetch(`/api/pedidos/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const erro = await response.json().catch(() => null);
        throw new Error(erro?.mensagem ?? `Erro ao atualizar status (${response.status})`);
    }

    return response.json();
}