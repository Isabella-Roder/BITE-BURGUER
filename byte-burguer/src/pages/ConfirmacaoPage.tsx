import { Link } from "react-router-dom";

export default function ConfirmacaoPage() {
    return (
        <div className="confirmacao">
            <h1>Pedido enviado!</h1>
            <p>Seu pedido foi recebido e já está sendo preparado.</p>
            <Link to="/">Voltar ao cardápio</Link>
        </div>
    )
}