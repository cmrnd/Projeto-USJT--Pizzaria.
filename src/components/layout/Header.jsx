import { LINK_TELEGRAM } from '../../config'
import { IconeTelegram, Logo } from '../Icones'

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a href="#topo" className="logo" aria-label="Forno da Casa, início">
          <Logo />
          Forno da Casa
        </a>
        <nav aria-label="Principal">
          <ul>
            <li><a href="#processo">A casa</a></li>
            <li><a href="#cardapio">Cardápio</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        <a className="btn btn-pedir" href={LINK_TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Pedir no Telegram">
          <IconeTelegram />
          <span className="rot">Pedir no Telegram</span>
        </a>
      </div>
    </header>
  )
}
