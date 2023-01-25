<h1 align="center">Valex</h1>

## Tecnologias

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px" alt="Node.js" />  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px" alt="Express.js" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px" alt="PostgreSQL" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" height="30px" />
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

## Descrição

O Valex é um sistema de cartões de benefícios, possibilitando a criação, ativação, bloqueio, desbloqueio e visualização de saldo de cartões físico e virtual. Além disso, é possível recarregar o cartão e realizar compras online ou em "points of sale" (POS).

## Features

-   Criar cartão;
-   Ativar cartão;
-   Bloquear cartão;
-   Desbloquear cartão;
-   Visualizar o saldo e as transações do cartão;
-   Recarregar cartão;
-   Realizar compra em um "point of sale" (POS);
-   Realizar compra online;
-   Criar cartão virtual.

## Rotas

### Criar cartão

```http
POST /cards
```

#### Request:

| Headers     | Tipo     | Descrição                                                         |
| :---------- | :------- | :---------------------------------------------------------------- |
| `x-api-key` | `string` | **Obrigatório**. API key da empresa que está cadastrando o cartão |

| Body         | Tipo      | Descrição                                    |
| :----------  | :-------- | :------------------------------------------- |
| `employeeId` | `inteiro` | **Obrigatório**. Id do usuário               |
| `type`       | `string`  | **Obrigatório**. Tipo do cartão de benefício |    

`Types válidos: [groceries, restaurant, transport, education, health]`

#### Response:

```json
{
  "id": 1,
  "number": "1111111111111111",
  "employeeId": 1,
  "cardholderName": "NAME N NAME",
  "securityCode": "111",
  "expirationDate": "01/27",
  "isVirtual": false,
  "isBlocked": false,
  "type": "card type"
}
```

### Ativar cartão

```http
PATCH /cards/activate
```

#### Request:

| Body         | Tipo     | Descrição                                           |
| :------------| :------- | :-------------------------------------------------- |
| `cardId`     | `inteiro`| **Obrigatório**. Id do cartão                       |
| `cvc`        | `string` | **Obrigatório**. Código de segurança (CVC) do cartão|
| `password`   | `string` | **Obrigatório**. Senha do cartão                    |

`A senha deve ser composta por 4 digitos e somente números`

`O código de segurança (CVC) deve ser composto por somente 3 números`

### Bloquear cartão

```http
PATCH /cards/block
```

#### Request:

| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------|
| `cardId`         | `inteiro`| **Obrigatório**. Id do cartão    |
| `password`       | `string` | **Obrigatório**. Senha do cartão |

### Desbloquear cartão

```http
PATCH /cards/unlock
```

#### Request:

| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------|
| `cardId`         | `inteiro`| **Obrigatório**. Id do cartão    |
| `password`       | `string` | **Obrigatório**. Senha do cartão |

### Visualizar saldo e transações do cartão

```http
GET /cards/balance/:cardId
```

`cardId é um parâmetro de rota que representa onde deve ser informado o id do cartão`

#### Response:

```json
{
  "balance": 1,
  "transactions": [
    { "id": 1, "cardId": 1, "businessId": 1, "businessName": "NomeDaEmpresa", "timestamp": "DD/MM/AAAA", "amount": 1 },
    ...
  ],
  "recharges": [
    { "id": 1, "cardId": 1, "timestamp": "DD/MM/AAAA", "amount": 1 },
    ...
  ]
}
```

### Recarregar cartão

```http
POST /recharges
```

#### Request:

| Headers     | Tipo     | Descrição                                                         |
| :---------- | :------- | :---------------------------------------------------------------- |
| `x-api-key` | `string` | **Obrigatório**. API key da empresa que está cadastrando o cartão |

| Body             | Tipo      | Descrição                         |
| :--------------- | :-------- | :-------------------------------- |
| `cardId`         | `inteiro` | **Obrigatório**. Id do cartão     |
| `amount`         | `inteiro` | **Obrigatório**. Valor da recarga |

### Realizar compra em um "point of sale" (POS)

```http
POST /payments
```

#### Request:

| Body             | Tipo      | Descrição                                                         |
| :--------------- | :-------- | :---------------------------------------------------------------- |
| `cardId`         | `inteiro` | **Obrigatório**. Id do cartão                                     |
| `password`       | `string`  | **Obrigatório**. Senha do cartão                                  |
| `businessId`     | `inteiro` | **Obrigatório**. Id da empresa onde está sendo realizada a compra |
| `amount`         | `inteiro` | **Obrigatório**. Valor da compra                                  |

### Realizar compra online

```http
POST /payments/online
```

#### Request:

| Body             | Tipo      | Descrição                                                         |
| :--------------- | :-------- | :---------------------------------------------------------------- |
| `number`         | `string`  | **Obrigatório**. Número do cartão                                 |
| `cardholderName` | `string`  | **Obrigatório**. Nome no cartão                                   |
| `expirationDate` | `string`  | **Obrigatório**. Data de expiração do cartão                      |
| `cvc`            | `string`  | **Obrigatório**. Código de segurança (CVC) do cartão              |
| `businessId`     | `inteiro` | **Obrigatório**. Id da empresa onde está sendo realizada a compra |
| `amount`         | `inteiro` | **Obrigatório**. Valor da compra                                  |

`Formato da data de expiração: "MM/AA"`

`O código de segurança (CVC) deve ser composto por somente 3 números`

### Criar cartão virtual

```http
POST /cards/virtual
```

#### Request:

| Body                   | Tipo      | Descrição                                                             |
| :--------------------- | :-------- | :-------------------------------------------------------------------- |
| `originalCardId`       | `inteiro` | **Obrigatório**. Id do cartão físico ao qual o virtual será vinculado |
| `originalCardPassword` | `string`  | **Obrigatório**. Senha do cartão físico                               |

`A senha deve ser composta por 4 digitos e somente números`

## Variáveis de ambiente

Para rodar este projeto, você precisará adicionar as seguintes variáveis de ambiente ao seu arquivo **.env**:

`PORT = número #recomendado:5000`

`DATABASE_URL = postgres://nomeDeUsuário:senha@nomeDoServidor:5432/nomeDoBancoDeDados`

`CVC_SECRET_KEY = qualquer string`

## Rodando a aplicação localmente

Clone o projeto

```bash
  git clone https://github.com/lugablima/valex.git
```

Vá para a pasta onde está o projeto

```bash
  cd valex/
```

Instale as dependências do projeto

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

## Deploy da aplicação

Se preferir, é possível testar a aplicação por meio de um REST API Client (Insomnia, Postman, Thunder Client, etc) e acessando o link de deploy da mesma:

<a href="https://valex.up.railway.app" target="_blank">https://valex.up.railway.app</a>
