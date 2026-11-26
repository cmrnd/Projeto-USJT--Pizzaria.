// Cardápio da pizzaria.
// Pizzas têm os tamanhos Broto e Grande; bebidas, a garrafa de 2 litros.
// base: fundo da pizza desenhada no card (molho, choc, leite, queijo, doceleite)
// coberturas: ingredientes desenhados por cima (ver src/lib/desenhaPizza.js)
// foto (opcional): caminho de uma foto real em /public, ex.: '/fotos/marguerita.jpg'.
//   Quando existir, o card mostra a foto no lugar do desenho.

export const CATEGORIAS = [
  { id: 'tradicionais', nome: 'Tradicionais', rotulo: 'Tradicional' },
  { id: 'especiais', nome: 'Especiais', rotulo: 'Especial' },
  { id: 'doces', nome: 'Doces', rotulo: 'Doce' },
  { id: 'bebidas', nome: 'Bebidas', rotulo: 'Bebida' },
]

const slug = (nome) => nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')

// Pizzas: dois tamanhos, Broto e Grande
const p = (cat, nome, ingredientes, broto, grande, base, coberturas) => ({
  id: slug(nome), tipo: 'pizza', cat, nome, ingredientes, precos: { Broto: broto, Grande: grande }, base, coberturas,
})

// Bebidas: garrafa de 2 litros. cor: líquido, rotulo: faixa da garrafa, tampa: cor da tampa
const b = (grupo, nome, preco, cor, rotulo, tampa) => ({
  id: slug(nome), tipo: 'bebida', cat: 'bebidas', grupo, nome,
  ingredientes: grupo === 'Suco' ? 'suco natural, garrafa de 2 litros' : 'refrigerante, garrafa de 2 litros',
  precos: { '2 litros': preco }, cor, rotulo, tampa,
})

export const PIZZAS = [
  p('tradicionais', 'Mussarela', 'molho de tomate, mussarela, tomate e orégano', 25.9, 45.9, 'molho', ['queijo', 'tomate', 'oregano']),
  p('tradicionais', 'Calabresa', 'molho de tomate, calabresa, cebola, mussarela e orégano', 26.9, 47.9, 'molho', ['calabresa', 'cebola', 'oregano']),
  p('tradicionais', 'Portuguesa', 'molho de tomate, mussarela, presunto, ovo, cebola, ervilha e azeitona', 29.9, 54.9, 'molho', ['presunto', 'ovo', 'cebola', 'ervilha', 'azeitona']),
  p('tradicionais', 'Marguerita', 'molho de tomate, mussarela, tomate, manjericão e orégano', 27.9, 49.9, 'molho', ['queijo', 'tomate', 'manjericao']),
  p('tradicionais', 'Napolitana', 'molho de tomate, mussarela, tomate e parmesão', 27.9, 49.9, 'molho', ['tomate', 'parmesao']),
  p('tradicionais', 'Presunto e Queijo', 'molho de tomate, presunto, mussarela e orégano', 26.9, 47.9, 'molho', ['presunto', 'oregano']),
  p('tradicionais', 'Milho com Queijo', 'molho de tomate, mussarela, milho e orégano', 25.9, 46.9, 'molho', ['milho', 'oregano']),
  p('tradicionais', 'Alho e Óleo', 'molho de tomate, mussarela, alho frito e orégano', 25.9, 46.9, 'molho', ['alho', 'oregano']),

  p('especiais', 'Frango com Catupiry', 'molho de tomate, frango desfiado, requeijão cremoso e mussarela', 29.9, 54.9, 'molho', ['frango', 'catupiry']),
  p('especiais', 'Quatro Queijos', 'molho de tomate, mussarela, provolone, parmesão e gorgonzola', 31.9, 57.9, 'molho', ['provolone', 'gorgonzola', 'parmesao']),
  p('especiais', 'Bacon', 'molho de tomate, mussarela, bacon e orégano', 29.9, 53.9, 'molho', ['bacon', 'oregano']),
  p('especiais', 'Pepperoni', 'molho de tomate, mussarela, pepperoni e orégano', 33.9, 59.9, 'molho', ['pepperoni', 'oregano']),
  p('especiais', 'Baiana', 'molho de tomate, calabresa moída, cebola, pimenta e mussarela', 29.9, 52.9, 'molho', ['calabresaMoida', 'cebola', 'pimenta']),
  p('especiais', 'Carne-seca com Requeijão', 'molho de tomate, carne-seca desfiada, requeijão cremoso e cebola', 34.9, 61.9, 'molho', ['carne', 'catupiry', 'cebola']),
  p('especiais', 'Bacon com Milho', 'molho de tomate, mussarela, bacon, milho e orégano', 29.9, 53.9, 'molho', ['bacon', 'milho']),
  p('especiais', 'Lombo com Catupiry', 'molho de tomate, lombo canadense, requeijão cremoso e mussarela', 31.9, 57.9, 'molho', ['lombo', 'catupiry']),
  p('especiais', 'Atum', 'molho de tomate, atum, cebola, mussarela e azeitona', 30.9, 55.9, 'molho', ['atum', 'cebola', 'azeitona']),
  p('especiais', 'Vegetariana', 'molho de tomate, mussarela, champignon, milho, tomate, cebola e azeitona', 29.9, 52.9, 'molho', ['champignon', 'tomate', 'milho', 'cebola', 'azeitona']),

  p('doces', 'Chocolate', 'chocolate ao leite e granulado', 29.9, 49.9, 'choc', ['granulado']),
  p('doces', 'Chocolate com Morango', 'chocolate ao leite e morangos frescos', 32.9, 55.9, 'choc', ['morango']),
  p('doces', 'Banana com Canela', 'banana, açúcar, canela e leite condensado', 26.9, 45.9, 'leite', ['banana', 'canela']),
  p('doces', 'Romeu e Julieta', 'goiabada e mussarela', 27.9, 46.9, 'queijo', ['goiabada']),
  p('doces', 'Brigadeiro', 'chocolate, brigadeiro cremoso e granulado', 30.9, 52.9, 'choc', ['brigadeiro', 'granulado']),
  p('doces', 'Prestígio', 'chocolate, coco ralado e leite condensado', 30.9, 52.9, 'choc', ['coco']),
  p('doces', 'Doce de Leite com Banana', 'doce de leite e banana fatiada', 28.9, 49.9, 'doceleite', ['banana']),
]

export const BEBIDAS = [
  b('Refrigerante', 'Coca-Cola', 14, '#2B130C', '#C8102E', '#C8102E'),
  b('Refrigerante', 'Guaraná Antarctica', 12, '#7A2E12', '#1E7A3A', '#1E7A3A'),
  b('Refrigerante', 'Fanta Uva', 12, '#5B1E5E', '#6B2C8F', '#E6E1EA'),
  b('Refrigerante', 'Sprite', 12, '#E8F3DF', '#1A8A4A', '#1A8A4A'),
  b('Suco', 'Abacaxi natural', 20, '#F2CC4B', '#F5EBDD', '#C98B3A'),
  b('Suco', 'Acerola natural', 20, '#D9472B', '#F5EBDD', '#C98B3A'),
  b('Suco', 'Laranja natural', 20, '#F39A1E', '#F5EBDD', '#C98B3A'),
  b('Suco', 'Goiaba natural', 20, '#E9727A', '#F5EBDD', '#C98B3A'),
]

// Tudo o que aparece no cardápio
export const ITENS = [...PIZZAS, ...BEBIDAS]
export const MENOR_PRECO = Math.min(...PIZZAS.map((pz) => pz.precos.Broto))
