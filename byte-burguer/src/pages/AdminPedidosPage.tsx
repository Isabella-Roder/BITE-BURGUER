import { useEffect, useState } from "react";
import { STATUS_LABEL, type PedidoResponse, type StatusPedido } from "../types/Pedido"
import { atualizarStatusPedido, listarPedidos } from "../services/pedidos";
import { formatarPreco } from "../utils/dinheiro";

const FILTROS: (StatusPedido | 'TODOS')[] = ['TODOS', 'NOVO', 'PREPARADO', 'SAIU_PARA_ENTREGA', 'ENTREGA', 'CANCELADO'];

function proximoStatus(pedido: PedidoResponse): StatusPedido | null {
    switch (pedido.status) {
        case 'NOVO' :
            return 'PREPARADO';
        case 'PREPARADO' :
            return pedido.tipo === 'DELIVERY' ? 'SAIU_PARA_ENTREGA' : 'ENTREGA';
        case 'SAIU_PARA_ENTREGA' :
            return 'ENTREGA';
        default:
            return null;
    }
}

export default function AdminPedidosPage() {
    
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [filtro, setFiltro] = useState<StatusPedido | 'TODOS'>('TODOS');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

    function carregar() {
        setCarregando(true);
        setErro(null);

        listarPedidos(filtro === 'TODOS' ? undefined : filtro)
            .then(setPedidos)
            .catch((e: Error) => setErro(e.message))
            .finally(() => setCarregando(false));
    }

    useEffect(carregar, [filtro]);

    async function avancar(pedido: PedidoResponse) {
        const novo = proximoStatus(pedido);

        if (!novo) {
            return;
        }

        setAtualizandoId(pedido.id);

        try {
            const atualizando = await atualizarStatusPedido(pedido.id, novo);
            setPedidos((atual) => atual.map((p) => (p.id === atualizando.id ? atualizando : p)))
        } catch (e) {
            alert((e as Error).message);
        } finally {
            setAtualizandoId(null);
        }
    }

    return (
        <div className="admin-pedidos">
            <div className="admin-head">
                <h1>Pedidos</h1>
                <button className="link-btn" onClick={carregar}>Atualizar</button>
            </div>

            <div className="status-filtros">
                {FILTROS.map((f) => (
                    <button
                        key={f}
                        className={`status-filtro ${filtro === f ? 'ativo' : ''}`}
                        onClick={() => setFiltro(f)}
                    >
                        {f === 'TODOS' ? 'Todos' : STATUS_LABEL[f]}
                    </button>
                ))}
            </div>

            {carregando && <p>Carregando pedidos...</p>}
            {erro && <p className="checkout-erro" role="alert">{erro}</p>}

            {!carregando && !erro && pedidos.length === 0 && (
                <p className="order-empty">Nenhum pedido encontrado.</p>
            )}

            <ul className="pedido-list">
                {pedidos.map((pedido) => {
                    const novo = proximoStatus(pedido);

                    return (
                        <li className="pedido-card" key={pedido.id}>
                            <div className="pedido-card-head">
                                <div>
                                    <strong>{pedido.cliente}</strong>
                                    <span className={`status-badge status-${pedido.status.toLowerCase()}`}>
                                        {STATUS_LABEL[pedido.status]}
                                    </span>
                                </div>

                                <span>{new Date(pedido.data).toLocaleString('pt-BR')}</span>
                            </div>

                            <p className="pedido-entrega">
                                {pedido.tipo === 'DELIVERY'
                                    ? `Entrega: ${pedido.endereco}${pedido.complemento ? ` - ${pedido.complemento}` : ''}`
                                    : `Mesa ${pedido.mesa}`
                                }
                            </p>

                            <ul className="pedido-itens">
                                {pedido.itens.map((item) => (
                                    <li key={item.produtoId}>
                                        {item.quantidade}x {item.produto} — {formatarPreco(item.subtotal)}
                                    </li>
                                ))}
                            </ul>

                            <div className="pedido-card-footer">
                                <strong>{formatarPreco(pedido.total)}</strong>

                                {novo && (
                                    <button
                                        className="btn-primary"
                                        disabled={atualizandoId === pedido.id}
                                        onClick={() => avancar(pedido)}
                                    >
                                        {atualizandoId === pedido.id ? 'Atualizando...' : `Avançar para ${STATUS_LABEL[novo]}`}
                                    </button>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}