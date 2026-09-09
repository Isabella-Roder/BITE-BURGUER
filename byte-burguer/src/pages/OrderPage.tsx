import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderPanel from '../components/OrderPanel';
export default function OrderPage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  return <section className="order-page"><h1>Meu pedido</h1><p>Confira os itens e preencha seus dados.</p><OrderPanel />
    <form className="tracking-form" onSubmit={e => { e.preventDefault(); navigate(`/pedido/${encodeURIComponent(code.trim())}`); }}>
      <h2>Já fez seu pedido?</h2><label>Número do pedido<input required value={code} onChange={e => setCode(e.target.value)} placeholder="Cole aqui o número recebido" /></label><button className="primary">Acompanhar pedido</button>
    </form>
  </section>;
}
