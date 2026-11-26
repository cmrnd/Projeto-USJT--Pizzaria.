import { motion } from 'motion/react'
import { brl } from '../../lib/util'
import ItemThumb from './ItemThumb'

// Card do cardápio: serve para pizzas (Broto e Grande) e bebidas (2 litros)
export default function PizzaCard({ item, rotulo, indice }) {
  const bebida = item.tipo === 'bebida'
  const tams = Object.keys(item.precos)
  const desc = item.ingredientes
  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.55, delay: indice * 0.045, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className={`foto${bebida ? ' bebida' : ''}`}>
        <span className="selo">{bebida ? `${item.grupo} · 2L` : rotulo}</span>
        <ItemThumb item={item} tamanho={bebida ? 190 : 250} />
      </div>
      <div className="corpo">
        <h3>{item.nome}</h3>
        <p>{desc.charAt(0).toUpperCase() + desc.slice(1)}.</p>
        {/* Só mostra os preços: o pedido é feito no chatbot do Telegram */}
        <dl className={`tams${tams.length === 1 ? ' um' : ''}`}>
          {tams.map((t) => (
            <div className="tam" key={t}>
              <dt>{t}</dt>
              <dd>{brl(item.precos[t])}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.article>
  )
}
