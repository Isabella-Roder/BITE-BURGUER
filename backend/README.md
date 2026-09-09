# Byte Burguer — API

Java 26 e Spring Boot. Para iniciar na porta 8080:

```bash
cd backend
./mvnw spring-boot:run
```

Os dados ficam em `backend/data/byteburguer.mv.db` quando iniciado nessa pasta. `DATABASE_URL` permite substituir a URL JDBC. Os testes usam H2 em memória, separado do banco de desenvolvimento. A configuração atual usa atualização automática do schema para desenvolvimento.

## Produtos

| Método | Endpoint | Ação |
| --- | --- | --- |
| GET | `/api/produtos` | Listar produtos, inclusive inativos |
| GET | `/api/produtos/{id}` | Consultar produto |
| POST | `/api/produtos` | Cadastrar |
| PUT | `/api/produtos/{id}` | Atualizar |
| PATCH | `/api/produtos/{id}/ativar` | Ativar |
| PATCH | `/api/produtos/{id}/desativar` | Desativar |

Exemplo de cadastro:

```json
{"nome":"Byte Bacon","descricao":"Hambúrguer, bacon e cheddar","imgUrl":"/food-placeholder.svg","preco":29.90,"categoria":"HAMBURGUER_ARTESANAL"}
```

## Pedidos

| Método | Endpoint | Ação |
| --- | --- | --- |
| POST | `/api/pedidos` | Criar e retornar 201 com Location |
| GET | `/api/pedidos` | Listar do mais recente ao mais antigo |
| GET | `/api/pedidos?status=NOVO` | Filtrar por status |
| GET | `/api/pedidos/{id}` | Consultar detalhes |
| PATCH | `/api/pedidos/{id}/status` | Atualizar status |

Use o UUID de um produto cadastrado:

```json
{
  "nomeCliente": "Maria",
  "telefoneCliente": "91999999999",
  "tipo": "DELIVERY",
  "endereco": "Rua A, 12 — Centro",
  "complemento": "Casa 2",
  "itens": [{"produtoId": "UUID-DO-PRODUTO", "quantidade": 2}]
}
```

Tipos: `DELIVERY` exige endereço, `MESA` exige `numeroMesa` positivo, `RETIRADA` dispensa ambos. Telefone contém 10 ou 11 dígitos. Itens exigem produto existente e ativo e quantidade positiva. O servidor calcula o total e registra o preço unitário da compra; o total não inclui frete.

Status para delivery: `NOVO` → `PREPARADO` → `SAIU_PARA_ENTREGA` → `ENTREGUE`. Para mesa/retirada: `NOVO` → `PREPARADO` → `ENTREGUE`. Foi mantido o nome `PREPARADO` do modelo existente. Repetir o status atual é permitido; pular ou retroceder retorna 400.

```json
{"status":"PREPARADO"}
```

Erros retornam `status`, `mensagem` e `detalhes`: 400 para validação/formato/regra de negócio e 404 para recurso inexistente.

O frontend utiliza os produtos ativos e envia o pedido após revisão. Produtos demonstrativos não podem ser enviados. Não há pagamento online. Os endpoints administrativos ainda não têm autenticação; esta API está preparada para desenvolvimento local, não para exposição pública do painel.

## Testes

```bash
./mvnw test
```
