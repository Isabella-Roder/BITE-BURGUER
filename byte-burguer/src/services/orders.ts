export type OrderReceipt = {
  id: string;
  total: number;
  status: string;
};
export type CreateOrder = {
  nomeCliente: string;
  telefoneCliente: string;
  tipo: 'DELIVERY' | 'RETIRADA';
  endereco: string | null;
  complemento: string | null;
  itens: { produtoId: string; quantidade: number }[];
};

export async function createOrder(order: CreateOrder): Promise<OrderReceipt> {
  const response = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detalhes?.length ? data.detalhes.join(' ') : data.mensagem || 'Não foi possível enviar o pedido.');
  }
  return data;
}
