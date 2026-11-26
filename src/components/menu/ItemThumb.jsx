import { useEffect, useRef } from 'react'
import { desenhaPizza } from '../../lib/desenhaPizza'
import { desenhaBebida } from '../../lib/desenhaBebida'

// Imagem do item: usa a foto real se existir no cardápio; senão, desenha a pizza ou a garrafa no canvas
export default function ItemThumb({ item, tamanho }) {
  const ref = useRef(null)
  useEffect(() => {
    if (item.foto || !ref.current) return
    if (item.tipo === 'bebida') desenhaBebida(ref.current, item, tamanho)
    else desenhaPizza(ref.current, item, tamanho)
  }, [item, tamanho])

  if (item.foto) return <img src={item.foto} alt="" loading="lazy" />
  return <canvas ref={ref} aria-hidden="true" />
}
