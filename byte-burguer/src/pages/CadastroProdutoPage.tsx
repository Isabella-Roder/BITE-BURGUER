import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIAS, type Categoria } from "../types/Produto";
import { cadastrarProduto } from "../services/produtos";

export default function CadastroProdutoPage() {
    
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState<Categoria>('LANCHES');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnviando(true);
        setErro(null);

        try {
            await cadastrarProduto({
                nome, 
                descricao,
                imgUrl: imgUrl.trim() || null,
                preco: Number(preco),
                categoria
            });

            navigate('/');
        } catch (e) {
            setErro((e as Error).message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Novo produto</h1>

            <label>
                Nome
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} required />
            </label>

            <label>
                Descrição
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={500} required/>
            </label>

            <label>
                URL da imagem (opcional)
                <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} maxLength={255} />
            </label>

            <label>
                Preço
                <input type="number" step="0.01" min="0.01" max="9999.99" value={preco} onChange={(e) => setPreco(e.target.value)} required/>
            </label>

            <label>
                Categoria
                <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
                    {CATEGORIAS.map((c) => (
                        <option value={c} key={c}>{c}</option>
                    ))}
                </select>
            </label>

            {erro && <p role="alert">{erro}</p>}

            <button type="submit" disabled={enviando}>
                {enviando ? 'Salvando...' : 'Cadastrar'}
            </button>
        </form>
    )
}