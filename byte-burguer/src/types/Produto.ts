export type Categoria = 'LANCHES' | 'BEBIDAS' | 'SOBREMESAS';

export type Produto = {
    id: string;
    nome: string;
    descricao: string;
    imgUrl: string | null;
    preco: number;
    ativo: boolean;
    categoria: Categoria;
};