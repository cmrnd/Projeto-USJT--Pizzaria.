import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/hero/Hero'
import Processo from './components/sections/Processo'
import Chamada from './components/sections/Chamada'
import Menu from './components/menu/Menu'

export default function App() {
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
    </>
  )
}
