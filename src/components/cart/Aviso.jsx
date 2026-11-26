import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../../context/CartContext'

// Aviso visual curto no rodapé da tela ("Marguerita na sacola", "Pedido copiado!").
// O leitor de tela recebe a mesma informação pelo anúncio do CartContext, então aqui fica oculto para não repetir.
export default function Aviso() {
  const { aviso } = useCart()
  return (
    <div aria-hidden="true">
      <AnimatePresence>
        {aviso && (
          <motion.div
            key={aviso.id}
            className="aviso"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {aviso.txt}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
