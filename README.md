# README

## Descrição do Projeto

Este projeto é uma aplicação backend construída utilizando **NestJS** e **PostgreSQL**, com o objetivo de gerenciar pedidos de uma loja. O sistema permite realizar pedidos, consultar pedidos de um usuário específico e visualizar os produtos relacionados a esses pedidos. Além disso, o projeto inclui funcionalidades de tratamento de erros e a visualização dos dados relacionados entre as tabelas do banco de dados, como usuários, produtos e pedidos.

## Funcionalidades Implementadas

- **Relacionamento entre Tabelas**: 
  - **Usuário** e **Pedido**: Um usuário pode ter vários pedidos. Cada pedido está associado a um único usuário.
  - **Produto** e **Pedido**: Cada pedido pode ter múltiplos itens (produtos). Cada item de pedido está associado a um produto específico.
  
- **Migrations**: 
  - Foram criadas migrations para gerar as tabelas no banco de dados, com os devidos relacionamentos e constraints.
  
- **Tratamento de Erros**: 
  - Tratamento de erros específicos foi implementado, como quando um produto não é encontrado ou quando a quantidade de um produto solicitado excede o estoque disponível.
  
- **Visualização de Dados**: 
  - Ao consultar um pedido, o sistema retorna os dados do pedido juntamente com as informações do usuário e dos produtos associados ao pedido.
  
## Estrutura do Banco de Dados

O projeto utiliza o **PostgreSQL** como banco de dados e define as seguintes entidades:

### Entidade `Pedido`
- **id** (UUID)
- **status** (Enum - `em_processamento`, `finalizado`, etc.)
- **valorTotal** (Decimal)
- **usuario** (Relacionamento com `UsuarioEntity`)
- **itensPedidos** (Relacionamento com `ItemPedidoEntity`)

### Entidade `Usuario`
- **id** (UUID)
- **nome** (String)
- **email** (String)
- **senha** (String)
- **createdAt** (Timestamp)
- **updatedAt** (Timestamp)

### Entidade `Produto`
- **id** (UUID)
- **nome** (String)
- **valor** (Decimal)
- **quantidadeDisponivel** (Integer)
- **descricao** (String)
- **categoria** (String)
- **createdAt** (Timestamp)
- **updatedAt** (Timestamp)

### Entidade `ItemPedido`
- **id** (UUID)
- **quantidade** (Integer)
- **precoVenda** (Decimal)
- **produto** (Relacionamento com `ProdutoEntity`)
- **pedido** (Relacionamento com `PedidoEntity`)

---

## Rotas Implementadas

### 1. Criar Pedido

**Método**: `POST`

**Endpoint**: `/pedidos`

**Descrição**: Cria um novo pedido para um usuário. O pedido inclui os produtos solicitados, suas quantidades e o valor total.

**Exemplo de Requisição**:
```json
{
  "itensPedido": [
    {
      "produtoId": "36cf9b4d-b0f6-498f-a649-cfb847f1a142",
      "quantidade": 1
    }
  ]
}
```

Exemplo de Resposta do POST:
```json
{
	"status": "em_processamento",
	"usuario": {
		"id": "ba1dc99a-2f70-4acc-9b4e-f3a37179148f",
		"nome": "Arthur Morgan",
		"email": "morgan@gmail.com",
		"senha": "1234567",
		"createdAt": "2024-12-12T04:49:52.374Z",
		"updatedAt": "2024-12-12T04:49:52.374Z",
		"deletedAt": null
	},
	"itensPedidos": [
		{
			"produto": {
				"id": "36cf9b4d-b0f6-498f-a649-cfb847f1a142",
				"nome": "Nome do Produto",
				"valor": 100,
				"quantidadeDisponivel": 2,
				"descricao": "Descrição do produto",
				"categoria": "Categoria Exemplo",
				"createdAt": "2024-12-16T21:32:12.274Z",
				"updatedAt": "2024-12-17T03:38:34.684Z",
				"deletedAt": null,
				"imagens": [],
				"caracteristicas": []
			},
			"precoVenda": 100,
			"quantidade": 1,
			"id": "0c696d77-2f92-4c0a-b946-dcdd574de727"
		}
	],
	"valorTotal": 100,
	"id": "d118911f-a8bb-46a2-bde5-db1833b22c81",
	"createdAt": "2024-12-17T03:38:34.684Z",
	"updatedAt": "2024-12-17T03:38:34.684Z",
	"deletedAt": null
}

```

## Detalhamento do Processo de Criação de Pedido
Passos do Processo:
Recebimento da Requisição:

A requisição do cliente inclui os itens do pedido com produtoId e a quantidade de cada item.
Validação do Produto:

O sistema consulta a tabela Produto para garantir que o produto existe e tem estoque suficiente.
Caso o produto não seja encontrado ou o estoque seja insuficiente, um erro é lançado.
Criação do Pedido:

O pedido é criado na tabela Pedido, com um status inicial de em_processamento.
A quantidade de cada produto no estoque é ajustada de acordo com os itens solicitados.
Retorno da Resposta:

O pedido criado é retornado com todos os dados do pedido, incluindo o usuário e os produtos solicitados, com suas informações completas (nome, preço, etc.).
Tecnologias Usadas
- NestJS: Framework para construir APIs RESTful com TypeScript.
- PostgreSQL: Banco de dados relacional utilizado para armazenar as informações dos usuários, pedidos e produtos.
- TypeORM: ORM para interagir com o banco de dados.
- UUID: Utilizado para geração de IDs únicos para entidades como pedidos e usuários.


