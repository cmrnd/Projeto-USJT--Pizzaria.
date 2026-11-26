import { useEffect } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { qtdItens, brl } from '../../lib/util'
import { IconeSacola, Logo } from '../Icones'

export default function Header() {
  const { n, total, abrir } = useCart()
  const pulo = useAnimationControls()

  // O botão da sacola "pula" quando um item entra
  useEffect(() => {
    if (n > 0) pulo.start({ scale: [1, 1.14, 1], transition: { duration: 0.45, ease: 'easeOut' } })
  }, [n, pulo])

  return (
    <header>
      <div className="wrap nav">
        <a href="#topo" className="logo" aria-label="Forno da Casa, início">
          <Logo />
          Forno da Casa
        </a>
        <nav aria-label="Principal">
          <ul>
            <li><a href="#processo">A casa</a></li>
            <li><a href="#cardapio">Cardápio</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        <motion.button
          animate={pulo}
          className="btn btn-sacola"
          aria-haspopup="dialog"
          aria-label={`Abrir sacola, ${qtdItens(n)}, total ${brl(total)}`}
          onClick={abrir}
        >
          <IconeSacola />
          <span className="rot">Sacola</span>
          <span className="qt">{n}</span>
        </motion.button>
      </div>
    </header>
  )
}
