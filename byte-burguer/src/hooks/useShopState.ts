import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { demos } from '../data/products';

export default function useShopState() {
    const [products, setProducts] = useState<Product[]>([]);
    const [source, setSource] = useState<'loading' | 'api' | 'demo'>('loading');
    const [cart, setCart] = useState<Record<string, number>>({});
    const [group, setGroup] = useState('Todos');
    const [search, setSearch] = useState('');
    const [delivery, setDelivery] = useState(true);
    const [review, setReview] = useState(false);
    const [notice, setNotice] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        let mounted = true;
        fetch('/api/produtos', { signal: controller.signal }).then(async (response) => {
            if (!response.ok)
                throw new Error('API indisponível');
            const data: unknown = await response.json();
            if (!Array.isArray(data) || !data.every(p => typeof p.id === 'string' && typeof p.nome === 'string' && typeof p.preco === 'number' && Number.isFinite(p.preco) && typeof p.categoria === 'string'))
                throw new Error('Resposta inválida');
            if (mounted) {
                setProducts(data.filter(p => p.ativo));
                setSource('api');
            }
        }).catch(() => { if (mounted) {
            setProducts(demos);
            setSource('demo');
        } }).finally(() => window.clearTimeout(timeout));
        return () => { mounted = false; controller.abort(); window.clearTimeout(timeout); };
    }, []);
    const items = products.filter(p => cart[p.id] > 0);
    const count = items.reduce((sum, p) => sum + cart[p.id], 0);
    const subtotal = items.reduce((sum, p) => sum + p.preco * cart[p.id], 0);
    function change(p: Product, delta: number) {
        setCart(current => ({ ...current, [p.id]: Math.max(0, (current[p.id] || 0) + delta) }));
        setReview(false);
        setNotice(delta > 0 ? `${p.nome} adicionado ao pedido.` : `Quantidade de ${p.nome} atualizada.`);
    }

    const [customer, setCustomer] = useState({ nome: '', telefone: '', endereco: '', complemento: '' });
    return { products, source, cart, setCart, group, setGroup, search, setSearch, delivery, setDelivery, review, setReview, notice, setNotice, items, count, subtotal, change, customer, setCustomer };
}
