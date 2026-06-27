/* ===========================================================
   RAÍZES DO NORDESTE — lógica da aplicação:
   Organizado por responsabilidade: navegação, LGPD, cardápio, carrinho, pedido/pagamento/status, fidelidade.
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    iniciarNavegacao();
    iniciarLGPD();
    iniciarSeletorUnidade();
    renderizarFiltrosCategoria();
    renderizarCardapio();
    iniciarCarrinho();
    iniciarPedido();
    iniciarFidelidade();
});

/* ===========================================================
   UTILITÁRIOS
=========================================================== */

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.classList.add("visivel");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove("visivel"), 2200);
}

function buscarProduto(id) {
    return produtos.find(p => p.id === id);
}

/* ===========================================================
   NAVEGAÇÃO ENTRE TELAS
=========================================================== */

function iniciarNavegacao() {
    document.querySelectorAll("[data-tela]").forEach(botao => {
        botao.addEventListener("click", () => irParaTela(botao.dataset.tela));
    });
}

function irParaTela(idTela) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("tela--ativa"));
    document.getElementById(idTela).classList.add("tela--ativa");

    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("ativo"));
    const botaoNav = document.querySelector(`.nav-btn[data-tela="${idTela}"]`);
    if (botaoNav) botaoNav.classList.add("ativo");

    // Sempre que entrar na tela de pedido, re-renderiza (status pode ter avançado)
    if (idTela === "tela-pedido") renderizarPedido();
    if (idTela === "tela-carrinho") renderizarCarrinho();
    if (idTela === "tela-fidelidade") renderizarFidelidade();

    window.scrollTo({ top: 0, behavior: "instant" });
}

/* ===========================================================
   CONSENTIMENTO LGPD
   Regra: enquanto o cliente não decidir, mostramos o banner.
   Se recusar, ele ainda pode pedir, mas não acumula pontos
   nem temos histórico de fidelidade (RF08 / RNF03).
=========================================================== */
function iniciarLGPD() {
    const banner = document.getElementById("banner-lgpd");
    const btnAceitar = document.getElementById("btn-lgpd-aceitar");
    const btnRecusar = document.getElementById("btn-lgpd-recusar");
    const btnReativar = document.getElementById("btn-reativar-lgpd");

    if (estado.cliente.consentimentoLGPD !== null) {
        banner.hidden = true;
    }


    btnAceitar.addEventListener("click", () => {
        estado.cliente.consentimentoLGPD = true;
        banner.hidden = true;
        mostrarToast("Consentimento registrado. Obrigado!");
        renderizarFidelidade();
    });

    btnRecusar.addEventListener("click", () => {
        estado.cliente.consentimentoLGPD = false;
        banner.hidden = true;
        mostrarToast("Tudo bem — você pode pedir sem acumular pontos.");
        renderizarFidelidade();
    });

    btnReativar.addEventListener("click", () => {
        document.getElementById("banner-lgpd").hidden = false;
    });
}

/* ===========================================================
   SELETOR DE UNIDADE
=========================================================== */

function iniciarSeletorUnidade() {
    const btnUnidade = document.getElementById("btn-unidade");
    const popover = document.getElementById("popover-unidade");
    const lista = document.getElementById("lista-unidades");

    lista.innerHTML = unidades.map(u => `
    <button class="popover-unidade__item ${u.id === estado.unidadeAtualId ? "selecionada" : ""}" data-unidade="${u.id}">
      ${u.nome}
    </button>
  `).join("");

    btnUnidade.addEventListener("click", () => popover.classList.toggle("aberto"));

    lista.querySelectorAll("[data-unidade]").forEach(botao => {
        botao.addEventListener("click", () => {
            estado.unidadeAtualId = botao.dataset.unidade;
            popover.classList.remove("aberto");
            atualizarNomeUnidadeNaTela();
            renderizarFiltrosCategoria();
            renderizarCardapio();
            iniciarSeletorUnidade(); // re-renderiza marcando a nova selecionada
        });
    });

    document.addEventListener("click", (evento) => {
        if (!popover.contains(evento.target) && evento.target !== btnUnidade && !btnUnidade.contains(evento.target)) {
            popover.classList.remove("aberto");
        }
    });

    atualizarNomeUnidadeNaTela();
}

function atualizarNomeUnidadeNaTela() {
    const unidade = unidades.find(u => u.id === estado.unidadeAtualId);
    document.getElementById("unidade-atual-nome").textContent = unidade.nome;
    document.getElementById("cardapio-nome-unidade").textContent = unidade.nome;
}

/* ===========================================================
   CARDÁPIO (RF01, RF02)
=========================================================== */

let categoriaFiltro = "todas";

function renderizarFiltrosCategoria() {
    const categorias = ["todas", ...new Set(produtos.map(p => p.categoria))];
    const container = document.getElementById("filtros-categoria");

    container.innerHTML = categorias.map(c => `
    <button class="filtro-chip ${c === categoriaFiltro ? "ativo" : ""}" data-categoria="${c}">
      ${c === "todas" ? "Todas" : c}
    </button>
  `).join("");

    container.querySelectorAll("[data-categoria]").forEach(chip => {
        chip.addEventListener("click", () => {
            categoriaFiltro = chip.dataset.categoria;
            renderizarFiltrosCategoria();
            renderizarCardapio();
        });
    });
}

function renderizarCardapio() {
    const container = document.getElementById("grade-produtos");

    const disponiveis = produtos.filter(p =>
        p.disponivelEm.includes(estado.unidadeAtualId) &&
        (categoriaFiltro === "todas" || p.categoria === categoriaFiltro)
    );

    if (disponiveis.length === 0) {
        container.innerHTML = `<p class="historico-pedidos__vazio">Nenhum produto disponível com esse filtro nesta unidade.</p>`;
        return;
    }

    container.innerHTML = disponiveis.map(p => `
    <article class="cartao-produto">
      <div>
        ${p.sazonal ? `<span class="cartao-produto__selo">Edição limitada</span>` : ""}
        <h3 class="cartao-produto__nome">${p.nome}</h3>
        <p class="cartao-produto__descricao">${p.descricao}</p>
        <span class="cartao-produto__preco">${formatarPreco(p.preco)}</span>
      </div>
      <div class="cartao-produto__acao">
        <button class="btn-adicionar" data-adicionar="${p.id}">Adicionar</button>
      </div>
    </article>
  `).join("");

    container.querySelectorAll("[data-adicionar]").forEach(botao => {
        botao.addEventListener("click", () => adicionarAoCarrinho(botao.dataset.adicionar));
    });
}

/* ===========================================================
   CARRINHO (RF03, RF04)
=========================================================== */

function adicionarAoCarrinho(produtoId) {
    const item = estado.carrinho.find(i => i.produtoId === produtoId);
    if (item) {
        item.quantidade += 1;
    } else {
        estado.carrinho.push({ produtoId, quantidade: 1 });
    }
    atualizarContadorCarrinho();
    mostrarToast(`${buscarProduto(produtoId).nome} adicionado ao carrinho`);
}

function atualizarContadorCarrinho() {
    const total = estado.carrinho.reduce((soma, i) => soma + i.quantidade, 0);
    document.getElementById("contador-carrinho").textContent = total;
}

function iniciarCarrinho() {
    atualizarContadorCarrinho();
    document.getElementById("btn-confirmar-pedido").addEventListener("click", confirmarPedido);
}

function renderizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const vazio = document.getElementById("carrinho-vazio");
    const resumo = document.getElementById("resumo-carrinho");

    if (estado.carrinho.length === 0) {
        lista.innerHTML = "";
        vazio.hidden = false;
        resumo.hidden = true;
        return;
    }

    vazio.hidden = true;
    resumo.hidden = false;

    lista.innerHTML = estado.carrinho.map(item => {
        const produto = buscarProduto(item.produtoId);
        return `
      <div class="item-carrinho">
        <div>
          <p class="item-carrinho__nome">${produto.nome}</p>
          <p class="item-carrinho__preco-unit">${formatarPreco(produto.preco)} cada</p>
        </div>
        <div class="controle-quantidade">
          <button data-diminuir="${item.produtoId}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantidade}</span>
          <button data-aumentar="${item.produtoId}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `;
    }).join("");

    lista.querySelectorAll("[data-aumentar]").forEach(b =>
        b.addEventListener("click", () => alterarQuantidade(b.dataset.aumentar, 1))
    );
    lista.querySelectorAll("[data-diminuir]").forEach(b =>
        b.addEventListener("click", () => alterarQuantidade(b.dataset.diminuir, -1))
    );

    const total = estado.carrinho.reduce((soma, i) => soma + buscarProduto(i.produtoId).preco * i.quantidade, 0);
    document.getElementById("carrinho-total").textContent = formatarPreco(total);
}

function alterarQuantidade(produtoId, delta) {
    const item = estado.carrinho.find(i => i.produtoId === produtoId);
    item.quantidade += delta;
    if (item.quantidade <= 0) {
        estado.carrinho = estado.carrinho.filter(i => i.produtoId !== produtoId);
    }
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

function confirmarPedido() {
    if (estado.carrinho.length === 0) return;

    const total = estado.carrinho.reduce((soma, i) => soma + buscarProduto(i.produtoId).preco * i.quantidade, 0);

    estado.pedidoAtual = {
        id: "RN" + Math.floor(1000 + Math.random() * 9000),
        itens: [...estado.carrinho],
        total,
        unidade: estado.unidadeAtualId,
        formaPagamento: null,
        pago: false,
        statusIndex: -1 // -1 = aguardando pagamento
    };

    estado.carrinho = [];
    atualizarContadorCarrinho();
    mostrarToast("Pedido criado! Falta confirmar o pagamento.");
    irParaTela("tela-pedido");
}

/* ===========================================================
   PEDIDO: PAGAMENTO (RF05) + STATUS (RF06)
=========================================================== */

function iniciarPedido() {
    document.getElementById("btn-pagar").addEventListener("click", processarPagamento);
}

function renderizarPedido() {
    const semPedido = document.getElementById("pedido-sem-pedido");
    const pedidoAtivo = document.getElementById("pedido-ativo");
    const blocoPagamento = document.getElementById("bloco-pagamento");
    const blocoStatus = document.getElementById("bloco-status");

    if (!estado.pedidoAtual) {
        semPedido.hidden = false;
        pedidoAtivo.hidden = true;
        return;
    }

    semPedido.hidden = true;
    pedidoAtivo.hidden = false;

    if (!estado.pedidoAtual.pago) {
        blocoPagamento.hidden = false;
        blocoStatus.hidden = true;
    } else {
        blocoPagamento.hidden = true;
        blocoStatus.hidden = false;
        renderizarLinhaTempo();
    }
}

function processarPagamento() {
    const formaSelecionada = document.querySelector('input[name="pagamento"]:checked').value;
    const mensagemErro = document.getElementById("pagamento-mensagem");

    // Simulação: pagamento "falha" só em um caso raro, pra demonstrar caminho negativo (RNF04)
    const sucesso = Math.random() > 0.08;

    if (!sucesso) {
        mensagemErro.textContent = "Não conseguimos confirmar o pagamento. Verifique os dados e tente novamente.";
        mensagemErro.hidden = false;
        return;
    }

    mensagemErro.hidden = true;
    estado.pedidoAtual.formaPagamento = formaSelecionada;
    estado.pedidoAtual.pago = true;
    estado.pedidoAtual.statusIndex = 0;

    // Pontos de fidelidade só se houve consentimento (RF08 ligado ao RF07)
    if (estado.cliente.consentimentoLGPD === true) {
        const pontosGanhos = Math.round(estado.pedidoAtual.total);
        estado.cliente.pontos += pontosGanhos;
        estado.cliente.historicoPedidos.push({
            id: estado.pedidoAtual.id,
            total: estado.pedidoAtual.total,
            data: new Date().toLocaleDateString("pt-BR")
        });
    }

    mostrarToast("Pagamento confirmado!");
    renderizarPedido();
    iniciarAvancoAutomaticoDeStatus();
}

function renderizarLinhaTempo() {
    const container = document.getElementById("linha-tempo");
    document.getElementById("status-numero-pedido").textContent = "#" + estado.pedidoAtual.id;

    container.innerHTML = etapasStatus.map((etapa, index) => `
    <li class="linha-tempo__item ${index <= estado.pedidoAtual.statusIndex ? "concluida" : ""}">
      <span class="linha-tempo__marcador"></span>
      <span class="linha-tempo__rotulo">${etapa.rotulo}</span>
    </li>
  `).join("");
}

// Simula o avanço do pedido na cozinha, pra demonstrar o fluxo de status completo
function iniciarAvancoAutomaticoDeStatus() {
    const intervalo = setInterval(() => {
        if (!estado.pedidoAtual || estado.pedidoAtual.statusIndex >= etapasStatus.length - 1) {
            clearInterval(intervalo);
            return;
        }
        estado.pedidoAtual.statusIndex += 1;
        if (document.getElementById("tela-pedido").classList.contains("tela--ativa")) {
            renderizarLinhaTempo();
        }
    }, 4000);
}

/* ===========================================================
   FIDELIDADE (RF07)
=========================================================== */

function iniciarFidelidade() {
    // Delegação de evento pros botões de resgate, já que a lista é re-renderizada
    document.getElementById("lista-recompensas").addEventListener("click", (evento) => {
        const botao = evento.target.closest("[data-resgatar]");
        if (botao) resgatarRecompensa(botao.dataset.resgatar);
    });
}

function renderizarFidelidade() {
    const bloqueada = document.getElementById("fidelidade-bloqueada");
    const conteudo = document.getElementById("fidelidade-conteudo");

    if (estado.cliente.consentimentoLGPD === false) {
        bloqueada.hidden = false;
        conteudo.hidden = true;
        return;
    }

    bloqueada.hidden = true;
    conteudo.hidden = false;

    document.getElementById("fidelidade-pontos").textContent = estado.cliente.pontos;

    document.getElementById("lista-recompensas").innerHTML = recompensas.map(r => `
    <div class="cartao-recompensa">
      <div>
        <p class="cartao-recompensa__nome">${r.nome}</p>
        <p class="cartao-recompensa__custo">${r.custoPontos} pontos</p>
      </div>
      <button class="btn-resgatar" data-resgatar="${r.id}" ${estado.cliente.pontos < r.custoPontos ? "disabled" : ""}>
        Resgatar
      </button>
    </div>
  `).join("");

    const historico = document.getElementById("historico-pedidos");
    if (estado.cliente.historicoPedidos.length === 0) {
        historico.innerHTML = `<li class="historico-pedidos__vazio">Você ainda não tem pedidos no histórico.</li>`;
    } else {
        historico.innerHTML = estado.cliente.historicoPedidos.map(p => `
      <li><span>Pedido #${p.id} · ${p.data}</span><strong>${formatarPreco(p.total)}</strong></li>
    `).join("");
    }
}

function resgatarRecompensa(recompensaId) {
    const recompensa = recompensas.find(r => r.id === recompensaId);
    if (estado.cliente.pontos < recompensa.custoPontos) return;

    estado.cliente.pontos -= recompensa.custoPontos;
    mostrarToast(`Resgatado: ${recompensa.nome}`);
    renderizarFidelidade();
}