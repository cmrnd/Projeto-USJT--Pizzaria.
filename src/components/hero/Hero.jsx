import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { LINK_TELEGRAM } from '../../config'
import { MENOR_PRECO, PIZZAS } from '../../data/cardapio'
import { brl } from '../../lib/util'
import { IconeTelegram } from '../Icones'

// O 3D (three.js) é carregado à parte: o texto aparece na hora e a cena chega em seguida
const PizzaScene = lazy(() => import('./PizzaScene'))

const temWebGL = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
})()

const entrada = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.08 } },
}
const item = {
  oculto: { opacity: 0, y: 24 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const reduz = useReducedMotion()
  const [animOn, setAnimOn] = useState(!reduz)
  // 0 com o hero inteiro na tela, 1 quando ele sai por cima
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, reduz ? 0 : -60])
  const opTexto = useTransform(scrollYProgress, [0, 1], [1, reduz ? 1 : 0.2])

  return (
    <section className="hero" id="hero" ref={ref} aria-labelledby="titulo-hero">
      <div className="wrap hero-grid">
        <motion.div className="hero-txt" style={{ y: yTexto, opacity: opTexto }}>
          <motion.div variants={entrada} initial="oculto" animate="visivel">
            <motion.p variants={item} className="eyebrow">Pizzaria · Impasto di lunga lievitazione</motion.p>
            <motion.h1 variants={item} id="titulo-hero">Pizza <em>di casa,</em> direto do forno.</motion.h1>
            <motion.p variants={item} className="hero-lede">
              Massa de longa fermentação, molho de tomate artesanal e muito queijo. Monte seu pedido no cardápio e envie pelo Telegram em um toque.
            </motion.p>
            <motion.div variants={item} className="hero-ctas">
              <a className="btn btn-tomate" href="#cardapio">Ver cardápio</a>
              <a className="btn btn-linha" href={LINK_TELEGRAM} target="_blank" rel="noopener noreferrer">
                <IconeTelegram /> Pedir no Telegram
              </a>
            </motion.div>
            <motion.div variants={item} className="hero-dados">
              <div><strong>{PIZZAS.length}</strong><span>sabores</span></div>
              <div><strong>2</strong><span>tamanhos: broto e grande</span></div>
              <div><strong>{brl(MENOR_PRECO)}</strong><span>a partir de</span></div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="palco">
          {temWebGL ? (
            <Suspense fallback={<div className="palco-fallback" aria-hidden="true" />}>
              <PizzaScene progresso={scrollYProgress} animOn={animOn} />
            </Suspense>
          ) : (
            <div className="palco-fallback" aria-hidden="true" />
          )}
          {temWebGL && (
            <>
              <p className="legenda-3d">Arraste o mouse sobre a pizza · role a página para puxar a fatia</p>
              <button type="button" className="pausar" aria-pressed={!animOn} onClick={() => setAnimOn((v) => !v)}>
                <span aria-hidden="true">{animOn ? '❚❚' : '▶'}</span> {animOn ? 'Pausar animação' : 'Retomar animação'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
