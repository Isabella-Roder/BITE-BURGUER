import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext.tsx';
import { money } from '../utils/money';
import OrderPanel from './OrderPanel';
export default function SiteLayout() {
  const { count, subtotal, notice } = useShop();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const hasSidebar = pathname === '/' || pathname === '/cardapio';
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
    document.title = `${pathname === '/' ? 'Início' : pathname === '/cardapio' ? 'Cardápio' : pathname.startsWith('/pedido') ? 'Meu pedido' : 'Página não encontrada'} | Byte Burguer`;
  }, [pathname]);
  return (<>      <header className="header">
        <Link className="brand" to="/" aria-label="Byte Burguer — início"><span className="brand-icon" aria-hidden="true"><i /><i /><i /></span><span>BYTE<strong>BURGUER</strong></span></Link>
        <span className="brand-tag">HAMBURGUERIA<br />CARDÁPIO ONLINE</span>
        <nav aria-label="Navegação principal">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/cardapio">Cardápio</NavLink>
          <NavLink to="/pedido">Meu pedido <span className="nav-count">{count}</span></NavLink>
        </nav>
        <div className="header-note">Entrega ou retirada</div>
      </header>

    <main ref={main} tabIndex={-1} className={`layout${hasSidebar ? '' : ' layout-single'}`}>
      <div className="catalog"><Outlet /><footer>© {new Date().getFullYear()} Byte Burguer <Link to="/painel">Painel da loja</Link></footer></div>
      {hasSidebar && <OrderPanel />}
    </main>
    <div className="sr-only" role="status" aria-live="polite">{notice}</div>
    {hasSidebar && <Link className="mobile-cart" to="/pedido"><span>Ver meu pedido · {count} {count === 1 ? 'item' : 'itens'}</span><strong>{money(subtotal)} →</strong></Link>}
  </>);
}
