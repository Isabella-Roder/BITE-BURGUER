# Requisitos — Sistema Byte Burguer

Projeto enxuto, sem pagamento online e sem login de usuário por enquanto.

## Escopo geral

- Sistema com duas partes: **app do cliente** (fazer pedido) e **painel interno** (uso da hamburgueria).
- Stack: React.
- Pedido feito pelo cliente aparece no painel interno em tempo (quase) real.

## 1. App do Cliente

- [ ] Exibir cardápio (lista de burgers/combos/bebidas com nome, descrição, preço).
- [ ] Permitir montar o pedido (escolher itens e quantidades).
- [ ] Exibir resumo do pedido com valor total.
- [ ] Formulário com dados do cliente: nome, telefone, endereço de entrega.
- [ ] Botão de enviar pedido (sem pagamento online — combinar na entrega).
- [ ] Confirmação de que o pedido foi enviado com sucesso.

## 2. Painel Interno (hamburgueria)

- [ ] Listar pedidos recebidos, mais recentes primeiro.
- [ ] Mostrar detalhes de cada pedido (itens, cliente, endereço, total).
- [ ] Atualizar status do pedido: `Novo` → `Preparando` → `Saiu para entrega` → `Entregue`.
- [ ] Filtrar/visualizar pedidos por status.

## 3. Dados / Backend

- [ ] Definir onde os pedidos ficam armazenados (a decidir: JSON server, Firebase, backend simples em Node, etc.).
- [ ] Modelo de dados do **Produto**: id, nome, descrição, preço, categoria.
- [ ] Modelo de dados do **Pedido**: id, cliente (nome/telefone/endereço), itens (produto + quantidade), total, status, data/hora.

## Fora do escopo (por enquanto)

- Pagamento online (pix, cartão).
- Cadastro/login de cliente.
- Controle de estoque.
- Cadastro/rastreamento de entregadores.
- Relatórios financeiros.

## Decisões em aberto

- [ ] Onde armazenar os pedidos (banco/backend).
- [ ] Nome definitivo do cardápio inicial (quais produtos entram).
- [ ] Vai ter algum tipo de notificação sonora/visual no painel quando chega pedido novo?
