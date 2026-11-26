export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const qtdItens = (n) => `${n} ${n === 1 ? 'item' : 'itens'}`

// Gerador pseudoaleatório com semente: a mesma pizza é sempre desenhada igual
export const rng = (seed) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const hash = (s) => [...s].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 7)

// Copia texto para a área de transferência, com reserva para navegadores antigos
export function copiar(txt) {
  const reserva = () => {
    const t = document.createElement('textarea')
    t.value = txt
    document.body.appendChild(t)
    t.select()
    try { document.execCommand('copy') } catch { /* sem cópia */ }
    t.remove()
  }
  try {
    navigator.clipboard ? navigator.clipboard.writeText(txt).catch(reserva) : reserva()
  } catch {
    reserva()
  }
}
