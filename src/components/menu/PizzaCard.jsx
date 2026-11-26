import { useState } from 'react'
import { motion } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { brl } from '../../lib/util'
import ItemThumb from './ItemThumb'

// Como cada tamanho é lido pelo leitor de tela
const NOME_TAM = { Broto: 'pizza broto', Grande: 'pizza grande', '2 litros': 'garrafa de 2 litros' }

function BotaoTamanho({ item, tam }) {
  const { adicionar } = useCart()
  const [ok, setOk] = useState(false)
  const preco = item.precos[tam]
  return (
    <motion.button
      type="button"
      className={`tam${ok ? ' ok' : ''}`}
      whileTap={{ scale: 0.95 }}
      aria-label={`Adicionar ${item.nome}, ${NOME_TAM[tam]}, ${brl(preco)}`}
      onClick={() => {
        adicionar(item.nome, tam)
        setOk(true)
        setTimeout(() => setOk(false), 1000)
      }}
    >
      <small>{tam}</small>
      <b>
        {brl(preco)}
        <motion.span className="mais" aria-hidden="true" animate={{ rotate: ok ? 360 : 0 }} transition={{ duration: 0.4 }}>
          {ok ? '✓' : '+'}
        </motion.span>
      </b>
    </motion.button>
  )
}

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
        <div className={`tams${tams.length === 1 ? ' um' : ''}`}>
          {tams.map((t) => <BotaoTamanho key={t} item={item} tam={t} />)}
        </div>
      </div>
    </motion.article>
  )
}
