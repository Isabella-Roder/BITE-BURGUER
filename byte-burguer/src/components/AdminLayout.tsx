import { Link, NavLink, Outlet } from 'react-router-dom';
import '../admin.css';
export default function AdminLayout() {
  return <div className="admin-shell"><header className="admin-header"><Link to="/">BYTE BURGUER <small>Painel da loja</small></Link><nav aria-label="Painel da loja"><NavLink to="/painel/pedidos">Pedidos</NavLink><NavLink to="/painel/produtos">Produtos</NavLink><Link to="/">Ver cardápio</Link></nav></header><main className="admin-main"><Outlet /></main></div>;
}
