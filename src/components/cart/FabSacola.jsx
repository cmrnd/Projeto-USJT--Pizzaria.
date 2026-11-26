import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { brl, qtdItens } from '../../lib/util'

// Botão flutuante da sacola: só no celular, quando há itens
export default function FabSacola() {
  const { n, total, abrir } = useCart()
  const [celular, setCelular] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const muda = () => setCelular(mq.matches)
    mq.addEventListener('change', muda)
    return () => mq.removeEventListener('change', muda)
  }, [])

  return (
    <AnimatePresence>
      {celular && n > 0 && (
        <motion.button
          type="button"
          className="btn btn-tomate fab"
          aria-haspopup="dialog"
          aria-label={`Ver sacola, ${qtdItens(n)}, total ${brl(total)}`}
          onClick={abrir}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
        >
          Ver sacola · {brl(total)}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
