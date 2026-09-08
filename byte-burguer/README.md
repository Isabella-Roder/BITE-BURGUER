# Byte Burguer — frontend

React, TypeScript, Vite e React Router.

```bash
npm install
npm run dev
```

O Vite encaminha `/api` para o backend em `http://localhost:8080`. Quando a API está indisponível, a interface mostra produtos demonstrativos. O envio de pedidos ainda depende de implementação no backend.

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
