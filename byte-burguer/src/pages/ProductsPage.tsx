import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts, toggleProduct } from '../services/store';
import type { Product } from '../types/product';
import { money } from '../utils/money';
import FoodImage from '../components/FoodImage';
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const refresh = useCallback(async () => {
    try { setProducts(await listProducts()); setError(''); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    listProducts().then(data => { if (active) setProducts(data); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function toggle(p: Product) {
    setBusy(p.id); setError(''); setNotice('');
    try { const updated = await toggleProduct(p); window.dispatchEvent(new Event('catalog-updated')); setProducts(current => current.map(item => item.id === p.id ? updated : item)); setNotice(`${p.nome} ${updated.ativo ? 'ativado' : 'desativado'}.`); }
    catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  }
  const visible = products.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
  return <><div className="admin-title"><div><h1>Produtos</h1><p>Cuide do que aparece no cardápio.</p></div><Link className="primary" to="/painel/produtos/novo">Cadastrar produto</Link></div>
    <label className="admin-search">Buscar produto<input value={search} onChange={e => setSearch(e.target.value)} type="search" placeholder="Nome do produto" /></label>
    {error && <div className="admin-error" role="alert">{error} <button onClick={() => void refresh()}>Tentar novamente</button></div>}
    <p role="status">{notice}</p>
    {loading ? <p role="status">Carregando produtos…</p> : <div className="admin-products">{visible.map(p => <article className="admin-product" key={p.id}><FoodImage src={p.imgUrl} name={p.nome} /><div><span className={`status ${p.ativo ? 'available' : ''}`}>{p.ativo ? 'Ativo' : 'Desativado'}</span><h2>{p.nome}</h2><p>{p.descricao}</p><strong>{money(p.preco)}</strong></div><div className="admin-actions"><Link to={`/painel/produtos/${p.id}/editar`}>Editar</Link><button disabled={!!busy} onClick={() => void toggle(p)}>{busy === p.id ? 'Salvando…' : p.ativo ? 'Desativar' : 'Ativar'}</button></div></article>)}{!visible.length && !error && <p className="empty">Nenhum produto encontrado. Cadastre um produto para começar.</p>}</div>}
  </>;
}
