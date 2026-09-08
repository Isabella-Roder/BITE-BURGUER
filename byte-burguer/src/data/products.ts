import type { Product } from '../types/product';
export const burgerImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85';
export const demos: Product[] = [
    { id: 'demo-1', nome: 'Byte Bacon', descricao: 'Blend artesanal, bacon crocante, cheddar e nosso molho especial.', preco: 29.9, imgUrl: burgerImage, categoria: 'HAMBURGUER_ARTESANAL', ativo: true },
    { id: 'demo-2', nome: 'Mega Code Burger', descricao: 'Dois hambúrgueres, cheddar e cebola caramelizada.', preco: 37.9, imgUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=800&q=85', categoria: 'HAMBURGUER_ARTESANAL', ativo: true },
    { id: 'demo-3', nome: 'Cheese Kernel', descricao: 'Hambúrguer, queijo derretido, picles e molho da casa.', preco: 26.9, imgUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=85', categoria: 'HAMBURGUER_CLASSICO', ativo: true },
    { id: 'demo-4', nome: 'Combo Debug', descricao: 'Byte Bacon + batata crocante + refrigerante.', preco: 39.9, imgUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=85', categoria: 'COMBO', ativo: true },
    { id: 'demo-5', nome: 'Combo Full Stack', descricao: 'Mega Code + batata crocante + refrigerante.', preco: 47.9, imgUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=85', categoria: 'COMBO', ativo: true },
    { id: 'demo-6', nome: 'Refri geladinho', descricao: 'Refrigerante em lata, 350 ml.', preco: 6.9, imgUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=85', categoria: 'REFRIGERANTE', ativo: true },
];
