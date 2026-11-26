import * as THREE from 'three'
import { rng } from '../../lib/util'

// Monta a pizza 3D com formas simples (sem modelos para baixar):
// 8 fatias, cada uma com massa, recheio, borda e coberturas. A fatia 0 pode ser
// puxada para fora, esticando fios de queijo. Retorna o grupo e a função que anima.

const TAU = Math.PI * 2
const NF = 8

function canvasTex(S, desenha) {
  const c = document.createElement('canvas')
  c.width = c.height = S
  desenha(c.getContext('2d'), S)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function criarPizza() {
  const r = rng(42)
  const bola = (g, x, y, s, f) => { g.fillStyle = f; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill() }

  // Textura do recheio: molho por baixo, queijo derretido, pontos tostados e bolhas
  const texRecheio = canvasTex(512, (g, S) => {
    const h = S / 2
    g.fillStyle = '#A82A1A'; g.fillRect(0, 0, S, S)
    for (let i = 0; i < 200; i++) bola(g, r() * S, r() * S, 1 + r() * 4, `rgba(${r() < 0.5 ? '90,15,8' : '210,80,50'},${0.15 + r() * 0.25})`)
    for (let i = 0; i < 95; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * h * 0.84, x = h + Math.cos(a) * d, y = h + Math.sin(a) * d, s = 26 + r() * 54
      const b = g.createRadialGradient(x, y, 0, x, y, s)
      b.addColorStop(0, 'rgba(255,243,212,1)'); b.addColorStop(0.62, 'rgba(245,214,150,.97)'); b.addColorStop(1, 'rgba(238,196,120,0)')
      g.fillStyle = b; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill()
    }
    for (let i = 0; i < 140; i++) { const a = r() * TAU, d = Math.sqrt(r()) * h * 0.8; bola(g, h + Math.cos(a) * d, h + Math.sin(a) * d, 2 + r() * 10, `rgba(170,92,30,${0.1 + r() * 0.32})`) }
    for (let i = 0; i < 40; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * h * 0.75, x = h + Math.cos(a) * d, y = h + Math.sin(a) * d, s = 3 + r() * 6
      bola(g, x, y, s, 'rgba(140,70,20,.35)'); bola(g, x - 1, y - 1, s * 0.6, 'rgba(255,248,225,.8)')
    }
  })
  const texBorda = canvasTex(256, (g, S) => {
    g.fillStyle = '#D2904A'; g.fillRect(0, 0, S, S)
    for (let i = 0; i < 600; i++) bola(g, r() * S, r() * S, 1 + r() * 7, r() < 0.55 ? `rgba(105,50,18,${r() * 0.4})` : `rgba(250,212,150,${r() * 0.3})`)
    for (let i = 0; i < 30; i++) bola(g, r() * S, r() * S, 2 + r() * 4, 'rgba(45,20,8,.55)')
  })

  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...o })
  const M = {
    massa: mat(0xe0ae72, { roughness: 0.9 }),
    miolo: mat(0xf0d9ae, { roughness: 0.95, side: THREE.DoubleSide }),
    borda: mat(0xffffff, { map: texBorda, roughness: 0.85, side: THREE.DoubleSide }),
    molhoLado: mat(0x9e2616, { roughness: 0.5 }),
    recheio: mat(0xffffff, { map: texRecheio, roughness: 0.55 }),
    molhoCorte: mat(0xa82a1a, { roughness: 0.5, side: THREE.DoubleSide }),
    queijoCorte: mat(0xf3d08a, { roughness: 0.5, side: THREE.DoubleSide }),
    fio: mat(0xf6da92, { roughness: 0.45 }),
    pep: mat(0xa02c1c, { roughness: 0.45, side: THREE.DoubleSide }),
    folha: mat(0x3b7a2a, { roughness: 0.5, side: THREE.DoubleSide }),
    azeit: mat(0x1e1a16, { roughness: 0.3 }),
    mozz: mat(0xfff6e6, { roughness: 0.35 }),
  }

  // Perfil da borda (cornicione): uma elipse girada em volta do centro
  const perfil = []
  for (let k = 0; k <= 18; k++) {
    const a = Math.PI - k * ((1.5 * Math.PI) / 18)
    perfil.push(new THREE.Vector2(1.5 + 0.13 * Math.cos(a), 0.05 + 0.12 * Math.sin(a)))
  }
  const geoPep = new THREE.SphereGeometry(0.4, 20, 5, 0, TAU, 0, 0.44) // calotas: pepperoni com a borda curvada
  const fShape = new THREE.Shape()
  fShape.moveTo(0, -0.17); fShape.quadraticCurveTo(0.13, 0, 0, 0.17); fShape.quadraticCurveTo(-0.13, 0, 0, -0.17)
  const geoFolha = new THREE.ShapeGeometry(fShape, 10)
  const geoAzeit = new THREE.TorusGeometry(0.055, 0.028, 8, 20)
  const geoMozz = new THREE.SphereGeometry(0.15, 16, 8); geoMozz.scale(1, 0.28, 1)
  const geoFio = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true); geoFio.rotateX(Math.PI / 2); geoFio.translate(0, 0, 0.5)
  const xz = (a, d) => [Math.sin(a) * d, Math.cos(a) * d]

  function coberturas(alvo, t0, len, i) {
    const add = (geo, m, a, d, y, ajusta) => {
      const [x, z] = xz(a, d)
      const o = new THREE.Mesh(geo, m)
      o.position.set(x, y, z)
      ajusta?.(o)
      alvo.add(o)
    }
    add(geoPep, M.pep, t0 + len * (0.35 + 0.3 * r()), 0.95 + 0.15 * r(), 0.465, (o) => (o.rotation.x = Math.PI))
    add(geoMozz, M.mozz, t0 + len * (0.3 + 0.4 * r()), 0.45 + 0.1 * r(), 0.07)
    add(geoAzeit, M.azeit, t0 + len * (r() < 0.5 ? 0.2 : 0.8), 0.74, 0.075, (o) => (o.rotation.x = Math.PI / 2))
    if (i % 2 === 0) add(geoFolha, M.folha, t0 + len * 0.55, 0.68, 0.1, (o) => o.rotation.set(-Math.PI / 2 + 0.15, 0, r() * TAU))
  }

  // Corte lateral da fatia: miolo da massa, molho e queijo vistos de lado
  const elipse = new THREE.Shape(); elipse.absellipse(1.5, 0.05, 0.13, 0.12, 0, TAU)
  const geoCorte = [
    [new THREE.PlaneGeometry(1.44, 0.08).translate(0.72, 0, 0), M.miolo],
    [new THREE.ShapeGeometry(elipse, 16), M.miolo],
    [new THREE.PlaneGeometry(1.42, 0.025).translate(0.71, 0.0525, 0), M.molhoCorte],
    [new THREE.PlaneGeometry(1.42, 0.015).translate(0.71, 0.072, 0), M.queijoCorte],
  ]
  const corte = (alvo, ang) => {
    const g = new THREE.Group()
    geoCorte.forEach(([geo, m]) => g.add(new THREE.Mesh(geo, m)))
    g.rotation.y = ang - Math.PI / 2
    alvo.add(g)
  }

  function fatia(t0, len, i, cortes) {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.44, 0.08, 12, 1, false, t0, len), M.massa))
    const rec = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.04, 12, 1, false, t0, len), [M.molhoLado, M.recheio, M.molhoLado])
    rec.position.y = 0.04
    g.add(rec)
    g.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 12, t0, len), M.borda))
    coberturas(g, t0, len, i)
    cortes?.forEach((a) => corte(g, a))
    return g
  }

  const pizza = new THREE.Group()
  const len = TAU / NF - 0.004
  const fatias = []
  for (let i = 0; i < NF; i++) {
    const t0 = (i * TAU) / NF
    let cortes = null
    if (i === 0) cortes = [t0, t0 + len]
    if (i === 1) cortes = [t0]
    if (i === NF - 1) cortes = [t0 + len]
    const f = fatia(t0, len, i, cortes)
    pizza.add(f)
    fatias.push(f)
  }

  // Fatia que sai e fios de queijo presos entre ela e a pizza
  const f0 = fatias[0], m = len / 2
  const dir = new THREE.Vector3(Math.sin(m), 0, Math.cos(m))
  const eixo = new THREE.Vector3(Math.cos(m), 0, -Math.sin(m))
  const ancoras = []
  ;[0, len].forEach((a) => [0.3, 0.62, 0.95].forEach((d) => { const [x, z] = xz(a, d); ancoras.push(new THREE.Vector3(x, 0.07, z)) }))
  const fios = ancoras.map(() => { const o = new THREE.Mesh(geoFio, M.fio); pizza.add(o); return o })
  const B = new THREE.Vector3(), D = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1)
  const suave = (x) => x * x * (3 - 2 * x)

  // t: tempo da animação (s) · s: progresso do scroll (0 a 1) · auto: se o ciclo automático está ligado
  function atualizar(t, s, auto) {
    const c = auto ? t % 7 : 0
    const ciclo = c < 1 ? 0 : c < 2.6 ? (c - 1) / 1.6 : c < 4.6 ? 1 : c < 6 ? 1 - (c - 4.6) / 1.4 : 0
    const p = Math.min(1, Math.max(suave(ciclo), suave(Math.min(1, s * 2.2))))
    pizza.rotation.y = -m + Math.sin(t * 0.35) * 0.25
    f0.position.copy(dir).multiplyScalar(p * 0.8)
    f0.position.y = p * 0.5
    f0.quaternion.setFromAxisAngle(eixo, -p * 0.32)
    f0.updateMatrix()
    ancoras.forEach((A, k) => {
      B.copy(A).applyMatrix4(f0.matrix)
      D.subVectors(B, A)
      const dist = D.length(), fio = fios[k]
      fio.visible = dist > 0.02 && dist < 1.25 - (k % 3) * 0.18 // os fios mais longos arrebentam primeiro
      if (!fio.visible) return
      const esp = 0.028 / (1 + dist * 3)
      fio.position.copy(A)
      fio.quaternion.setFromUnitVectors(Z, D.normalize())
      fio.scale.set(esp, esp, dist)
    })
  }

  function descartar() {
    pizza.traverse((o) => { if (o.geometry) o.geometry.dispose() })
    Object.values(M).forEach((mt) => mt.dispose())
    texRecheio.dispose(); texBorda.dispose()
  }

  return { grupo: pizza, atualizar, descartar }
}
