# Auditoria de Repositórios — jc8702

## Repositórios Identificados

### Ativos

| Repo | Framework | Vercel | Status |
|------|-----------|--------|--------|
| `dluxury-industrial-platform` | Next.js 15 App Router | `dluxury-industrial-platform-1` | ✅ **Principal** |
| `MarcenAI` | Next.js 16 canary | `marcen-ai` / `dlux` | ⚠️ Redundante |
| `dluxury-crm` | Vite + React 19 SPA | `dluxury-crm` | ⚠️ Separado |

### Arquivados / Obsoletos

| Repo | Linguagem | Motivo |
|------|-----------|--------|
| `crm-jose` | HTML | Arquivado, básico |
| `crm-jose-v2` | HTML | Arquivado, básico |
| `jmdcorp-crm` | TypeScript | Arquivado, obsoleto |
| `NLW-eSports-explorer` | HTML | Evento Rocketseat |
| `Apex---Curso-Python` | TSQL | Curso |
| `Curso-em-Video-Mundo-01` | Python | Curso |
| `devs2blu` | — | Curso |
| `dluxury-industrial-platform` | — | Renomeado |

## Arquiteturas Comparadas

| Característica | `dluxury-industrial-platform` | `MarcenAI` | `dluxury-crm` |
|----------------|------------------------------|--------|----------------|
| **Framework** | Next.js 15 | Next.js 16 | Vite + React 19 |
| **Routing** | App Router | App Router | react-router-dom v7 |
| **Auth** | next-auth v5 + bcrypt | ❌ Nenhum | jsonwebtoken + bcrypt |
| **ORM** | drizzle + Neon | drizzle + Neon | drizzle + Neon |
| **Stack AI** | `@ai-sdk/react` + Gemini + RAG | ❌ Nenhum | `ai` SDK + Gemini |
| **Escopo** | Industrial completo | Peças/xlsx | CRM genérico |
| **Neon/DB** | ✅ | ✅ | ✅ |

## Plano de Ação

### Fase 1 — Limpeza (Este Arquivo)

- [x] Identificar repositórios ativos vs. obsoletos
- [ ] Criar migration plan para CRM

### Fase 2 — Arquivar Obsoletos (Manual)

Acesse cada repo no GitHub e marque como **Archived**:

- [ ] `crm-jose` — https://github.com/jc8702/crm-jose → Settings → Danger Zone → Archive
- [ ] `crm-jose-v2` — https://github.com/jc8702/crm-jose-v2 → Settings → Danger Zone → Archive
- [ ] `jmdcorp-crm` — https://github.com/jc8702/jmdcorp-crm → Settings → Danger Zone → Archive
- [ ] `MarcenAI` — https://github.com/jc8702/MarcenAI → Archive (funcionalidade contida em `dluxury-industrial-platform`)

### Fase 3 — Plano de Migração CRM (`dluxury-crm`)

O CRM genérico (`dluxury-crm`) usa **Vite + React** — framework diferente demais para merge.

**Opção A:** Manter separado (Vercel: `dluxury-crm.vercel.app`)
**Opção B:** Migrar módulos úteis para dentro da plataforma principal:

| Módulo do CRM | Status | Migração |
|---------------|--------|----------|
| Calendário de produção | ✅ Útil | Integrar em `/producao` |
| Geração de PDF/Excel | ✅ Útil | Reutilizar lib `jspdf` + `exceljs` |
| Dashboard recharts | ✅ Útil | Integrar em `/dashboard` |
| Auth JWT próprio | ⚠️ Duplicado | Manter — já existe next-auth |
| Planilha de clientes | ✅ Útil | Integrar em `/clientes` |
| Biblioteca `mathjs` | ⚠️ Único | Avaliar uso |

### Fase 4 — Plataforma Principal (`dluxury-industrial-platform`)

Este é o repositório **único e definitivo**. Mantém:

- [x] Autenticação (next-auth v5)
- [x] ORM (drizzle + Neon + pgvector)
- [x] AI Assistant (Gemini + RAG)
- [x] Módulos: Projetos, Produção, Engenharia, Comercial, Clientes, Admin
- [x] SketchUp Plugin Integration
- [x] Rastreabilidade CNC
- [ ] **Pendência:** GEMINI_API_KEY configurada no Vercel

## Repositório Único Definitivo

```
github.com/jc8702/dluxury-industrial-platform
├── Vercel: dluxury-industrial-platform-1.vercel.app
├── Stack: Next.js 15 + next-auth v5 + drizzle + Neon + pgvector + Gemini AI
└── Escopo: Plataforma SaaS Industrial de Marcenaria completa
```