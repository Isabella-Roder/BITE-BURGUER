import { createOrder } from '../services/orders';
import type { OrderReceipt } from '../services/orders';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/product';
import { demos } from '../data/products';

export default function useShopState() {
    const [catalogRevision, setCatalogRevision] = useState(0);
    useEffect(() => {
        const refresh = () => setCatalogRevision(n => n + 1);
        window.addEventListener('catalog-updated', refresh);
        return () => window.removeEventListener('catalog-updated', refresh);
    }, []);
    const [products, setProducts] = useState<Product[]>([]);
    const [source, setSource] = useState<'loading' | 'api' | 'demo'>('loading');
    const [cart, setCart] = useState<Record<string, number>>({});
    const [group, setGroup] = useState('Todos');
    const [search, setSearch] = useState('');
    const [delivery, setDelivery] = useState(true);
    const [review, setReview] = useState(false);
    const [sending, setSending] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
    const sendingRef = useRef(false);
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
    }, [catalogRevision]);
    const items = products.filter(p => cart[p.id] > 0);
    const count = items.reduce((sum, p) => sum + cart[p.id], 0);
    const subtotal = items.reduce((sum, p) => sum + p.preco * cart[p.id], 0);
    function change(p: Product, delta: number) {
        if (sendingRef.current) return;
        setCart(current => ({ ...current, [p.id]: Math.max(0, (current[p.id] || 0) + delta) }));
        setReview(false);
        setNotice(delta > 0 ? `${p.nome} adicionado ao pedido.` : `Quantidade de ${p.nome} atualizada.`);
    }

    const [customer, setCustomer] = useState({ nome: '', telefone: '', endereco: '', complemento: '' });
    async function submitOrder() {
        if (sendingRef.current || count === 0) return;
        if (source !== 'api') {
            setOrderError('Os produtos de demonstração não podem ser enviados. Conecte-se à loja para pedir.');
            return;
        }
        sendingRef.current = true;
        setSending(true);
        setOrderError('');
        setReceipt(null);
        try {
            const result = await createOrder({
                nomeCliente: customer.nome.trim(),
                telefoneCliente: customer.telefone.replace(/\D/g, ''),
                tipo: delivery ? 'DELIVERY' : 'RETIRADA',
                endereco: delivery ? customer.endereco.trim() : null,
                complemento: delivery ? customer.complemento.trim() || null : null,
                itens: items.map(p => ({ produtoId: p.id, quantidade: cart[p.id] })),
            });
            setReceipt(result);
            setCart({});
            setReview(false);
            setNotice('Pedido enviado com sucesso.');
        } catch (error) {
            setOrderError(error instanceof TypeError || error instanceof SyntaxError
                ? 'Não foi possível confirmar o envio. Confira com a loja antes de tentar novamente.'
                : error instanceof Error ? error.message : 'Não foi possível enviar o pedido.');
        } finally {
            sendingRef.current = false;
            setSending(false);
        }
    }
    return { sending, orderError, receipt, submitOrder, products, source, cart, setCart, group, setGroup, search, setSearch, delivery, setDelivery, review, setReview, notice, setNotice, items, count, subtotal, change, customer, setCustomer };
}
