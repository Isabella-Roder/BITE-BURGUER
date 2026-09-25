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

export const CATEGORIAS: Categoria[] = ['LANCHES', 'BEBIDAS', 'SOBREMESAS'];

export type NovoProduto = {
    nome: string;
    descricao: string;
    imgUrl: string | null;
    preco: number;
    categoria: Categoria;
}