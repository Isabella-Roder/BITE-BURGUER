import { Route, Routes } from 'react-router-dom';
import './App.css';
import CardapioPage from './pages/CardapioPage';
import Layout from './components/Layout';
import CadastroProdutoPage from './pages/CadastroProdutoPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmacaoPage from './pages/ConfirmacaoPage';
import AdminPedidosPage from './pages/AdminPedidosPage';

export default function App() {



  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' element={<CardapioPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/confirmacao' element={<ConfirmacaoPage />}/>
        <Route path='/admin/produtos/novo' element={<CadastroProdutoPage />} />
        <Route path='/admin/pedidos' element={<AdminPedidosPage />} />
      </Route>
    </Routes>
  );
}
