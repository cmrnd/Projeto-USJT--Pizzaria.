import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { criarPizza } from './construirPizza'

const OLHAR = [0, 0.2, 0]
const CAMERA = [0, 4.7, 6.5]

function Pizza({ progresso, animOn }) {
  const raiz = useRef()
  const pizza = useMemo(() => criarPizza(), [])
  const { invalidate, gl, camera, size } = useThree()
  const t = useRef(0)
  const alvo = useRef({ x: 0, y: 0 })
  const atual = useRef({ x: 0, y: 0, s: progresso.get() })

  useEffect(() => () => pizza.descartar(), [pizza])

  // Em tela vertical (celular) a câmera se afasta um pouco para caber a fatia
  useEffect(() => {
    const k = size.width / size.height < 1 ? 1.15 : 1
    camera.position.set(CAMERA[0] * k, CAMERA[1] * k, CAMERA[2] * k)
    camera.lookAt(...OLHAR)
    invalidate()
  }, [size, camera, invalidate])

  // Ponteiro inclina a pizza; scroll puxa a fatia. Fora do loop contínuo, pedimos quadros sob demanda.
  useEffect(() => {
    const el = gl.domElement.parentElement
    const mover = (e) => {
      const b = el.getBoundingClientRect()
      alvo.current = { x: (e.clientX - b.left) / b.width - 0.5, y: (e.clientY - b.top) / b.height - 0.5 }
      invalidate()
    }
    const sair = () => { alvo.current = { x: 0, y: 0 }; invalidate() }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', sair)
    const parar = progresso.on('change', () => invalidate())
    return () => { el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', sair); parar() }
  }, [gl, invalidate, progresso])

  useFrame((_, dt) => {
    if (animOn) t.current += Math.min(dt, 0.05)
    const a = atual.current, al = alvo.current, s = progresso.get()
    a.x += (al.x - a.x) * 0.08
    a.y += (al.y - a.y) * 0.08
    a.s += (s - a.s) * 0.1
    raiz.current.rotation.x = a.y * 0.3
    raiz.current.rotation.z = -a.x * 0.25
    pizza.atualizar(t.current, a.s, animOn)
    // Ainda se acomodando: pede mais um quadro (no modo sob demanda)
    if (Math.abs(al.x - a.x) + Math.abs(al.y - a.y) + Math.abs(s - a.s) > 0.001) invalidate()
  })

  return (
    <group ref={raiz}>
      <primitive object={pizza.grupo} />
      <ContactShadows position={[0, -0.12, 0]} opacity={0.65} scale={5} blur={2.6} far={1.4} resolution={256} color="#000000" />
    </group>
  )
}

export default function PizzaScene({ progresso, animOn }) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(true)

  // Fora da tela, a cena para de desenhar (economiza bateria)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div className="palco-canvas" ref={ref} aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={!visivel ? 'never' : animOn ? 'always' : 'demand'}
        camera={{ fov: 30, near: 0.1, far: 60, position: CAMERA }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <hemisphereLight args={[0xfff0dc, 0x3a2416, 1.3]} />
        <directionalLight position={[3, 6, 4]} intensity={1.9} color={0xffe4bf} />
        <pointLight position={[-3.5, 1.5, 1]} intensity={16} distance={14} decay={2} color={0xff6a2a} />
        <Pizza progresso={progresso} animOn={animOn} />
      </Canvas>
    </div>
  )
}
