import { motion } from 'motion/react'
import { ITEM_POR_NOME } from '../../data/cardapio'
import { brl } from '../../lib/util'
import ItemThumb from '../menu/ItemThumb'

export default function CartItem({ item, onAlterar }) {
  const tam = item.tam.toLowerCase()
  return (
    <motion.div
      className="item"
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
    >
      <ItemThumb item={ITEM_POR_NOME[item.nome]} tamanho={48} />
      <div>
        <b>{item.nome}</b>
        <small>{item.tam} · {brl(item.v)}</small>
      </div>
      <div className="qtd">
        <button type="button" data-k={item.k} data-d="-1" aria-label={`Remover uma ${item.nome} ${tam}`} onClick={() => onAlterar(item.k, -1)}>−</button>
        <output aria-label="Quantidade">{item.q}</output>
        <button type="button" data-k={item.k} data-d="1" aria-label={`Adicionar mais uma ${item.nome} ${tam}`} onClick={() => onAlterar(item.k, 1)}>+</button>
      </div>
    </motion.div>
  )
}
