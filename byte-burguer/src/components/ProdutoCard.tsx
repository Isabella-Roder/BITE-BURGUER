import type { Produto } from "../types/Produto"
import { formatarPreco } from "../utils/dinheiro";

type ProdutoCardProps = {
    produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
    

    return (
        <article className="product">
            <div className="product-photo">
                <img src={produto.imgUrl ?? '/food/placeholder.svg'} alt={produto.nome} />
            </div>

            <div className="product-body">
                <span className="product-category">{produto.categoria}</span>
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>

                <div className="product-button">
                    <strong>{formatarPreco(produto.preco)}</strong>
                </div>
            </div>
        </article>
    )
}