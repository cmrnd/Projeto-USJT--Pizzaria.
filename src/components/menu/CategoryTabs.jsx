import { useRef } from 'react'
import { CATEGORIAS, ITENS } from '../../data/cardapio'

// Abas acessíveis: clique, setas, Home e End; só a aba ativa entra no Tab
export default function CategoryTabs({ ativa, onChange }) {
  const refs = useRef([])
  const escolher = (i) => {
    const n = CATEGORIAS.length
    const idx = (i + n) % n
    onChange(CATEGORIAS[idx].id)
    refs.current[idx]?.focus()
  }
  return (
    <div className="tabs" role="tablist" aria-label="Categorias de pizza">
      {CATEGORIAS.map((c, i) => {
        const sel = c.id === ativa
        return (
          <button
            key={c.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-controls="grid"
            aria-selected={sel}
            tabIndex={sel ? 0 : -1}
            className="tab"
            onClick={() => onChange(c.id)}
            onKeyDown={(e) => {
              const alvo = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CATEGORIAS.length - 1 }[e.key]
              if (alvo === undefined) return
              e.preventDefault()
              escolher(alvo)
            }}
          >
            {c.nome} <small>{ITENS.filter((p) => p.cat === c.id).length}</small>
          </button>
        )
      })}
    </div>
  )
}
