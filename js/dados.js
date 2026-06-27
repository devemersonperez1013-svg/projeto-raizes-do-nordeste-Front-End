/* ===========================================================
   DADOS SIMULADOS — Raízes do Nordeste
   Em um sistema real, isso viria de uma API.
   Aqui, simulamos com arrays e objetos em memória.
=========================================================== */

const unidades = [
  { id: "u1", nome: "Recife — Boa Vista" },
  { id: "u2", nome: "São Paulo — Pinheiros" },
  { id: "u3", nome: "Salvador — Barra" }
];

const produtos = [
  {
    id: "p1",
    nome: "Cuscuz recheado",
    descricao: "Cuscuz cremoso com queijo coalho e carne de sol desfiada",
    preco: 18.90,
    categoria: "Salgados",
    disponivelEm: ["u1", "u2", "u3"]
  },
  {
    id: "p2",
    nome: "Tapioca de coco",
    descricao: "Tapioca recheada com coco fresco ralado",
    preco: 12.50,
    categoria: "Salgados",
    disponivelEm: ["u1", "u3"]
  },
  {
    id: "p3",
    nome: "Bolo de macaxeira",
    descricao: "Receita tradicional da Dona Francisca, fofinho e levemente doce",
    preco: 9.00,
    categoria: "Doces",
    disponivelEm: ["u1", "u2", "u3"]
  },
  {
    id: "p4",
    nome: "Suco de cajá",
    descricao: "Suco regional natural, sem adição de açúcar",
    preco: 8.00,
    categoria: "Bebidas",
    disponivelEm: ["u1", "u2"]
  },
  {
    id: "p5",
    nome: "Café passado na hora",
    descricao: "Tirado na hora, do jeito que a casa sempre fez",
    preco: 5.50,
    categoria: "Bebidas",
    disponivelEm: ["u1", "u2", "u3"]
  },
  {
    id: "p6",
    nome: "Cuscuz junino especial",
    descricao: "Edição limitada de São João, com manteiga de garrafa",
    preco: 22.00,
    categoria: "Edição limitada",
    disponivelEm: ["u1"],
    sazonal: true
  }
];

// Etapas possíveis do status de um pedido, em ordem
const etapasStatus = [
  { chave: "confirmado",  rotulo: "Pagamento confirmado" },
  { chave: "preparo",     rotulo: "Em preparo na cozinha" },
  { chave: "pronto",      rotulo: "Pronto para retirada/entrega" },
  { chave: "entregue",    rotulo: "Entregue" }
];

// Recompensas fixas do clube de fidelidade
const recompensas = [
  { id: "r1", nome: "Café grátis", custoPontos: 30 },
  { id: "r2", nome: "Bolo de macaxeira grátis", custoPontos: 60 },
  { id: "r3", nome: "R$ 15 de desconto no próximo pedido", custoPontos: 150 }
];

/* ===========================================================
   ESTADO DA APLICAÇÃO (simula o que seria salvo em um backend)
=========================================================== */

let estado = {
  unidadeAtualId: "u1",
  carrinho: [],          // [{ produtoId, quantidade }]
  pedidoAtual: null,     // { id, itens, total, status, unidade, formaPagamento, pago }
  cliente: {
    nome: "Maria Silva",
    pontos: 120,
    consentimentoLGPD: null, // null = ainda não decidiu | true | false
    historicoPedidos: []     // [{ id, total, data, unidade }]
  }
};