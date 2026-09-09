import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct, saveProduct } from '../services/store';
const categories = { HAMBURGUER_ARTESANAL: 'Hambúrguer artesanal', HAMBURGUER_CLASSICO: 'Hambúrguer clássico', CACHORRO_QUENTE: 'Cachorro-quente', REFRIGERANTE: 'Refrigerante', SUCO: 'Suco', MILKSHAKE: 'Milkshake' };
const blank = { nome: '', descricao: '', imgUrl: '', preco: '', categoria: 'HAMBURGUER_ARTESANAL' };
export default function ProductFormPage() {
  const { id } = useParams();
  return <ProductForm key={id || 'novo'} id={id} />;
}
function ProductForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(blank); const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!id);
  useEffect(() => {
    let active = true;
    if (!id) return;
    getProduct(id).then(p => { if (active) { setForm({ nome: p.nome, descricao: p.descricao, imgUrl: p.imgUrl || '', preco: String(p.preco), categoria: p.categoria }); setLoaded(true); } }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  return <><Link to="/painel/produtos">← Produtos</Link><div className="admin-title"><h1>{id ? 'Editar produto' : 'Cadastrar produto'}</h1></div>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {loading ? <p>Carregando produto…</p> : <form className="admin-form" onSubmit={async e => { e.preventDefault(); if (saving || !loaded) return; setSaving(true); setError(''); try { await saveProduct({ ...form, preco: Number(form.preco) }, id); window.dispatchEvent(new Event('catalog-updated')); navigate('/painel/produtos'); } catch (e) { setError((e as Error).message); } finally { setSaving(false); } }}>
      <fieldset disabled={saving || !loaded}><label>Nome<input required maxLength={80} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></label><label>Descrição<textarea required maxLength={500} rows={4} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></label><label>Preço (R$)<input required type="number" min="0.01" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} /></label><label>Categoria<select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>{Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Endereço da imagem <span>(opcional)</span><input maxLength={255} placeholder="https://…" value={form.imgUrl} onChange={e => setForm({ ...form, imgUrl: e.target.value })} /></label><div className="admin-actions"><button className="primary" type="submit">{saving ? 'Salvando…' : 'Salvar produto'}</button><Link to="/painel/produtos">Cancelar</Link></div></fieldset>
    </form>}
  </>;
}
