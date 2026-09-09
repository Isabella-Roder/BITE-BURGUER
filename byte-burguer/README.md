# Byte Burguer — frontend

React, TypeScript, Vite e React Router.

```bash
npm install
npm run dev
```

O Vite encaminha `/api` para o backend em `http://localhost:8080`. Quando a API está indisponível, a interface mostra produtos demonstrativos. O formulário revisa e envia pedidos a `POST /api/pedidos`, mostrando o número retornado. Produtos demonstrativos não podem ser enviados. Inicie o backend e cadastre produtos reais para usar esse fluxo.

## Rotas

| Endereço | Página | Arquivo |
| --- | --- | --- |
| `/` | Início, banner e cardápio | `src/pages/HomePage.tsx` |
| `/cardapio` | Cardápio com busca e filtros | `src/pages/MenuPage.tsx` |
| `/pedido` | Carrinho e formulário | `src/pages/OrderPage.tsx` |
| Outros | Página não encontrada | `src/pages/NotFoundPage.tsx` |

Adicione novas rotas em `src/routes/AppRoutes.tsx`. O cabeçalho e a navegação ficam em `src/components/SiteLayout.tsx`. Os componentes `Menu` e `OrderPanel` são compartilhados pelas páginas.

`ShopProvider` mantém produtos, carrinho, filtros e dados do formulário durante a navegação. O estado fica em memória: recarregar a página o reinicia. A consulta à API está em `src/hooks/useShopState.ts`; os produtos de demonstração estão em `src/data/products.ts`.

## Validação

```bash
npm run build
npm run lint
```

## Publicação

Configure o servidor de hospedagem para servir `index.html` nas rotas do frontend, incluindo `/cardapio` e `/pedido`, permitindo acesso direto e atualização da página. Encaminhe `/api` ao backend antes dessa regra; o proxy do Vite funciona apenas no desenvolvimento.

## Painel e acompanhamento

- `/painel/produtos`: lista, ativa e desativa produtos.
- `/painel/produtos/novo`: cadastra um produto.
- `/painel/produtos/:id/editar`: consulta e salva alterações.
- `/painel/pedidos`: lista pedidos, filtra por status e atualiza a cada 10 segundos.
- `/painel/pedidos/:id`: mostra os itens e dados de entrega, permite avançar o status.
- `/pedido/:id`: acompanhamento pelo cliente, sem controles administrativos.

O acesso ao painel está no rodapé. Essas telas utilizam os endpoints reais e mostram erro quando a API está indisponível. Os serviços estão em `src/services/store.ts`. O backend atual não fornece autenticação do painel.
