import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/hero/Hero'
import Processo from './components/sections/Processo'
import Chamada from './components/sections/Chamada'
import Menu from './components/menu/Menu'
import CartDrawer from './components/cart/CartDrawer'
import FabSacola from './components/cart/FabSacola'
import Aviso from './components/cart/Aviso'
import { useCart } from './context/CartContext'

export default function App() {
  const { anuncio, aberta } = useCart()
  return (
    <>
      <a className="pular" href="#cardapio">Pular para o cardápio</a>
      <Header />
      <main id="topo">
        <Hero />
        <Processo />
        <Menu />
        <Chamada />
      </main>
      <Footer />
      <FabSacola />
      <CartDrawer />
      <Aviso />
      {/* Com a sacola aberta, o anúncio sai pela região dentro dela */}
      <p className="sr-only" aria-live="polite">{aberta ? '' : anuncio}</p>
    </>
  )
}
