import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext"
import React, { useState } from "react";
import type { TipoPedido } from "../types/Pedido";
import { cadastrarPedido } from "../services/pedidos";

export default function CheckoutPage() {
    
    const { itens, total, limpar } = useCarrinho();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState('');
    const [tipo, setTipo] = useState<TipoPedido>('DELIVERY');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [mese, setMesa] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    if (itens.length === 0) {
        return <p>Seu carrinho está vazio. Volte ao cardápio para adicionar itens.</p>;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnviando(true);
        setErro(null);

        try {
            await cadastrarPedido({
                cliente, 
                tipo,
                telefone: tipo === 'DELIVERY' ? telefone : null,
                endereco: tipo === 'DELIVERY' ? endereco : null,
                complemento: tipo === 'DELIVERY' ? complemento || null : null,
                mesa: tipo === 'MESA' ? Number(mese) : null,
                itens: itens.map((i) => ({ produtoId: i.produto.id, quantidade: i.quantidade }))
            });
            limpar();
            navigate('/confirmacao');
        } catch (e) {
            setErro((e as Error).message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h1>Finalizar pedido</h1>

            <label>
                Nome
                <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} maxLength={120} required />
            </label>

            <fieldset>
                <legend>Tipo</legend>
                <label>
                    <input type="radio" checked={tipo === 'DELIVERY'} onChange={() => setTipo('DELIVERY')} />
                    Delivery
                </label>
                <label>
                    <input type="radio" checked={tipo === 'MESA'} onChange={() => setTipo('MESA')} />
                    Retirar no local
                </label>
            </fieldset>

            {tipo === 'DELIVERY' ? (
                <>
                    <label>
                        Telefone
                        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="11999999999" required />
                    </label>

                    <label>
                        Endereço
                        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength={100} required />
                    </label>

                    <label>
                        Complemento (opcional)
                        <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} maxLength={100} />
                    </label>
                </>
            ) : (
                <label>
                    Número da mesa
                    <input type="number" min={1} value={mese} onChange={(e) => setMesa(e.target.value)} required />
                </label>
            )}

            <p className="checkout-total"><span>Total:</span><strong>{total.toLocaleString('pt-BR', {
                style: "currency",
                currency: "BRL",
            })}</strong></p>

            {erro && <p className="checkout-erro" role="alert">{erro}</p>}

            <button type="submit" disabled={enviando} className="btn-primary">
                {enviando ? 'Enviando...' : 'Confirmar pedido'}
            </button>
        </form>
    );
}