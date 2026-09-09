import type { Product } from '../types/product';

export const statusLabels = { NOVO: 'Novo', PREPARADO: 'Preparado', SAIU_PARA_ENTREGA: 'Saiu para entrega', ENTREGUE: 'Entregue' };
export type OrderStatus = keyof typeof statusLabels;
export type Order = {
  id: string; nomeCliente: string; telefoneCliente: string; endereco: string | null;
  complemento?: string; numeroMesa: number | null; tipo: 'DELIVERY' | 'RETIRADA' | 'MESA';
  status: OrderStatus; total: number; dataHora: string;
  itens: { produtoId: string; nomeProduto: string; quantidade: number; precoUnitario: number }[];
};
export type ProductInput = Omit<Product, 'id' | 'ativo'>;
export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api${url}`, options); }
  catch { throw new Error('Não foi possível conectar à loja. Tente novamente.'); }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detalhes?.length ? data.detalhes.join(' ') : data?.mensagem || `Não foi possível concluir a operação (${response.status}).`);
  if (data === null) throw new Error('A loja retornou uma resposta inválida.');
  return data as T;
}
const json = (method: string, data: unknown) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const listProducts = () => request<Product[]>('/produtos');
export const getProduct = (id: string) => request<Product>(`/produtos/${encodeURIComponent(id)}`);
export const saveProduct = (data: ProductInput, id?: string) => request<Product>(id ? `/produtos/${encodeURIComponent(id)}` : '/produtos', json(id ? 'PUT' : 'POST', data));
export const toggleProduct = (product: Product) => request<Product>(`/produtos/${product.id}/${product.ativo ? 'desativar' : 'ativar'}`, { method: 'PATCH' });
export const listOrders = (status: string) => request<Order[]>(`/pedidos${status ? `?status=${encodeURIComponent(status)}` : ''}`);
export const getOrder = (id: string) => request<Order>(`/pedidos/${encodeURIComponent(id)}`);
export const updateOrder = (id: string, status: OrderStatus) => request<Order>(`/pedidos/${encodeURIComponent(id)}/status`, json('PATCH', { status }));
