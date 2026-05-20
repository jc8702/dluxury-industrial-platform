# RESUMO DE TRABALHO - MarcenAI Enterprise

**Última atualização:** [20/05/2026 14:40]  
**Mantido por:** IA (Antigravity Agent)

---

## 📋 Índice
1. [Informações Gerais](#informações-gerais)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Histórico de Alterações](#histórico-de-alterações)
5. [Funcionalidades Implementadas](#funcionalidades-implementadas)
6. [Problemas Conhecidos](#problemas-conhecidos)
7. [TODOs e Melhorias](#todos-e-melhorias)
8. [Decisões Arquiteturais](#decisões-arquiteturais)

---

## 📌 Informações Gerais

| Campo | Valor |
|-------|-------|
| **Nome do projeto** | MarcenAI Enterprise |
| **Descrição** | Plataforma industrial para marcenaria planejada, engenharia paramétrica, validação estrutural e integração com produção (BOM/CNC) |
| **Repositório** | dluxury-industrial-platform-1 |
| **Branch principal** | main |
| **Ambiente de desenvolvimento** | Next.js dev server (localhost:3000) |
| **Ambiente de produção** | Vercel |
| **Criado em** | 2024 |
| **Última atualização** | 20/05/2026 |

---

## 🛠️ Stack Tecnológica

### Backend
- **Linguagem/Runtime:** TypeScript, Node.js 20+
- **Framework:** Next.js 15 (App Router), Vercel Functions
- **Banco de dados:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Autenticação:** Auth.js (Next-Auth v5) com RBAC
- **Validação:** Zod
- **Outras libs principais:** Sentry, Upstash (Rate Limiting/Redis), Pusher (Real-time)

### Frontend
- **Framework/Lib:** React 19, Next.js 15
- **Linguagem:** TypeScript
- **Build tool:** Next.js (Turbopack)
- **Roteamento:** Next.js App Router
- **Estado global:** Zustand (UI/Modais), TanStack Query (Estado de Servidor)
- **UI/Styling:** TailwindCSS, shadcn/ui, Radix UI
- **Outras libs principais:** Recharts, AI SDK, ExcelJS, JSPDF, QRCode

### DevOps/Infraestrutura
- **Hospedagem backend:** Vercel
- **Hospedagem frontend:** Vercel
- **Hospedagem DB:** Neon (PostgreSQL Serverless)
- **CI/CD:** Vercel (automático)
- **Monitoramento:** Sentry, Axiom

### Dependências Críticas
```json
{
  "next": "15.5.18",
  "react": "19.0.0",
  "drizzle-orm": "0.45.2",
  "next-auth": "5.0.0-beta.31",
  "zod": "4.4.3",
  "zustand": "5.0.13",
  "@tanstack/react-query": "5.100.10"
}
```

---

## 📁 Estrutura de Arquivos

```
src/
├── app/                  # Next.js App Router (Rotas, Layouts, Pages)
│   ├── admin/           # Área administrativa
│   ├── auth/            # Autenticação
│   └── docs/            # Documentação
├── components/          # Componentes React
│   ├── ai/              # Interface de AI
│   ├── dashboard/       # Dashboards
│   ├── industrial/      # Componentes industriais
│   ├── layout/          # Sidebar, Topbar
│   ├── modulos/         # Componentes de módulos
│   ├── providers/      # Providers React
│   ├── storage/         # Upload de arquivos
│   └── ui/              # Componentes genéricos (shadcn)
├── domain/             # Camada de Domínio (Entidades e Interfaces)
├── infrastructure/     # Implementação técnica (Banco, Repositórios)
├── lib/                # Utilitários
├── modules/            # Funcionalidades específicas
│   └── production/     # Módulo de produção (Workflow, CNC, Export)
├── repositories/       # Repositórios de dados
├── services/           # Regras de Negócio (Use Cases)
├── stores/             # Gerenciamento de Estado (Zustand)
└── types/              # Tipos TypeScript

sketchup-plugin/       # Plugin Ruby para SketchUp
drizzle/               # Migrações do banco de dados
public/                # Arquivos estáticos
```

**Arquivos críticos:**

- `src/auth.ts` - Configuração de autenticação NextAuth
- `src/auth.config.ts` - Regras de autorização RBAC
- `drizzle.config.ts` - Configuração do ORM Drizzle
- `src/modules/production/` - Módulo de produção industrial
- `src/components/ai/chat-interface.tsx` - Interface de AI Assistente
- `middleware.ts` - Middleware de autenticação

---

## 📝 Histórico de Alterações

[20/05/2026 14:40] - Configuração do Sistema de Memória
Contexto:
Instalação do protocolo global de memória Antigravity para o projeto
Arquivos modificados:

/RESUMO_TRABALHO.md - Documento criado
/.gemini/antigravity/MEMORIA_PROJETO.md - Arquivo de regras globais

O que foi feito:

Criação do RESUMO_TRABALHO.md com template completo
Configuração do arquivo de memória global em .gemini/antigravity/
Estabelecimento do protocolo obrigatório para todas as interações

Decisões técnicas:

Seguir o protocolo de memória em TODAS as interações
Antes de qualquer tarefa: verificar e ler RESUMO_TRABALHO.md
Após qualquer tarefa: atualizar o documento com entrada completa


---

## ✅ Funcionalidades Implementadas

🟢 [Sistema de Autenticação]
Status: ✅ Funcionando
Descrição:
Autenticação completa com Auth.js (Next-Auth v5), proteção de rotas via middleware, e controle de acesso baseado em roles (RBAC).
Localização no código:

Backend: src/auth.ts, src/auth.config.ts
Frontend: src/app/auth/login/page.tsx
Middleware: middleware.ts

Endpoints (se aplicável):

/api/auth/* - Rotas de autenticação
/api/auth/[...nextauth] - Handler principal

Dependências:

Depende de: Drizzle ORM, Banco de dados PostgreSQL
Requerido por: Todas as rotas autenticadas

Observações importantes:

Suporta múltiplos provedores (configurável)
Roles: admin, usuário, etc.


🟢 [Dashboard Executivo]
Status: ✅ Funcionando
Descrição:
Dashboard com visualizações de KPIs, gráficos de produção e métricas industriais.
Localização no código:

Frontend: src/components/dashboard/ExecutiveDashboard.tsx
Componentes: src/components/industrial/stat-card.tsx

Observações importantes:

Utiliza Recharts para visualizações
Dados em tempo real via TanStack Query


🟢 [Módulo de Produção Industrial]
Status: ✅ Funcionando
Descrição:
Sistema completo para gestão de produção industrial: workflow, geração de CNC, exportação Excel/PDF, BOM, e integração com SketchUp.
Localização no código:

Backend: src/modules/production/application/
Frontend: src/modules/production/presentation/
Domain: src/modules/production/domain/

Arquivos principais:

src/modules/production/application/cnc-generator.ts
src/modules/production/application/export-service.ts
src/modules/production/application/workflow.ts
src/modules/production/presentation/production-dashboard.tsx

Endpoints (se aplicável):

APIs de produção para workflow e exportação

Dependências:

Depende de: ExcelJS, JSPDF, repositórios de projetos
Requerido por: Área de produção

Observações importantes:

Geração de código CNC para máquinas
Exportação de BOM em múltiplos formatos
Workflow de produção completo


🟢 [AI Assistente]
Status: ✅ Funcionando
Descrição:
Interface de chat com AI para Assistance técnico usando Google Gemini e AI SDK.
Localização no código:

Frontend: src/components/ai/chat-interface.tsx
Serviços: src/services/ (integrações AI)

Dependências:

Depende de: @ai-sdk/react, @google/generative-ai

Observações importantes:

Integração com Google Gemini para respostas inteligentes
Suporte a contexto de projetos


🟢 [Sistema de Upload Industrial]
Status: ✅ Funcionando
Descrição:
Upload de arquivos com suporte a UploadThing para gestão de arquivos industriais.
Localização no código:

Frontend: src/components/storage/IndustrialUploader.tsx

Dependências:

Depende de: uploadthing, @uploadthing/react

Observações importantes:

Tratamento de arquivos grandes
Suporte a múltiplos formatos


🟢 [Validação e Engenharia Paramétrica]
Status: ✅ Funcionando
Descrição:
Sistema de validação de projetos com algoritmos paramétricos, verificação de medidas e estruturas.
Localização no código:

Frontend: src/components/modulos/validation-panel.tsx
Serviços: src/modules/production/ (validações estruturais)

Observações importantes:

Validação em tempo real
Feedback visual para usuário


🟢 [Sistema de Empresas (Multi-tenant)]
Status: ✅ Funcionando
Descrição:
Suporte a múltiplas empresas com isolamento de dados e gestão de usuários por empresa.
Localização no código:

Frontend: src/app/admin/empresas/page.tsx
Backend: Repositórios com filtro por empresa

Observações importantes:

Preparado para cenários multi-tenant
Filtros automáticos por empresa logada


---

## 📋 TODOs e Melhorias

📌 Prioridade MÉDIA

 [DX] Padronizar estrutura de diretórios conforme Clean Architecture
 [TESTES] Adicionar testes unitários para módulos críticos
 [PERFORMANCE] Otimizar queries de Dashboard

💡 Prioridade BAIXA

 [DOCUMENTAÇÃO] Adicionar documentação de API (Swagger/OpenAPI)
 [ESTÉTICA] Revisar design system dos componentes industriais
 [DOCUMENTAÇÃO] Criar manual de usuário

---

## 🏗️ Decisões Arquiteturais

[20/05/2026] - Arquitetura Clean Architecture + DDD
Contexto:
Necesidade de escalabilidade e manutenibilidade para um sistema complexo de gestão industrial
Opções consideradas:

Monolito simples: Limitei mas não escala bem
Microservices: Complexidade alta demais para MVP
Clean Architecture + DDD: Equilíbrio ideal

Decisão final:
Escolhemos Clean Architecture + Domain-Driven Design
Justificativa técnica:

Separação clara de responsabilidades (UI, Business Logic, Data)
Facilidade de manutenção e testes
Preparado para evolução para microservices no futuro
Padrões estabelecidos: Repositories, Services, Domain Entities

Trade-offs aceitos:

Mais arquivos inicial, mas melhor organização a longo prazo
Curva de aprendizado maior para novos desenvolvedores

Critérios de revisão:
Reavaliar se complexidade exceder benefícios

---

## 📚 Glossário e Convenções

Termos do domínio

BOM (Bill of Materials): Lista de materiais do projeto
CNC: Computer Numerical Control - comando numérico para máquinas
Workflow: Fluxo de produção industrial
Paramétrico: Sistema de dimensões e variáveis

Convenções de código

Nomenclatura de componentes: PascalCase
Nomenclatura de funções: camelCase, verbos no início
Nomenclatura de arquivos: kebab-case
Estrutura de commits: conventional commits (feat:, fix:, docs:)

Padrões estabelecidos

Gerenciamento de estado: Zustand para UI, TanStack Query para Server State
Estilização: TailwindCSS com classes utilitárias
Validação: Zod em frontend e backend
Error handling: Try/catch com logs centralizados (Sentry)

---

## 🔐 Segurança e Credenciais

NUNCA COMMITAR CREDENCIAIS NESTE ARQUIVO
Variáveis de ambiente necessárias:

DATABASE_URL=postgres://...
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

Onde encontrar credenciais:

Desenvolvimento: .env.local (não commitado)
Produção: Vercel Dashboard (Environment Variables)


---

## 📖 Como usar este documento

Para desenvolvedores

Leia COMPLETAMENTE antes de iniciar qualquer tarefa
Verifique decisões arquiteturais para entender "por quês"
Consulte funcionalidades implementadas para evitar duplicação
Sempre atualize após conclusão de trabalho

Para a IA (Antigravity Agent)

ANTES de qualquer tarefa: LER este arquivo completamente
APÓS qualquer tarefa: ATUALIZAR com entrada detalhada
Priorizar: Manter histórico > implementar feature
Formato de atualização: Seguir template de entrada do histórico

Para manutenção

Revisar TODOs semanalmente
Atualizar problemas conhecidos quando resolvidos
Revisar decisões arquiteturais a cada major release


---

## ⚙️ Metadados do documento

Versão do template: 1.0
Criado em: 20/05/2026
Última revisão: 20/05/2026
Mantido por: IA (Antigravity Agent) + Desenvolvedor Humano
Localização: /RESUMO_TRABALHO.md (raiz do projeto)

---

## CHECKLIST PÓS-TAREFA (IA)

Antes de considerar qualquer tarefa concluída:

- [ ] ✅ Código implementado e funcionando
- [ ] ✅ Entrada COMPLETA adicionada no histórico
- [ ] ✅ Funcionalidade documentada (se nova)
- [ ] ✅ Funcionalidade atualizada (se existente)
- [ ] ✅ TODOs registrados (se gerados)
- [ ] ✅ Problemas conhecidos atualizados (se encontrados)
- [ ] ✅ Stack atualizada (se novas dependências)
- [ ] ✅ Decisões arquiteturais registradas (se relevantes)
- [ ] ✅ Data/hora de "Última atualização" atualizada no topo

---

## PRIORIDADE ABSOLUTA

**ESTE SISTEMA DE MEMÓRIA TEM PRIORIDADE MÁXIMA**

Se houver conflito entre:
- Implementar feature rapidamente vs. Documentar corretamente
- **SEMPRE escolha documentar corretamente**

Código sem contexto = débito técnico
Contexto completo = investimento de longo prazo

**A IA NÃO DEVE PULAR OU SIMPLIFICAR A DOCUMENTAÇÃO**