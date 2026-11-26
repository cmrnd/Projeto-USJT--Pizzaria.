import { ENDERECO, HORARIO, LINK_TELEGRAM, TELEGRAM_EXIBIDO } from '../../config'

export default function Footer() {
  return (
    <footer id="contato">
      <div className="wrap">
        <div className="foot">
          <div>
            <div className="logo">Forno da Casa</div>
            <p>Pizzas feitas com carinho, assadas na hora e entregues quentinhas.</p>
          </div>
          <div>
            <h2>Horário</h2>
            <ul>{HORARIO.map((h) => <li key={h}>{h}</li>)}</ul>
          </div>
          <div>
            <h2>Contato</h2>
            <ul>
              <li>Telegram: <a href={LINK_TELEGRAM} target="_blank" rel="noopener noreferrer">{TELEGRAM_EXIBIDO}</a></li>
              <li>{ENDERECO}</li>
            </ul>
          </div>
        </div>
        <p className="copy">© {new Date().getFullYear()} Forno da Casa · Todos os direitos reservados</p>
      </div>
    </footer>
  )
}
