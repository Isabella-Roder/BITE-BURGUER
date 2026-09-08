import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <section className="empty"><h1>Página não encontrada</h1><p>Esse endereço não existe. Volte ao cardápio para continuar.</p><Link to="/cardapio">Ver cardápio →</Link></section>;
}
