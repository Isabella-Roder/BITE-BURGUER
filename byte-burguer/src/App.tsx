import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopProvider';
import AppRoutes from './routes/AppRoutes';
import './App.css';
export default function App() {
  return <BrowserRouter><ShopProvider><AppRoutes /></ShopProvider></BrowserRouter>;
}
