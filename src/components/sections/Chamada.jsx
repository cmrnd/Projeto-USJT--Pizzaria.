import { LINK_TELEGRAM } from '../../config'
import { IconeTelegram } from '../Icones'

export default function Chamada() {
  return (
    <section className="sec" style={{ paddingTop: 0, background: 'var(--creme-claro)' }} aria-labelledby="titulo-chamada">
      <div className="wrap">
        <div className="chamada">
          <div>
            <h2 id="titulo-chamada">Bateu a vontade? <em>Peça agora.</em></h2>
            <p>Escolha as pizzas, confira o total na sacola e envie o pedido pronto pelo Telegram. É só confirmar o endereço.</p>
          </div>
          <a className="btn btn-tele" href={LINK_TELEGRAM} target="_blank" rel="noopener noreferrer">
            <IconeTelegram /> Chamar no Telegram
          </a>
        </div>
      </div>
    </section>
  )
}
