import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CardapioPage from './pages/CardapioPage';
import Layout from './components/Layout';
import CarrinhoPage from './pages/CarrinhoPage';
import CadastroProdutoPage from './pages/CadastroProdutoPage';

export default function App() {



  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path='/' element={<CardapioPage />} />
        <Route path='/carrinho' element={<CarrinhoPage />} />

        <Route path='/admin/produtos/novo' element={<CadastroProdutoPage />} />
      </Route>
    </Routes>
  );
}
