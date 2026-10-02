import { Plus } from "lucide-react";
import type { Produto } from "../types/Produto"
import { formatarPreco } from "../utils/dinheiro";
import { useCarrinho } from "../context/CarrinhoContext";

type ProdutoCardProps = {
    produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
    
    const { adicionar } = useCarrinho();

    return (
        <article className="product">
            <div className="product-photo">
                <img src={produto.imgUrl ?? '/food-placeholder.svg'} alt={produto.nome} />
            </div>

            <div className="product-body">
                <div className="product-info">
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>
                    <strong className="product-price">{formatarPreco(produto.preco)}</strong>
                </div>

                <button className="add-btn" aria-label={`Adicionar ${produto.nome}`} onClick={() => adicionar(produto)}>
                    <Plus size={20} />
                </button>
            </div>
        </article>
    );
}