# Byte Burguer

Aplicação full stack para uma hamburgueria, com cardápio online, montagem e acompanhamento de pedidos e um painel para gerenciar produtos e atender os pedidos recebidos.

O projeto reúne uma interface em **React e TypeScript** e uma API REST em **Java com Spring Boot**. O cliente escolhe os produtos, revisa os dados de entrega ou retirada e envia o pedido. A loja consulta os itens e atualiza o status pelo painel.

## Telas do projeto

### Página inicial

Banner de apresentação, acesso ao cardápio e resumo do pedido.

![Página inicial da Byte Burguer com banner, cardápio e carrinho lateral](<imagem/Captura de tela de 2026-09-09 13-56-28.png>)

### Cardápio e montagem do pedido

Busca e filtros de produtos, controle de quantidades e formulário de entrega.

![Cardápio da Byte Burguer com produtos, dois itens no carrinho e formulário de entrega](<imagem/Captura de tela de 2026-09-09 13-58-32.png>)

As capturas mostram a interface com o cardápio demonstrativo.

## Funcionalidades

### Para o cliente

- Cardápio com busca por nome e descrição e filtros por categoria.
- Carrinho com controle de quantidades e cálculo do subtotal.
- Formulário de entrega ou retirada, com revisão antes do envio.
- Confirmação com o número do pedido retornado pela API.
- Consulta do pedido pelo número, com atualização periódica do status.
- Layout adaptado para desktop e celular.

### Para a loja

- Cadastro e edição de produtos, com descrição, preço, categoria e imagem.
- Ativação e desativação de produtos no cardápio.
- Listagem de pedidos com filtro por status e atualização a cada 10 segundos.
- Consulta dos dados do cliente, itens, quantidades e valores.
- Atualização do status conforme o fluxo de atendimento.

### Na API

- Validação de dados e respostas de erro padronizadas.
- Cálculo do total com os preços cadastrados no servidor.
- Registro do preço unitário no momento da compra.
- Bloqueio de pedidos com produtos desativados.
- Persistência de produtos e pedidos em banco H2 em arquivo.
- Suporte a delivery, retirada e mesa. A interface do cliente oferece delivery e retirada.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript, React Router, Vite e CSS |
| Backend | Java 26, Spring Boot 4, Spring Web MVC e Bean Validation |
| Persistência | Spring Data JPA, Hibernate e H2 |
| Validação do projeto | JUnit, MockMvc, Node.js Test Runner, Oxlint e TypeScript |

## Organização

```text
BYTE-BURGUER/
├── backend/
│   └── src/
│       ├── main/java/com/BITEBURGUER/backend/
│       │   ├── controller/    # Endpoints REST
│       │   ├── service/       # Regras de negócio
│       │   ├── repository/    # Acesso ao banco
│       │   ├── models/        # Entidades JPA
│       │   ├── dtos/          # Dados de entrada e saída
│       │   ├── enums/         # Categorias, tipos e status
│       │   └── exception/     # Tratamento de erros
│       └── test/              # Testes do backend
└── byte-burguer/
    ├── src/
    │   ├── pages/            # Telas do cliente e da loja
    │   ├── components/       # Componentes compartilhados
    │   ├── routes/           # Rotas da aplicação
    │   ├── context/          # Estado compartilhado
    │   ├── hooks/            # Lógica do catálogo e do pedido
    │   └── services/         # Comunicação com a API
    └── tests/                # Testes dos serviços HTTP
```

O carrinho e os dados do formulário ficam em um contexto compartilhado para serem preservados ao navegar entre as páginas. No backend, controllers recebem as requisições, services aplicam as regras e repositories acessam o banco. DTOs definem os dados expostos pela API.

## Como executar

Pré-requisitos: **Java 26**, **Node.js 20.19+ na linha 20 ou 22.12+**, e **npm**. O repositório inclui o Maven Wrapper, sem necessidade de instalar Maven separadamente.

Clone o repositório:

```bash
git clone https://github.com/Isabella-Roder/BITE-BURGUER.git
cd BITE-BURGUER
```

Em um terminal, inicie a API:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows, use `mvnw.cmd spring-boot:run`. A API fica disponível em `http://localhost:8080`.

Em outro terminal, a partir da raiz do projeto, inicie o frontend:

```bash
cd byte-burguer
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`. No desenvolvimento, as chamadas a `/api` são encaminhadas para a porta 8080.

Ao iniciar o backend dentro de sua pasta, o banco é gravado em `backend/data/byteburguer.mv.db`. A variável `DATABASE_URL` permite alterar a URL JDBC configurada.

### Primeiro uso

1. Acesse `/painel/produtos` e cadastre um produto com nome, descrição, preço e categoria.
2. Volte ao cardápio, adicione o produto e abra **Meu pedido**.
3. Preencha os dados, revise e confirme o envio.
4. Guarde o número recebido ou clique em **Acompanhar pedido**.
5. Abra `/painel/pedidos`, consulte o pedido e avance seu status.
6. Consulte o acompanhamento para verificar a atualização.

Quando a API está indisponível, o cardápio exibe produtos demonstrativos identificados na tela. Eles permitem explorar a interface, mas não podem ser enviados como pedidos. Com a API conectada e o banco vazio, é necessário cadastrar os produtos pelo painel.

## Páginas

| Rota | Função |
| --- | --- |
| `/` | Início e cardápio |
| `/cardapio` | Busca e seleção de produtos |
| `/pedido` | Carrinho, formulário e consulta por número |
| `/pedido/:id` | Acompanhamento do pedido |
| `/painel/pedidos` | Pedidos recebidos e filtro por status |
| `/painel/pedidos/:id` | Detalhes e atualização do status |
| `/painel/produtos` | Gestão do cardápio |
| `/painel/produtos/novo` | Cadastro de produto |
| `/painel/produtos/:id/editar` | Edição de produto |

O painel também está acessível pelo rodapé do site.

## Endpoints

| Método | Endpoint | Operação |
| --- | --- | --- |
| GET | `/api/produtos` | Listar produtos |
| GET | `/api/produtos/{id}` | Consultar produto |
| POST | `/api/produtos` | Cadastrar produto |
| PUT | `/api/produtos/{id}` | Editar produto |
| PATCH | `/api/produtos/{id}/ativar` | Ativar produto |
| PATCH | `/api/produtos/{id}/desativar` | Desativar produto |
| POST | `/api/pedidos` | Criar pedido |
| GET | `/api/pedidos` | Listar pedidos; aceita filtro `?status=NOVO` |
| GET | `/api/pedidos/{id}` | Consultar pedido |
| PATCH | `/api/pedidos/{id}/status` | Atualizar status |

Fluxo de delivery: `NOVO` → `PREPARADO` → `SAIU_PARA_ENTREGA` → `ENTREGUE`.

Para retirada e mesa, o fluxo segue de `PREPARADO` diretamente para `ENTREGUE`.

Exemplos de requisições estão no [README do backend](backend/README.md).

## Testes e verificações

No backend:

```bash
cd backend
./mvnw test
```

Os testes verificam cenários de produtos e pedidos, incluindo validação dos itens, preços históricos, filtros, transições de status e respostas de erro.

No frontend:

```bash
cd byte-burguer
npm test
npm run lint
npm run build
```

Os testes do frontend verificam os contratos dos serviços HTTP e o tratamento de falhas. Eles não substituem a validação completa dos fluxos em um navegador com a API em execução.

## Escopo e limitações

Este é um projeto de portfólio em desenvolvimento. O fluxo principal está implementado, com os seguintes limites:

- O painel e os endpoints administrativos ainda não têm autenticação ou autorização. Uma demonstração pública deve usar apenas dados fictícios e um ambiente isolado.
- Não há pagamento online. O pagamento é combinado com a loja na entrega ou retirada.
- O frete fica a confirmar e não está incluído no total dos produtos.
- Carrinho e formulário são mantidos durante a navegação, mas reiniciam ao recarregar a página.
- A atualização dos pedidos usa consultas periódicas, sem WebSocket.
- O banco H2 e a atualização automática do schema estão configurados para desenvolvimento.
- Imagens e fontes externas dependem de conexão com a internet.

Antes de uma publicação para uso real, faltam autenticação, configuração do ambiente de produção e validação completa do fluxo integrado. Na hospedagem do frontend, as rotas devem servir `index.html`, e `/api` deve ser encaminhado ao backend.

Mais detalhes da interface estão no [README do frontend](byte-burguer/README.md).
