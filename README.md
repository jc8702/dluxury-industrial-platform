# MarcenAI Enterprise SaaS

Plataforma industrial para marcenaria planejada, engenharia paramétrica, validação estrutural e integração com produção (BOM/CNC).

## Arquitetura e Stack Tecnológica

Sistema baseado em Clean Architecture, Domain-Driven Design (DDD) e princípios SOLID, preparado para escalabilidade e cenários *multi-tenant* (multiempresa).

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, shadcn/ui.
- **Backend**: Vercel Functions (Server Actions / Route Handlers).
- **Banco de Dados**: PostgreSQL (via Neon Serverless).
- **ORM**: Drizzle ORM.
- **Autenticação**: Auth.js (Next-Auth v5) com RBAC (Role-Based Access Control).
- **Estado Global**: Zustand (UI/Modais) + TanStack Query (Estado de Servidor).
- **Validação**: Zod.

## Estrutura de Diretórios (Clean Architecture)

```
/src
├── app/                  # Next.js App Router (Rotas, Layouts, Pages)
├── components/           # Componentes React
│   ├── layout/           # Sidebar, Topbar, Dashboards
│   └── ui/               # Componentes genéricos (shadcn)
├── domain/               # Camada de Domínio (Entidades e Interfaces de Repositório)
├── infrastructure/       # Implementação técnica (Banco, Drizzle, Repositórios)
├── lib/                  # Utilitários (utils, constantes globais)
├── modules/              # Funcionalidades específicas (Engenharia, Produção, etc.)
├── services/             # Regras de Negócio (Use Cases)
├── stores/               # Gerenciamento de Estado Global (Zustand)
└── validators/           # Schemas de validação (Zod)
```

## Setup Local

### Pré-requisitos
- Node.js 20+
- PNPM ou NPM
- Banco PostgreSQL (Neon ou Docker local)

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de Dados (Neon)
DATABASE_URL="postgres://usuario:senha@host/marcenai?sslmode=require"

# Auth.js
AUTH_SECRET="sua_chave_secreta_gerada_via_openssl"
NEXTAUTH_URL="http://localhost:3000"
```

### Instalação

```bash
npm install
```

### Banco de Dados (Drizzle)

Gere as migrações e aplique no banco:

```bash
npm run db:generate
npm run db:push
```

### Executando em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Docker (Opcional)

Para rodar o PostgreSQL localmente via Docker:

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: marcenai
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Execute: `docker-compose up -d`. Altere a `DATABASE_URL` para apontar para `localhost`.

## Padrões de Código
- **Commits**: Seguir o padrão Conventional Commits (feat, fix, refactor).
- **Code Style**: Controlado via Prettier e ESLint. Husky e lint-staged configurados para rodar antes dos commits.
