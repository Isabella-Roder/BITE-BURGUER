import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders, statusLabels } from '../services/store';
import type { Order } from '../services/store';
import { money } from '../utils/money';
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [revision, setRevision] = useState(0); const [last, setLast] = useState('');
  useEffect(() => {
    let active = true; let timer: ReturnType<typeof setTimeout>;
    async function load() {
      try { const result = await listOrders(status); if (active) { setOrders(result.sort((a, b) => b.dataHora.localeCompare(a.dataHora))); setError(''); setLast(new Date().toLocaleTimeString('pt-BR')); } }
      catch (e) { if (active) setError((e as Error).message); }
      finally { if (active) { setLoading(false); timer = setTimeout(load, 10000); } }
    }
    void load(); return () => { active = false; clearTimeout(timer); };
  }, [status, revision]);
  return <><div className="admin-title"><div><h1>Pedidos recebidos</h1><p>Atualização automática a cada 10 segundos{last && ` · Última: ${last}`}.</p></div><button onClick={() => setRevision(n => n + 1)}>Atualizar agora</button></div>
    <label className="admin-search">Filtrar por status<select value={status} onChange={e => { setLoading(true); setStatus(e.target.value); }}><option value="">Todos</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {loading ? <p role="status">Carregando pedidos…</p> : <div className="admin-orders">{orders.map(order => <Link className="order-row" key={order.id} to={`/painel/pedidos/${order.id}`}><div><span className="status">{statusLabels[order.status]}</span><h2>{order.nomeCliente}</h2><p>{new Date(order.dataHora).toLocaleString('pt-BR')} · {order.tipo === 'DELIVERY' ? 'Entrega' : order.tipo === 'MESA' ? `Mesa ${order.numeroMesa}` : 'Retirada'}</p><small>#{order.id.slice(0, 8)}</small></div><strong>{money(order.total)} →</strong></Link>)}{!orders.length && !error && <p className="empty">Nenhum pedido nesta seleção.</p>}</div>}
  </>;
}
