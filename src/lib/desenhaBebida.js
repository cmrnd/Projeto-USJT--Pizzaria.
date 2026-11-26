// Desenha uma garrafa PET de 2 litros num <canvas>, no mesmo estilo dos desenhos das pizzas.
// Cores genéricas por sabor (sem logotipos de marca).

export function desenhaBebida(cv, item, S) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = S * dpr
  cv.height = S * dpr
  const g = cv.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, S, S)

  const suco = item.grupo === 'Suco'
  const cx = S * (suco ? 0.46 : 0.5), top = S * 0.07, H = S * 0.86
  const w = S * 0.15, nw = S * 0.045
  const y = (f) => top + H * f

  // sombra no chão
  let gr = g.createRadialGradient(cx, y(1), 0, cx, y(1), w * 1.8)
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr
  g.beginPath(); g.ellipse(cx, y(1), w * 1.8, w * 0.35, 0, 0, Math.PI * 2); g.fill()

  // fruta cortada ao lado da garrafa (sucos)
  if (suco) {
    const fx = cx + w * 1.75, fy = y(0.9), fr = S * 0.11
    g.fillStyle = item.cor; g.beginPath(); g.arc(fx, fy, fr, Math.PI, 0); g.closePath(); g.fill()
    g.fillStyle = 'rgba(255,250,235,.55)'; g.beginPath(); g.arc(fx, fy, fr * 0.78, Math.PI, 0); g.closePath(); g.fill()
    g.fillStyle = item.cor; g.beginPath(); g.arc(fx, fy, fr * 0.66, Math.PI, 0); g.closePath(); g.fill()
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1
    for (let i = 1; i < 6; i++) { const a = Math.PI + (i * Math.PI) / 6; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + Math.cos(a) * fr * 0.62, fy + Math.sin(a) * fr * 0.62); g.stroke() }
  }

  // contorno da garrafa
  const corpo = new Path2D()
  corpo.moveTo(cx - nw, y(0.075))
  corpo.lineTo(cx - nw, y(0.12))
  corpo.bezierCurveTo(cx - nw, y(0.2), cx - w, y(0.2), cx - w, y(0.32))
  corpo.lineTo(cx - w, y(0.9))
  corpo.quadraticCurveTo(cx - w, y(0.99), cx - w * 0.5, y(0.995))
  corpo.quadraticCurveTo(cx, y(0.975), cx + w * 0.5, y(0.995))
  corpo.quadraticCurveTo(cx + w, y(0.99), cx + w, y(0.9))
  corpo.lineTo(cx + w, y(0.32))
  corpo.bezierCurveTo(cx + w, y(0.2), cx + nw, y(0.2), cx + nw, y(0.12))
  corpo.lineTo(cx + nw, y(0.075))
  corpo.closePath()

  g.save()
  g.clip(corpo)
  // plástico vazio no topo e bebida a partir do nível
  g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, 0, S, S)
  gr = g.createLinearGradient(cx - w, 0, cx + w, 0)
  gr.addColorStop(0, shade(item.cor, -0.35)); gr.addColorStop(0.45, item.cor); gr.addColorStop(1, shade(item.cor, -0.45))
  g.fillStyle = gr; g.fillRect(0, y(0.2), S, S)
  // bolhas (refrigerante) ou polpa (suco)
  g.fillStyle = suco ? 'rgba(255,240,200,.35)' : 'rgba(255,255,255,.35)'
  let s = 7
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < 26; i++) { g.beginPath(); g.arc(cx - w + rnd() * w * 2, y(0.22 + rnd() * 0.7), 0.6 + rnd() * (suco ? 1.6 : 1.2), 0, Math.PI * 2); g.fill() }
  // rótulo
  g.fillStyle = item.rotulo; g.fillRect(cx - w, y(0.47), w * 2, H * 0.24)
  if (suco) {
    g.fillStyle = item.cor; g.beginPath(); g.arc(cx, y(0.565), w * 0.42, 0, Math.PI * 2); g.fill()
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(cx - w * 0.12, y(0.55), w * 0.12, 0, Math.PI * 2); g.fill()
  } else {
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = Math.max(1.5, S * 0.012)
    g.beginPath(); g.moveTo(cx - w, y(0.6)); g.bezierCurveTo(cx - w * 0.3, y(0.5), cx + w * 0.3, y(0.68), cx + w, y(0.56)); g.stroke()
  }
  if (S >= 100) {
    g.fillStyle = suco ? '#2A201B' : 'rgba(255,255,255,.95)'
    g.font = `700 ${Math.round(S * 0.05)}px Archivo, system-ui, sans-serif`
    g.textAlign = 'center'; g.fillText('2L', cx, y(suco ? 0.69 : 0.69))
  }
  // gomos da garrafa e brilho do plástico
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1
  ;[0.38, 0.43, 0.77, 0.82].forEach((f) => { g.beginPath(); g.moveTo(cx - w, y(f)); g.lineTo(cx + w, y(f)); g.stroke() })
  gr = g.createLinearGradient(cx - w, 0, cx + w, 0)
  gr.addColorStop(0.08, 'rgba(255,255,255,0)'); gr.addColorStop(0.2, 'rgba(255,255,255,.45)'); gr.addColorStop(0.3, 'rgba(255,255,255,0)')
  gr.addColorStop(0.78, 'rgba(255,255,255,0)'); gr.addColorStop(0.86, 'rgba(255,255,255,.18)'); gr.addColorStop(0.92, 'rgba(255,255,255,0)')
  g.fillStyle = gr; g.fillRect(0, 0, S, S)
  g.restore()
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 1; g.stroke(corpo)

  // tampa e anel do gargalo
  g.fillStyle = item.tampa
  g.beginPath(); g.roundRect(cx - nw * 1.25, y(0), nw * 2.5, H * 0.065, 2); g.fill()
  g.fillStyle = 'rgba(0,0,0,.18)'
  for (let i = 1; i < 6; i++) g.fillRect(cx - nw * 1.25 + (i * nw * 2.5) / 6, y(0.005), 1, H * 0.055)
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(cx - nw * 1.35, y(0.075), nw * 2.7, Math.max(1.5, H * 0.008))
}

// Escurece (n < 0) ou clareia (n > 0) uma cor hex
function shade(hex, n) {
  const v = parseInt(hex.slice(1), 16)
  const f = (c) => Math.round(Math.min(255, Math.max(0, n < 0 ? c * (1 + n) : c + (255 - c) * n)))
  return `rgb(${f(v >> 16)},${f((v >> 8) & 255)},${f(v & 255)})`
}
