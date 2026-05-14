# COUMT Backend — Conectando Universitários ao Mercado de Trabalho

API REST completa para a plataforma COUMT. Desenvolvida com Node.js + Express + TypeScript + PostgreSQL (Prisma ORM).

---

## ⚡ Setup Rápido (5 minutos)

### 1. Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org))
- **PostgreSQL** instalado e rodando ([download](https://www.postgresql.org/download/))

### 2. Instalar dependências

```bash
cd backend
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/coumt_db"
JWT_SECRET="uma_chave_longa_e_aleatoria_aqui"
FRONTEND_URL="http://localhost:8080"
```

### 4. Criar o banco de dados

No PostgreSQL, crie o banco:
```sql
CREATE DATABASE coumt_db;
```

Ou via terminal:
```bash
psql -U postgres -c "CREATE DATABASE coumt_db;"
```

### 5. Rodar as migrations

```bash
npm run db:generate   # gera o cliente Prisma
npm run db:migrate    # cria as tabelas no banco
```

### 6. Popular com dados de teste (opcional)

```bash
npm run db:seed
```

Isso cria:
- **Universitário:** `aluno@teste.com` / `senha123`
- **Empresa:** `empresa@teste.com` / `senha123`

### 7. Iniciar o servidor

```bash
npm run dev
```

Servidor rodando em: `http://localhost:3000` ✅

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   └── schema.prisma          # Modelo do banco de dados
├── src/
│   ├── controllers/           # Lógica de negócio
│   │   ├── authController.ts
│   │   ├── vagasController.ts
│   │   ├── candidaturasController.ts
│   │   ├── etapasController.ts
│   │   ├── chatController.ts
│   │   ├── notificacoesController.ts
│   │   └── perfilController.ts
│   ├── routes/                # Definição das rotas
│   │   ├── auth.ts
│   │   ├── vagas.ts
│   │   ├── candidaturas.ts
│   │   ├── etapas.ts
│   │   ├── chat.ts
│   │   ├── notificacoes.ts
│   │   └── perfil.ts
│   ├── middleware/
│   │   ├── auth.ts            # JWT + controle de acesso
│   │   └── errorHandler.ts    # Tratamento global de erros
│   ├── database/
│   │   ├── prisma.ts          # Instância do Prisma
│   │   └── seed.ts            # Dados de teste
│   ├── utils/
│   │   ├── jwt.ts             # Geração/verificação de tokens
│   │   └── response.ts        # Helpers de resposta HTTP
│   ├── types/
│   │   └── index.ts           # Interfaces TypeScript
│   └── server.ts              # Entry point
├── frontend-service/
│   └── api.ts                 # Copie este arquivo pro frontend!
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/register` | Cadastro (universitário ou empresa) | ❌ |
| POST | `/login` | Login | ❌ |
| POST | `/logout` | Logout | ✅ |
| GET | `/me` | Dados do usuário logado | ✅ |

### Vagas (`/api/vagas`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/` | Listar vagas (com filtros) | ❌ |
| GET | `/:id` | Detalhes de uma vaga | ❌ |
| POST | `/` | Criar vaga | 🏢 Empresa |
| PUT | `/:id` | Editar vaga | 🏢 Empresa dona |
| DELETE | `/:id` | Deletar vaga | 🏢 Empresa dona |
| GET | `/empresa/minhas` | Vagas da empresa logada | 🏢 Empresa |
| GET | `/recomendacoes` | Vagas recomendadas | 🎓 Universitário |
| GET | `/:id/candidaturas` | Candidatos da vaga | 🏢 Empresa dona |
| GET | `/:id/etapas` | Etapas do processo | ❌ |
| POST | `/:id/etapas` | Criar etapa | 🏢 Empresa dona |

### Candidaturas (`/api/candidaturas`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/` | Se candidatar | 🎓 Universitário |
| GET | `/minhas` | Minhas candidaturas | 🎓 Universitário |
| DELETE | `/:id` | Cancelar candidatura | 🎓 Universitário |
| PATCH | `/:id/status` | Atualizar status | 🏢 Empresa |
| GET | `/recomendados/:vagaId` | Candidatos compatíveis | 🏢 Empresa |

### Chat (`/api/chat`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/:candidaturaId` | Listar mensagens | ✅ (participante) |
| POST | `/:candidaturaId/mensagens` | Enviar mensagem | ✅ (participante) |
| PATCH | `/:mensagemId/lido` | Marcar como lida | ✅ (participante) |

### Notificações (`/api/notificacoes`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/` | Listar notificações | ✅ |
| PATCH | `/ler-todas` | Marcar todas como lidas | ✅ |
| PATCH | `/:id/lido` | Marcar uma como lida | ✅ |
| DELETE | `/:id` | Deletar notificação | ✅ |

### Perfil (`/api/perfil`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/me` | Meu perfil completo | ✅ |
| GET | `/universitario/:id` | Perfil público | ❌ |
| PUT | `/universitario` | Atualizar perfil | 🎓 Universitário |
| GET | `/empresa/:id` | Perfil público da empresa | ❌ |
| PUT | `/empresa` | Atualizar perfil | 🏢 Empresa |

---

## 🔗 Conectar ao Frontend

1. Copie o arquivo `frontend-service/api.ts` para `src/services/api.ts` no seu projeto frontend.

2. Crie o arquivo `.env` no frontend:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Use os serviços no código React:
```typescript
import { authService, vagasService } from "@/services/api";

// Login
const { token, usuario } = await authService.login("email@exemplo.com", "senha");

// Listar vagas
const { data, pagination } = await vagasService.listar({ area: "TI", page: 1 });

// Se candidatar
await candidaturasService.candidatar(vagaId);
```

---

## 🔐 Autenticação

O sistema usa **JWT Bearer Token**. Após login/registro, inclua o token em todas as requisições:

```
Authorization: Bearer <seu_token_aqui>
```

---

## 🗃️ Banco de Dados

Para visualizar os dados graficamente:
```bash
npm run db:studio
```
Abre o Prisma Studio em `http://localhost:5555`.

---

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento (hot reload) |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Inicia versão compilada (produção) |
| `npm run db:generate` | Gera o cliente Prisma |
| `npm run db:migrate` | Roda as migrations do banco |
| `npm run db:migrate:prod` | Migration para produção |
| `npm run db:studio` | Abre interface visual do banco |
| `npm run db:seed` | Popula o banco com dados de teste |

---

## 🏗️ Tecnologias

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Linguagem:** TypeScript 5
- **ORM:** Prisma 5
- **Banco:** PostgreSQL
- **Auth:** JWT (jsonwebtoken)
- **Hashing:** bcryptjs
- **Validação:** Zod
- **Segurança:** Helmet, CORS

---

## 👩‍💻 Desenvolvido para

Projeto de faculdade — COUMT (Conectando Universitários ao Mercado de Trabalho)
