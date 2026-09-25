import { BrowserRouter } from 'react-router-dom';
import './App.css';
import ProdutoCard from './components/ProdutoCard';
export default function App() {
  return (<BrowserRouter>

      <div className="product-grid" style={{ padding: 24 }}>
        <ProdutoCard
          produto={{
            id: '1',
            nome: 'Byte Bacon',
            descricao: 'Pão brioche, blend 180g, cheddar e bacon',
            imgUrl: null,
            preco: 32.9,
            ativo: true,
            categoria: 'LANCHES'
          }}
        />
      </div>

    </BrowserRouter>
  )
}
