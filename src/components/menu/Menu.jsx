import { useState } from 'react'
import { CATEGORIAS, ITENS } from '../../data/cardapio'
import CategoryTabs from './CategoryTabs'
import PizzaCard from './PizzaCard'

export default function Menu() {
  const [cat, setCat] = useState('tradicionais')
  const rotulo = CATEGORIAS.find((c) => c.id === cat).rotulo
  const lista = ITENS.filter((p) => p.cat === cat)

  return (
    <section className="sec" id="cardapio" aria-labelledby="titulo-cardapio">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Il menù</span>
            <h2 id="titulo-cardapio">Nosso <em>cardápio</em></h2>
          </div>
          <CategoryTabs ativa={cat} onChange={setCat} />
        </div>
        {/* key={cat}: ao trocar de aba, os cards entram de novo em sequência */}
        <div className="grid" id="grid" role="tabpanel" aria-labelledby={`tab-${cat}`} tabIndex={0} key={cat}>
          {lista.map((p, i) => <PizzaCard key={p.id} item={p} rotulo={rotulo} indice={i} />)}
        </div>
      </div>
    </section>
  )
}
