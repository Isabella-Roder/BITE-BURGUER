export type TipoPedido = 'DELIVERY' | 'MESA';

export type StatusPedido = 'NOVO' | 'PREPARADO' | 'SAIU_PARA_ENTREGA' | 'ENTREGA' | 'CANCELADO';

export type ItemPedidoRequest = {
    produtoId: string;
    quantidade: number;
};

export type PedidoRequest = {
    cliente: string;
    telefone: string | null;
    endereco: string | null;
    complemento: string | null;
    mesa: number | null;
    tipo: TipoPedido;
    itens: ItemPedidoRequest[];
};

export type ItemPedidoResponse = {
    produtoId: string;
    produto: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
};

export type PedidoResponse = {
    id: string;
    cliente: string;
    telefone: string | null;
    endereco: string | null;
    complemento: string | null;
    mesa: number | null;
    tipo: TipoPedido;
    status: StatusPedido;
    total: number;
    data: string;
    itens: ItemPedidoResponse[];
};

export const PROXIMO_STATUS: Record<StatusPedido, StatusPedido | null> = {
    NOVO: 'PREPARADO',
    PREPARADO: 'SAIU_PARA_ENTREGA',
    SAIU_PARA_ENTREGA: 'ENTREGA',
    ENTREGA: null,
    CANCELADO: null,
};

export const STATUS_LABEL: Record<StatusPedido, string> = {
    NOVO: 'Novo',
    PREPARADO: 'Preparando',
    SAIU_PARA_ENTREGA: 'Saiu para entregar',
    ENTREGA: 'Entregue',
    CANCELADO: 'Cancelado',
};