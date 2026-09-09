import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder, updateOrder, statusLabels } from '../services/store';
import type { Order, OrderStatus } from '../services/store';
import { money } from '../utils/money';
export default function OrderDetailPage({ internal = false }: { internal?: boolean }) {
  const { id } = useParams();
  return <OrderDetail key={id} id={id!} internal={internal} />;
}
function OrderDetail({ id, internal }: { id: string; internal: boolean }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (busy) return;
    let active = true; let timer: ReturnType<typeof setTimeout>;
    async function load() { try { const data = await getOrder(id!); if (active) { setOrder(data); setError(''); } } catch (e) { if (active) setError((e as Error).message); } finally { if (active) timer = setTimeout(load, 10000); } }
    void load(); return () => { active = false; clearTimeout(timer); };
  }, [id, revision, busy]);
  const next: OrderStatus | null = !order ? null : order.status === 'NOVO' ? 'PREPARADO' : order.status === 'PREPARADO' ? order.tipo === 'DELIVERY' ? 'SAIU_PARA_ENTREGA' : 'ENTREGUE' : order.status === 'SAIU_PARA_ENTREGA' ? 'ENTREGUE' : null;
  return <section className="order-detail"><Link to={internal ? '/painel/pedidos' : '/pedido'}>← {internal ? 'Pedidos' : 'Meu pedido'}</Link><div className="admin-title"><h1>Detalhes do pedido</h1><button disabled={busy} onClick={() => setRevision(n => n + 1)}>Atualizar</button></div>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {!order && !error && <p role="status">Carregando pedido…</p>}
    {order && <><p className="order-id">Número: {order.id}</p><span className="status">{statusLabels[order.status]}</span><p>{new Date(order.dataHora).toLocaleString('pt-BR')}</p><div className="detail-box"><h2>{order.nomeCliente}</h2><p>{order.telefoneCliente}</p><p>{order.tipo === 'DELIVERY' ? order.endereco : order.tipo === 'MESA' ? `Mesa ${order.numeroMesa}` : 'Retirada no local'}</p>{order.complemento && <p>{order.complemento}</p>}</div><div className="detail-box"><h2>Itens</h2>{order.itens.map((item, i) => <div className="detail-item" key={`${item.produtoId}-${i}`}><span>{item.quantidade} × {item.nomeProduto}</span><strong>{money(item.precoUnitario * item.quantidade)}</strong></div>)}<div className="detail-item"><strong>Total dos produtos</strong><strong>{money(order.total)}</strong></div></div>
      {internal && next && <button className="primary" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { setOrder(await updateOrder(order.id, next)); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }}>{busy ? 'Atualizando…' : `Marcar como ${statusLabels[next].toLowerCase()}`}</button>}
    </>}
  </section>;
}
