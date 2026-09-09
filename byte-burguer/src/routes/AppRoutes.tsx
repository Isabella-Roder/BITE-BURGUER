import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ProductsPage from '../pages/ProductsPage';
import ProductFormPage from '../pages/ProductFormPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import OrderPage from '../pages/OrderPage';
import NotFoundPage from '../pages/NotFoundPage';
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="cardapio" element={<MenuPage />} />
        <Route path="pedido" element={<OrderPage />} />
        <Route path="pedido/:id" element={<OrderDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="painel" element={<AdminLayout />}>
        <Route index element={<Navigate to="pedidos" replace />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="produtos/novo" element={<ProductFormPage />} />
        <Route path="produtos/:id/editar" element={<ProductFormPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="pedidos/:id" element={<OrderDetailPage internal />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
