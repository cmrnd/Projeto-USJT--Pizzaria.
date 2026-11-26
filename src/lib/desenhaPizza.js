import { rng, hash } from './util'

// Desenha a pizza vista de cima num <canvas> (usada nos cards e na sacola).
// Não carrega imagens: tudo é gerado aqui, então é leve e cada sabor tem sua cara.

const BASES = { molho: '#B23620', choc: '#4A2618', leite: '#F3E6C8', queijo: '#F2D79A', doceleite: '#C4864A' }

const TOP = {
  queijo: { n: 9, f: 'blob', c: '#FFF4D8', s: 0.15 },
  tomate: { n: 6, f: 'fatia', c: '#D33A24', s: 0.12 },
  oregano: { n: 70, f: 'ponto', c: '#4E6B2E', s: 0.009 },
  manjericao: { n: 6, f: 'folha', c: '#3B7A2A', s: 0.14 },
  calabresa: { n: 10, f: 'disco', c: '#A9412A', s: 0.1 },
  cebola: { n: 7, f: 'anel', c: 'rgba(244,228,236,.9)', s: 0.085 },
  presunto: { n: 7, f: 'ret', c: '#E59C92', s: 0.14 },
  ovo: { n: 3, f: 'ovo', c: '#FFF8EA', s: 0.13 },
  ervilha: { n: 18, f: 'ponto', c: '#6E9A38', s: 0.026 },
  azeitona: { n: 8, f: 'anel', c: '#26211C', s: 0.045, w: 0.035 },
  parmesao: { n: 40, f: 'ponto', c: '#FFF6D2', s: 0.02 },
  milho: { n: 34, f: 'ponto', c: '#F2C230', s: 0.027 },
  alho: { n: 24, f: 'ponto', c: '#C78A3A', s: 0.03 },
  frango: { n: 24, f: 'fio', c: '#EFD2A2', s: 0.07 },
  catupiry: { n: 6, f: 'blob', c: '#FFFDF6', s: 0.13 },
  gorgonzola: { n: 10, f: 'blob', c: '#E9E7D8', s: 0.08 },
  provolone: { n: 8, f: 'blob', c: '#F0C96E', s: 0.11 },
  bacon: { n: 14, f: 'ret', c: '#B4513A', s: 0.085 },
  pepperoni: { n: 12, f: 'disco', c: '#B5341F', s: 0.1 },
  calabresaMoida: { n: 34, f: 'ponto', c: '#9C3A22', s: 0.03 },
  pimenta: { n: 18, f: 'ponto', c: '#E33B1B', s: 0.018 },
  carne: { n: 24, f: 'fio', c: '#7A3E24', s: 0.07 },
  lombo: { n: 7, f: 'ret', c: '#E6A594', s: 0.13 },
  atum: { n: 18, f: 'blob', c: '#C9B49A', s: 0.05 },
  champignon: { n: 8, f: 'cogumelo', c: '#D8C1A2', s: 0.08 },
  granulado: { n: 90, f: 'confeito', c: '#2E1A10', s: 0.03 },
  morango: { n: 8, f: 'fatia', c: '#D22A3A', s: 0.1 },
  banana: { n: 11, f: 'disco', c: '#F3E2A6', s: 0.08 },
  canela: { n: 60, f: 'ponto', c: '#8A4A20', s: 0.012 },
  goiabada: { n: 8, f: 'ret', c: '#9C1F2A', s: 0.11 },
  brigadeiro: { n: 6, f: 'disco', c: '#4A2A1A', s: 0.07 },
  coco: { n: 90, f: 'confeito', c: '#FFFAF0', s: 0.03 },
}

const TAU = Math.PI * 2

export function desenhaPizza(cv, pizza, S) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = S * dpr
  cv.height = S * dpr
  const g = cv.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, S, S)
  const R = S / 2, c = R, r = rng(hash(pizza.nome))
  const circ = (x, y, rad, fill) => { g.fillStyle = fill; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill() }
  const contorno = (raio, varia, pontos) => {
    g.beginPath()
    for (let i = 0; i <= pontos; i++) {
      const a = (i / pontos) * TAU, d = R * (raio + r() * varia)
      g[i ? 'lineTo' : 'moveTo'](c + Math.cos(a) * d, c + Math.sin(a) * d)
    }
    g.fill()
  }

  // sombra
  let gr = g.createRadialGradient(c + 4, c + 10, R * 0.6, c + 4, c + 10, R)
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
  circ(c + 4, c + 10, R, gr)
  // borda assada
  gr = g.createRadialGradient(c - R * 0.2, c - R * 0.2, R * 0.5, c, c, R * 0.92)
  gr.addColorStop(0, '#EDB872'); gr.addColorStop(0.7, '#CF8A42'); gr.addColorStop(1, '#8E5022')
  circ(c, c, R * 0.9, gr)
  for (let i = 0; i < 46; i++) {
    const a = r() * TAU, d = R * (0.8 + r() * 0.09)
    circ(c + Math.cos(a) * d, c + Math.sin(a) * d, 1 + r() * 3, `rgba(70,34,12,${0.2 + r() * 0.35})`)
  }
  // base
  g.fillStyle = BASES[pizza.base]
  contorno(0.76, 0.03, 40)
  if (pizza.base === 'molho') {
    g.fillStyle = '#F1D08A'
    contorno(0.6, 0.13, 48)
    for (let i = 0; i < 14; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * R * 0.6
      const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d, s = R * (0.06 + r() * 0.1)
      const b = g.createRadialGradient(x, y, 0, x, y, s)
      b.addColorStop(0, 'rgba(255,246,220,.9)'); b.addColorStop(1, 'rgba(255,246,220,0)')
      circ(x, y, s, b)
    }
    for (let i = 0; i < 26; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * R * 0.66
      circ(c + Math.cos(a) * d, c + Math.sin(a) * d, 1.5 + r() * 4, `rgba(176,104,40,${0.15 + r() * 0.3})`)
    }
  }
  if (pizza.base === 'choc') {
    for (let i = 0; i < 10; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * R * 0.6
      circ(c + Math.cos(a) * d, c + Math.sin(a) * d, R * (0.05 + r() * 0.08), 'rgba(120,70,40,.35)')
    }
  }
  // coberturas
  pizza.coberturas.forEach((k) => {
    const t = TOP[k]
    for (let i = 0; i < t.n; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * R * 0.66
      const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d, s = t.s * R * (0.8 + r() * 0.4)
      g.save(); g.translate(x, y); g.rotate(r() * TAU)
      g.fillStyle = t.c; g.strokeStyle = t.c
      switch (t.f) {
        case 'disco': circ(0, 0, s, t.c); circ(0, 0, s * 0.82, 'rgba(0,0,0,.1)'); circ(-s * 0.3, -s * 0.2, s * 0.18, 'rgba(255,240,220,.25)'); break
        case 'fatia':
          circ(0, 0, s, t.c); circ(0, 0, s * 0.72, 'rgba(255,170,140,.35)')
          for (let j = 0; j < 5; j++) { const b = (j / 5) * TAU; circ(Math.cos(b) * s * 0.42, Math.sin(b) * s * 0.42, s * 0.1, 'rgba(255,235,190,.8)') }
          break
        case 'anel': g.lineWidth = (t.w || 0.028) * R; g.beginPath(); g.arc(0, 0, s, 0, TAU); g.stroke(); break
        case 'ret': g.beginPath(); g.ellipse(0, 0, s, s * 0.62, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(-s * 0.6, -s * 0.15, s * 1.2, s * 0.12); break
        case 'folha':
          g.beginPath(); g.ellipse(0, 0, s, s * 0.46, 0, 0, TAU); g.fill()
          g.strokeStyle = 'rgba(200,240,170,.4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-s * 0.9, 0); g.lineTo(s * 0.9, 0); g.stroke()
          break
        case 'blob': {
          const b = g.createRadialGradient(0, 0, 0, 0, 0, s)
          b.addColorStop(0, t.c); b.addColorStop(0.75, t.c); b.addColorStop(1, 'rgba(255,255,255,0)')
          circ(0, 0, s, b)
          if (k === 'gorgonzola') { circ(s * 0.2, 0, s * 0.18, '#5D7A6A'); circ(-s * 0.3, s * 0.2, s * 0.12, '#5D7A6A') }
          break
        }
        case 'ponto': circ(0, 0, s, t.c); break
        case 'fio': g.beginPath(); g.ellipse(0, 0, s, s * 0.24, 0, 0, TAU); g.fill(); break
        case 'confeito': g.fillRect(-s / 2, -s * 0.16, s, s * 0.32); break
        case 'ovo': circ(0, 0, s, t.c); circ(s * 0.1, 0, s * 0.42, '#F2B51E'); break
        case 'cogumelo': circ(0, 0, s, t.c); g.fillStyle = 'rgba(110,80,50,.45)'; g.fillRect(-s * 0.15, -s * 0.1, s * 0.3, s); break
      }
      g.restore()
    }
  })
  // marcas do corte
  g.strokeStyle = 'rgba(90,45,15,.18)'; g.lineWidth = 1.2
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 4 + 0.2
    g.beginPath()
    g.moveTo(c + Math.cos(a) * R * 0.88, c + Math.sin(a) * R * 0.88)
    g.lineTo(c - Math.cos(a) * R * 0.88, c - Math.sin(a) * R * 0.88)
    g.stroke()
  }
}
