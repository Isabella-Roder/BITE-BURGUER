import { MapPin, Search, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="app">
            <header className="header">
                <NavLink to="/" className="brand">
                    <span className="brand-logo">🍔</span>
                    <span className="brand-name">
                        BYTE<strong>BURGUER</strong>
                    </span>
                </NavLink>

                <p className="brand-tag">
                    MAIS QUE BURGUER,<br /> É OUTRO NÍVEL.
                </p>

                <nav className="nav">
                    <NavLink to="/" end>Início</NavLink>
                    <NavLink to="/carrinho">Pedido</NavLink>
                    <NavLink to="/admin/produtos/novo">Novo produto</NavLink>
                </nav>

                <div className="header-actions">
                    <button className="icon-btn" aria-label="Buscar">
                        <Search size={20} />
                    </button>

                    <div className="address">
                        <MapPin size={20} className="accent" />
                        <div>
                            <strong>Rua das Ideias, 102</strong>
                            <span>São Paulo - SP</span>
                        </div>
                    </div>

                    <div className="account">
                        <span className="avatar"><User size={22}/></span>
                        <div>
                            <span>Olá, Cliente!</span>
                            <strong>Minha conta</strong>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page">
                <main className="page-main">
                    <Outlet />
                </main>

                <aside className="order-sidebar">
                    <h2>Seu pedido</h2>
                </aside>
            </div>
        </div>
    );
}