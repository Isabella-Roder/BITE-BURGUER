import { useShop } from '../context/ShopContext.tsx';
import FoodImage from './FoodImage';
import { money } from '../utils/money';
const groups = ['Todos', 'Burgers', 'Combos', 'Bebidas'];
const drinkCategories = ['REFRIGERANTE', 'SUCO', 'MILKSHAKE'];
export default function Menu() {
  const { products, source, group, setGroup, search, setSearch, change } = useShop();
    const visible = products.filter(p => {
        const matches = group === 'Todos' || (group === 'Burgers' && p.categoria.startsWith('HAMBURGUER')) || (group === 'Combos' && p.categoria === 'COMBO') || (group === 'Bebidas' && drinkCategories.includes(p.categoria));
        return matches && `${p.nome} ${p.descricao}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
    });

return (          <section id="cardapio" className="menu-section">
            <div className="section-heading"><div><h2>Nosso cardápio</h2><p>Escolha os lanches e adicione ao seu pedido.</p></div></div>
            <div className="menu-tools"><div className="filters" aria-label="Categorias">{groups.map(g => <button key={g} className={g === group ? 'selected' : ''} aria-pressed={g === group} onClick={() => setGroup(g)}>{g}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar no cardápio" aria-label="Buscar no cardápio" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
            {source === 'demo' && <p className="demo-note">Cardápio demonstrativo · Não foi possível conectar à loja. Produtos e preços são exemplos.</p>}
            {source === 'loading' ? <div className="empty">Preparando o cardápio…</div> : visible.length === 0 ? <div className="empty">Nenhum produto encontrado nesta seleção.</div> : <div className="product-grid">{visible.map(p => <article className="product" key={p.id}><div className="product-photo"><FoodImage src={p.imgUrl} name={p.nome}/></div><div className="product-body"><h3>{p.nome}</h3><p>{p.descricao}</p><div className="product-bottom"><strong>{money(p.preco)}</strong><button className="add" aria-label={`Adicionar ${p.nome}`} onClick={() => change(p, 1)}>+</button></div></div></article>)}</div>}
          </section>);
}
