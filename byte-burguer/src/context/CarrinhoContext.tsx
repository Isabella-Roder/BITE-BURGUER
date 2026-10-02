import type { Produto } from "../types/Produto"
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ItemCarrinho = {
    produto: Produto;
    quantidade: number;
};

type CarrinhoContextValue = {
    itens: ItemCarrinho[];
    adicionar: (produto: Produto) => void;
    alterarQuantidade: (produtoId: string, delta: number) => void;
    remover: (produtoId: string) => void;
    limpar: () => void;
    total: number;
    totalItens: number;
};

const CarrinhoContext = createContext<CarrinhoContextValue | null>(null); 

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    const [itens, setItens] = useState<ItemCarrinho[]>([]);

    function adicionar(produto: Produto) {
        setItens((atual) => {
            const existe = atual.some((i) => i.produto.id === produto.id);
            if (existe) {
                return atual.map((i) => 
                    i.produto.id === produto.id ? {...i, quantidade: i.quantidade + 1} : i
                );
            }
            return [...atual, { produto, quantidade: 1 }];
        });
    }

    function alterarQuantidade(produtoId: string, delta: number) {
        setItens((atual) => 
            atual
                .map((i) => (i.produto.id === produtoId ? { ...i, quantidade: i.quantidade + delta } : i))
                .filter((i) => i.quantidade > 0)
        );
    }

    function remover(produtoId: string) {
        setItens((atual) => atual.filter((i) => i.produto.id !== produtoId));
    }

    function limpar() {
        setItens([]);
    }

    const total = useMemo(
        () => itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0),
        [itens]
    );

    const totalItens = useMemo(() => itens.reduce((soma, i) => soma + i.quantidade, 0), [itens]);

    return (
        <CarrinhoContext.Provider
            value={{ itens, adicionar, alterarQuantidade, remover, limpar, total, totalItens }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}

export function useCarrinho() {
    const ctx = useContext(CarrinhoContext);
    if (!ctx) {
        throw new Error('useCarrinho precisa estar dentro de CarrinhoProvider');
    }
    return ctx;
}