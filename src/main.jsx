import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import { CartProvider } from './context/CartContext'
import './styles/tokens.css'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* reducedMotion="user": o Motion respeita a preferência de movimento reduzido do sistema */}
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <App />
      </CartProvider>
    </MotionConfig>
  </StrictMode>,
)
