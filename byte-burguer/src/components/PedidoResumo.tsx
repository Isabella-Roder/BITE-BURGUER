import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCarrinho } from "../context/CarrinhoContext";
import { formatarPreco } from "../utils/dinheiro";
import { Link } from "react-router-dom";

export default function PedidoResumo() {
    
    const { itens, alterarQuantidade, remover, limpar, total, totalItens } = useCarrinho();

    return (
        <>
            <div className="order-head">
                <h2><ShoppingCart size={20} /> Seu pedido</h2>
                {totalItens > 0 && <button className="link-btn" onClick={limpar}>Limpar tudo</button>}
            </div>

            {itens.length === 0 ? (
                <p className="order-empty">Seu carrinho está vazio.</p>    
            ) : (
                <>
                    <ul className="order-list">
                        {itens.map(({ produto, quantidade }) => (
                            <li key={produto.id} className="order-item">
                                <img src={produto.imgUrl ?? '/food-placeholder.svg'} alt="" />

                                <div className="order-item-info">
                                    <strong>{produto.nome}</strong>
                                    <span>{formatarPreco(produto.preco)}</span>
                                    <div className="qty">
                                        <button aria-label="Diminuir" onClick={() => alterarQuantidade(produto.id, -1)}>
                                            <Minus size={14} />
                                        </button>

                                        <span>{quantidade}</span>
                                        <button aria-label="Aumentar" onClick={() => alterarQuantidade(produto.id, 1)}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <button className="link-btn" aria-label={`Remover ${produto.nome}`} onClick={() => remover(produto.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="order-total">
                        <span>Total</span>
                        <strong>{formatarPreco(total)}</strong>
                    </div>

                    <Link to="/checkout" className="btn-primary">Finalizar pedido</Link>
                </>
            )}
        </>
    )

}