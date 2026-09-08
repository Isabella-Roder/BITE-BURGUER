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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
