# Raízes do Nordeste — Front-End SPA

Aplicação web do tipo **Single Page Application (SPA)** desenvolvida com HTML, CSS e JavaScript puro, simulando o sistema de pedidos online de uma rede de restaurantes de culinária nordestina brasileira.

> Projeto Multidisciplinar desenvolvido como parte do curso de **Análise e Desenvolvimento em Sistemas** na **UNINTER**.

---

## 🔗 Site hospedada...

[Acessar o projeto online](https://devemersonperez1013-svg.github.io/projeto-raizes-do-nordeste-Front-End/)

---

## 📸 Visão Geral

O sistema simula uma aplicação de pedidos para restaurante, com navegação entre telas sem recarregar a página, carrinho de compras funcional, sistema de fidelidade e consentimento de dados (LGPD).

---

## ✨ Funcionalidades

- **Cardápio** — Listagem de produtos com filtros por categoria e seleção de unidade
- **Carrinho** — Adição, remoção de itens e cálculo automático do total
- **Pedido** — Fluxo de pagamento (PIX ou Cartão) com linha do tempo de status em tempo real
- **Fidelidade** — Acúmulo de pontos por pedido (R$ 1 = 1 ponto) com histórico e recompensas
- **Banner LGPD** — Consentimento de uso de dados com opção de aceitar ou recusar
- **Seletor de Unidade** — Escolha entre diferentes unidades do restaurante
- **Toast de feedback** — Notificações visuais para ações do usuário

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da aplicação |
| CSS3 | Estilização, layout responsivo (Flexbox/Grid) |
| JavaScript (Vanilla) | Lógica da SPA, manipulação do DOM, navegação entre telas |
| Google Fonts | Tipografia (Fraunces, Roboto, Work Sans) |

---

## 📁 Estrutura do Projeto

```
projeto-raizes-do-nordeste-Front-End/
├── index.html          # Página principal e estrutura da SPA
├── css/
│   ├── main.css        # Estilos globais
│   ├── nav-bottom.css  # Estilos da navegação inferior
│   └── banner.css      # Estilos do banner LGPD
├── js/
│   ├── dados.js        # Dados estáticos (cardápio, unidades, recompensas)
│   └── app.js          # Lógica principal da aplicação
└── img/
    └── logo.jpeg       # Logo do restaurante
```

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/devemersonperez1013-svg/projeto-raizes-do-nordeste-Front-End.git
```

2. Acesse a pasta do projeto:
```bash
cd projeto-raizes-do-nordeste-Front-End
```

3. Abra o arquivo `index.html` no seu navegador — ou use a extensão **Live Server** no VS Code para uma melhor experiência de desenvolvimento.

---

## 📱 Design

A interface adota o padrão **Mobile First**, com navegação inferior fixa (bottom navigation bar) — padrão comum em aplicativos móveis — garantindo boa usabilidade em dispositivos de diferentes tamanhos.

---

## 🎯 Aprendizados e Conceitos Aplicados

- Arquitetura SPA com JavaScript puro (sem frameworks)
- Manipulação do DOM para navegação entre "telas" sem recarregamento
- Gerenciamento de estado local com variáveis JS
- Layout responsivo com CSS Flexbox e Grid
- Componentização de elementos via JavaScript
- Simulação de fluxo de pagamento e status de pedido
- Boas práticas de acessibilidade (`aria-*`, `role`, `hidden`)
- Aplicação de conceitos de LGPD na interface

---

## 👤 Autor

**Emerson Perez**

[![GitHub](https://img.shields.io/badge/GitHub-devemersonperez1013--svg-181717?style=flat&logo=github)](https://github.com/devemersonperez1013-svg)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
