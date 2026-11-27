# Forno da Casa · site da pizzaria

React + Vite, com a pizza 3D em React Three Fiber e as animações da interface em Motion.

## Comandos

```bash
npm install      # primeira vez
npm run dev      # abre em http://localhost:5173 e atualiza ao salvar
npm run build    # gera a versão final em dist/
npm run preview  # testa a versão final
```

Se o `npm install` travar nesta rede, use o espelho do Yarn:
`npm install --registry=https://registry.yarnpkg.com`

## Onde mudar cada coisa

| O quê | Arquivo |
|---|---|
| Sabores, descrições e preços | `src/data/cardapio.js` |
| Chatbot do Telegram, endereço, horário | `src/config.js` |
| Cores e fontes | `src/styles/tokens.css` |
| Pizza 3D (formato, coberturas, animação da fatia) | `src/components/hero/construirPizza.js` |
| Fotos reais das pizzas | coloque em `public/fotos/` e adicione `foto: '/fotos/nome.jpg'` ao sabor em `cardapio.js` |
