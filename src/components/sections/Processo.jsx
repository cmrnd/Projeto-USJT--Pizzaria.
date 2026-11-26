import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

const ETAPAS = [
  ['Impasto', 'a massa', 'Farinha, água, sal e fermento descansam em longa fermentação até a massa ganhar sabor e leveza.'],
  ['Condimento', 'a cobertura', 'Molho de tomate artesanal, mussarela generosa e ingredientes escolhidos sabor por sabor.'],
  ['Cottura', 'o forno', 'Assada na hora do pedido, sai do forno com a borda dourada e o queijo ainda borbulhando.'],
]

export default function Processo() {
  const ref = useRef(null)
  // A linha vermelha se preenche conforme a seção passa pela tela
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section className="sec" id="processo" aria-labelledby="titulo-processo">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Como nasce cada pizza</span>
            <h2 id="titulo-processo">Do impasto <em>ao forno.</em></h2>
          </div>
          <p>Três etapas, sempre na mesma ordem. É assim que a massa fica leve por dentro e crocante na borda.</p>
        </div>
        <div className="etapas-box" ref={ref}>
        <div className="trilho" aria-hidden="true"><motion.span style={{ scaleX: escala }} /></div>
        <ol className="etapas">
          {ETAPAS.map(([nome, pt, txt], i) => (
            <motion.li
              key={nome}
              className="etapa"
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="num">ETAPA {i + 1}</span>
              <h3>{nome}</h3>
              <p className="pt">{pt}</p>
              <p>{txt}</p>
            </motion.li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}
