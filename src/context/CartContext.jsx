import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ITEM_POR_NOME } from '../data/cardapio'
import { brl, qtdItens } from '../lib/util'

// Estado da sacola, aviso flutuante e anúncios para leitor de tela.
const CartContext = createContext(null)
const CHAVE = 'forno-da-casa:sacola'

function reducer(itens, acao) {
  switch (acao.tipo) {
    case 'adicionar': {
      const k = `${acao.nome}|${acao.tam}`
      const atual = itens.find((i) => i.k === k)
      if (atual) return itens.map((i) => (i.k === k ? { ...i, q: i.q + 1 } : i))
      return [...itens, { k, nome: acao.nome, tam: acao.tam, q: 1 }]
    }
    case 'alterar':
      return itens.map((i) => (i.k === acao.k ? { ...i, q: i.q + acao.d } : i)).filter((i) => i.q > 0)
    case 'limpar':
      return []
    default:
      return itens
  }
}

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || '[]')
    // Ignora itens que não existem mais no cardápio
    if (!Array.isArray(salvo)) return []
    // Sacolas antigas usavam "Meia": agora o tamanho se chama "Broto"
    return salvo
      .map((i) => (i.tam === 'Meia' ? { ...i, tam: 'Broto', k: `${i.nome}|Broto` } : i))
      .filter((i) => ITEM_POR_NOME[i.nome]?.precos[i.tam] && i.q > 0)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [itens, dispatch] = useReducer(reducer, undefined, carregar)
  const [aberta, setAberta] = useState(false)
  const [aviso, setAviso] = useState(null)
  const [anuncio, setAnuncio] = useState('')
  const tAviso = useRef()

  useEffect(() => {
    try { localStorage.setItem(CHAVE, JSON.stringify(itens)) } catch { /* armazenamento indisponível */ }
  }, [itens])

  const linhas = useMemo(
    () => itens.map((i) => ({ ...i, v: ITEM_POR_NOME[i.nome].precos[i.tam] })),
    [itens],
  )
  const n = linhas.reduce((s, i) => s + i.q, 0)
  const total = linhas.reduce((s, i) => s + i.q * i.v, 0)

  const anunciar = useCallback((txt) => {
    setAnuncio('')
    setTimeout(() => setAnuncio(txt), 50)
  }, [])

  const mostrarAviso = useCallback((txt, ms = 2600) => {
    clearTimeout(tAviso.current)
    setAviso({ txt, id: Date.now() })
    tAviso.current = setTimeout(() => setAviso(null), ms)
  }, [])

  const adicionar = useCallback((nome, tam) => {
    dispatch({ tipo: 'adicionar', nome, tam })
    const novoN = n + 1
    mostrarAviso(`${nome} (${tam.toLowerCase()}) na sacola`)
    anunciar(`${nome}, ${tam.toLowerCase()}, na sacola. ${qtdItens(novoN)} no total.`)
  }, [n, mostrarAviso, anunciar])

  const alterar = useCallback((k, d) => {
    const it = linhas.find((i) => i.k === k)
    if (!it) return
    dispatch({ tipo: 'alterar', k, d })
    const q = it.q + d
    const novoTotal = total + d * it.v
    anunciar(q > 0 ? `${it.nome}: ${q} na sacola. Total ${brl(novoTotal)}.` : `${it.nome} removida. Total ${brl(novoTotal)}.`)
  }, [linhas, total, anunciar])

  const valor = {
    linhas, n, total, aberta, aviso, anuncio,
    adicionar, alterar, limpar: () => dispatch({ tipo: 'limpar' }),
    abrir: () => setAberta(true), fechar: () => setAberta(false),
    mostrarAviso, anunciar,
  }
  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
