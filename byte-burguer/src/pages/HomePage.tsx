import { Link } from 'react-router-dom';
import { burgerImage } from '../data/products';
import Menu from '../components/Menu';
export default function HomePage() { return (<>          <section className="hero">
            <img className="hero-photo" src={burgerImage} alt="Hambúrguer artesanal com queijo, salada e pão de gergelim"/>
            <div className="hero-content">
              <span className="eyebrow">BYTE BURGUER</span>
              <h1>Hoje tem<br /><span>hambúrguer.</span></h1>
              <p>Com bacon, queijo extra ou só o clássico.<br />Escolha o seu e deixe o resto com a gente.</p>
              <Link className="primary hero-button" to="/cardapio">Ver o cardápio <span>→</span></Link>
            </div>
          </section>
<Menu /></>); }
