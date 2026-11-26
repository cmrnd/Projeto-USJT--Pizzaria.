import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { LINK_TELEGRAM } from '../../config'
import { brl, copiar } from '../../lib/util'
import { IconeTelegram } from '../Icones'
import CartItem from './CartItem'

function montarMensagem(linhas, total, nome, obs) {
  let m = 'Olá! Gostaria de fazer um pedido 🍕\n\n'
  linhas.forEach((i) => { m += `• ${i.q}x ${i.nome} (${i.tam}) — ${brl(i.q * i.v)}\n` })
  m += `\n**Total: ${brl(total)}**`
  if (nome) m += `\n\nNome: ${nome}`
  if (obs) m += `\nEndereço/obs.: ${obs}`
  return m
}

// Gaveta da sacola. Usa <dialog> nativo: prende o foco, fecha com Esc e deixa o resto da página inerte.
export default function CartDrawer() {
  const { linhas, n, total, aberta, fechar, alterar, anuncio, mostrarAviso, anunciar } = useCart()
  const dlg = useRef(null)
  const itensRef = useRef(null)
  const abridor = useRef(null)
  const [nome, setNome] = useState('')
  const [obs, setObs] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const d = dlg.current
    if (aberta && !d.open) {
      abridor.current = document.activeElement
      setErro('')
      d.showModal()
    } else if (!aberta && d.open) {
      d.close()
      // Devolve o foco a quem abriu; se ele sumiu (sacola esvaziou), vai para o cardápio
      const volta = abridor.current?.isConnected && abridor.current.offsetParent ? abridor.current : document.getElementById('grid')
      volta?.focus()
    }
  }, [aberta])

  useEffect(() => { if (n) setErro('') }, [n])

  // Depois de alterar a quantidade, mantém o foco no mesmo botão (ou no próximo que sobrou)
  const aoAlterar = (k, d) => {
    alterar(k, d)
    requestAnimationFrame(() => {
      const box = itensRef.current
      const mesmo = box?.querySelector(`button[data-k="${CSS.escape(k)}"][data-d="${d}"]`)
      ;(mesmo || box?.querySelector('button') || dlg.current.querySelector('.fechar'))?.focus()
    })
  }

  const enviar = (e) => {
    if (!n) {
      e.preventDefault()
      setErro('Adicione pelo menos uma pizza antes de enviar o pedido.')
      return
    }
    // O link do Telegram pelo número não aceita mensagem pronta: copiamos o pedido para colar no chat
    copiar(montarMensagem(linhas, total, nome.trim(), obs.trim()))
    fechar()
    mostrarAviso('Pedido copiado! No Telegram, é só colar e enviar.', 5000)
    anunciar('Pedido copiado. No Telegram, é só colar e enviar.')
  }

  return (
    <dialog
      ref={dlg}
      className="gaveta"
      aria-labelledby="titulo-sacola"
      onCancel={(e) => { e.preventDefault(); fechar() }}
      onClick={(e) => { if (e.target === dlg.current) fechar() }}
    >
      <div className="g-head">
        <h2 id="titulo-sacola">Sua <em>sacola</em></h2>
        <button type="button" className="fechar" aria-label="Fechar sacola" onClick={fechar}><span aria-hidden="true">×</span></button>
      </div>
      <p className="sr-only" aria-live="polite">{aberta ? anuncio : ''}</p>
      <div className="g-itens" ref={itensRef}>
        {n === 0 ? (
          <div className="vazio"><b>A sacola está vazia</b>Escolha um sabor no cardápio e toque em Broto, Grande ou 2 litros.</div>
        ) : (
          <AnimatePresence initial={false}>
            {linhas.map((i) => <CartItem key={i.k} item={i} onAlterar={aoAlterar} />)}
          </AnimatePresence>
        )}
      </div>
      <form className="g-foot" noValidate onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="nome">Seu nome</label>
        <input id="nome" autoComplete="name" placeholder="Ex.: Ana" value={nome} onChange={(e) => setNome(e.target.value)} />
        <label htmlFor="obs">Endereço e observações</label>
        <textarea id="obs" rows={3} placeholder="Rua, número, bairro · sem cebola, troco para 100..." value={obs} onChange={(e) => setObs(e.target.value)} />
        <div className="total"><span>Total</span><strong>{brl(total)}</strong></div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <a className="btn btn-tele" href={LINK_TELEGRAM} target="_blank" rel="noopener noreferrer" onClick={enviar}>
          <IconeTelegram /> Enviar pedido no Telegram
        </a>
      </form>
    </dialog>
  )
}
