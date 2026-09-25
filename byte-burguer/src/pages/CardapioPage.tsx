import { useEffect, useState } from "react";
import type { Produto } from "../types/Produto";
import { listarProdutos } from "../services/produtos";
import ProdutoCard from "../components/ProdutoCard";

export default function CardapioPage() {
    
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        listarProdutos()
            .then(setProdutos)
            .catch((e: Error) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, []);

    if (carregando) {
        return <p>Carregando cardápio...</p>;
    }

    if (erro) {
        return <p>{erro}</p>
    }

    return (
        <div className="product-grid">
            {produtos.filter((p) => p.ativo).map((p) => (
                <ProdutoCard key={p.id} produto={p} />
            ))}
        </div>
    )
}