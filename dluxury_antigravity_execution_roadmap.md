FASE 1 — CORE FOUNDATION
Sub-Fase 1.1: Scaffold Mínimo Next.js
Objetivo
Criar estrutura Next.js 15 funcional com TypeScript e validar deploy.
Prompt Antigravity
CONTEXTO:
Você é um arquiteto Next.js 15 especialista em App Router e TypeScript strict.

OBJETIVO:
Criar estrutura Next.js 15 mínima, limpa e pronta para escalar.

STACK OBRIGATÓRIA:
- Next.js 15.1+ (App Router)
- TypeScript 5.3+ (strict mode)
- Vercel Deploy

ESTRUTURA BASE:
/app
  /layout.tsx
  /page.tsx
  /api
    /health/route.ts
/lib
  /env.ts (validação zod)
/types
  /index.ts

REQUISITOS CRÍTICOS:
1. Criar página inicial com "D'Luxury Industrial Platform"
2. Criar endpoint /api/health que retorna { status: "ok", timestamp, version }
3. Configurar TypeScript strict mode (noImplicitAny, strictNullChecks)
4. Configurar variáveis ambiente com validação Zod
5. Adicionar metadata SEO básica

ARQUIVOS ESPECÍFICOS:

next.config.ts:
- output: standalone
- reactStrictMode: true
- typescript: { ignoreBuildErrors: false }

tsconfig.json:
- strict: true
- baseUrl: "."
- paths: { "@/*": ["./*"] }

.env.example:
- NODE_ENV
- VERCEL_URL
- DATABASE_URL (placeholder)

package.json:
- "type": "module"
- scripts: dev, build, start, lint, type-check

NÃO INCLUIR AINDA:
- Tailwind
- shadcn/ui
- Auth
- Database
- Redis

VALIDAÇÃO:
- npm run build deve passar sem erros
- npm run type-check deve passar 100%
- /api/health deve retornar JSON válido
- Deploy Vercel deve funcionar

GERAR:
- Código completo de todos os arquivos
- README.md com comandos setup
- .gitignore configurado
Critérios de Aceite

 npm run build passa sem warnings
 npm run type-check sem erros
 Deploy Vercel OK
 /api/health retorna 200 + JSON
 Página inicial renderiza corretamente


Sub-Fase 1.2: Tailwind + Design System Base
Objetivo
Configurar Tailwind com tema industrial e validar responsividade.
Prompt Antigravity
CONTEXTO:
Sistema SaaS industrial para marcenaria planejada.
Stack atual: Next.js 15 + TypeScript (já funcionando).

OBJETIVO:
Adicionar Tailwind CSS com tema industrial profissional.

DESIGN SYSTEM BASE:
- Paleta escura industrial (grays, blues metálicos)
- Typography scale hierárquica
- Spacing consistente
- Responsivo mobile-first

IMPLEMENTAR:

1. Instalação Tailwind:
   - tailwindcss
   - postcss
   - autoprefixer

2. Configuração tailwind.config.ts:
   - darkMode: 'class'
   - theme.extend.colors:
     * primary: azul industrial (#0A4D8C)
     * secondary: cinza metálico (#64748B)
     * accent: laranja engenharia (#F97316)
     * background: (#0F172A, #1E293B)
     * surface: (#1E293B, #334155)
   - theme.extend.fontFamily:
     * sans: Inter, system-ui
     * mono: 'JetBrains Mono', monospace

3. Criar /app/globals.css:
   - @tailwind directives
   - CSS variables para theme switching
   - Reset básico

4. Criar /components/ui/typography.tsx:
   - H1, H2, H3 (estilos industriais)
   - Paragraph, Small, Code
   - Props: variant, className

5. Atualizar /app/page.tsx:
   - Usar componentes typography
   - Layout responsivo 3 colunas (lg:grid-cols-3)
   - Testar dark/light toggle manual

VALIDAÇÃO:
- Página deve ser 100% responsiva (320px - 1920px)
- Theme toggle deve funcionar
- Tipografia deve escalar corretamente
- Build não deve ter warnings

NÃO ADICIONAR:
- shadcn/ui (próxima fase)
- Componentes complexos
- Animações elaboradas

GERAR:
- Código completo
- Screenshot mockup ASCII da página
Critérios de Aceite

 Tailwind funcionando
 Tema dark/light toggle manual OK
 Responsivo mobile/tablet/desktop
 Typography escalável


Sub-Fase 1.3: shadcn/ui + Componentes Base
Objetivo
Instalar shadcn/ui e criar componentes industriais reutilizáveis.
Prompt Antigravity
CONTEXTO:
Sistema industrial Next.js 15 com Tailwind já configurado.
Paleta: industrial dark (#0F172A, #0A4D8C, #F97316).

OBJETIVO:
Configurar shadcn/ui e criar componentes industriais base.

STACK:
- shadcn/ui (latest)
- Radix UI
- class-variance-authority
- clsx + tailwind-merge

IMPLEMENTAR:

1. Instalar shadcn/ui:
   npx shadcn@latest init
   - style: New York
   - base color: Slate
   - CSS variables: yes

2. Instalar componentes iniciais:
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add badge
   npx shadcn@latest add separator
   npx shadcn@latest add skeleton

3. Customizar components/ui/button.tsx:
   - Variante "industrial" (bordas metálicas, hover glow)
   - Variante "danger" (vermelho engenharia)
   - Variante "success" (verde produção)

4. Criar /components/industrial/stat-card.tsx:
   - Card com ícone, label, valor, trend
   - Uso: métricas dashboard
   - Props: { icon, label, value, trend: 'up'|'down', variant }

5. Criar /components/industrial/section-header.tsx:
   - Header com título, descrição, action button
   - Separator automático
   - Props: { title, description, action? }

6. Atualizar /app/page.tsx:
   - 3 StatCards mockados (Projetos Ativos, Em Produção, Concluídos)
   - SectionHeader ("Dashboard Industrial")
   - Grid responsivo

VALIDAÇÃO:
- Componentes devem funcionar em dark/light
- Hover states profissionais
- Acessibilidade (aria-labels, keyboard navigation)
- Build sem warnings

NÃO CRIAR AINDA:
- Sidebar
- Topbar
- Modals complexos
- Data tables

GERAR:
- Código completo
- Storybook dos componentes (opcional, descrição textual)
Critérios de Aceite

 shadcn/ui configurado
 Button + Card + Badge funcionando
 StatCard customizado renderiza
 Acessibilidade básica OK


Sub-Fase 1.4: Layout Industrial (Sidebar + Topbar)
Objetivo
Criar shell da aplicação com navegação funcional.
Prompt Antigravity
CONTEXTO:
Sistema industrial Next.js 15 com shadcn/ui configurado.
Stack atual: Next.js + Tailwind + shadcn/ui.

OBJETIVO:
Criar layout enterprise com sidebar colapsável e topbar.

ARQUITETURA:
/app
  /layout.tsx (root layout sem UI)
  /(dashboard)
    /layout.tsx (DashboardLayout com sidebar + topbar)
    /page.tsx (dashboard home)
    /projetos/page.tsx
    /producao/page.tsx

IMPLEMENTAR:

1. Criar /components/layout/sidebar.tsx:
   - Colapsável (cmd+b para toggle)
   - Logo D'Luxury (texto estilizado)
   - Menu items:
     * Dashboard (ícone LayoutDashboard)
     * Projetos (ícone Boxes)
     * Produção (ícone Factory)
     * SketchUp (ícone Cube)
     * Configurações (ícone Settings)
   - Active state highlight
   - Collapse state persiste (localStorage)
   - Width: 260px (expanded), 80px (collapsed)

2. Criar /components/layout/topbar.tsx:
   - Breadcrumbs dinâmicos
   - Command palette trigger (cmd+k)
   - Notifications badge (mockado)
   - User menu (mockado: "José Costa")
   - Theme toggle (sol/lua)

3. Criar /components/layout/dashboard-layout.tsx:
   - Grid: sidebar (fixed) + main (flex-1)
   - Topbar sticky
   - Scroll independente no main
   - Responsivo (sidebar vira modal em mobile)

4. Criar rotas placeholder:
   - /(dashboard)/projetos/page.tsx
   - /(dashboard)/producao/page.tsx
   - Cada uma com SectionHeader + conteúdo mockado

5. Implementar state management sidebar:
   - Zustand store (sidebar-store.ts)
   - isCollapsed, toggle()
   - Persist em localStorage

VALIDAÇÃO:
- Sidebar collapse smooth (transition 200ms)
- Breadcrumbs atualizam corretamente
- Mobile: sidebar vira drawer
- Scroll main independente
- Theme toggle funciona em todas as páginas

ÍCONES:
Usar lucide-react.

NÃO IMPLEMENTAR AINDA:
- Command palette real
- Notificações reais
- Auth guard

GERAR:
- Código completo
- Navegação deve funcionar com Next.js Link
Critérios de Aceite

 Sidebar colapsa/expande (cmd+b)
 Navegação funciona
 Breadcrumbs dinâmicos OK
 Responsivo mobile (drawer)
 State persiste (localStorage)


FASE 2 — MODELAGEM INDUSTRIAL
Sub-Fase 2.1: Setup Neon + Drizzle
Objetivo
Configurar banco de dados e ORM com primeira tabela de teste.
Prompt Antigravity
CONTEXTO:
Sistema industrial Next.js 15 rodando em Vercel.
Precisamos adicionar PostgreSQL (Neon) + Drizzle ORM.

OBJETIVO:
Configurar banco Neon, Drizzle ORM e criar primeira tabela validável.

STACK:
- Neon PostgreSQL (serverless)
- Drizzle ORM
- drizzle-kit (migrations)
- @neondatabase/serverless (driver)

IMPLEMENTAR:

1. Instalar dependências:
   - drizzle-orm
   - drizzle-kit
   - @neondatabase/serverless
   - dotenv

2. Criar /lib/db/index.ts:
   - Cliente Neon serverless
   - Pool connection otimizado para Vercel
   - Drizzle instance
   - Tipos exportados

3. Criar /lib/db/schema/users.ts:
   - Tabela "usuarios" de teste
   - Campos:
     * id (uuid, default gen_random_uuid())
     * nome (text, not null)
     * email (text, unique, not null)
     * created_at (timestamp, default now())
     * updated_at (timestamp, default now())

4. Configurar drizzle.config.ts:
   - driver: pg
   - dbCredentials: { connectionString: DATABASE_URL }
   - schema: "./lib/db/schema/*"
   - out: "./drizzle/migrations"

5. Criar scripts package.json:
   - "db:generate": "drizzle-kit generate"
   - "db:migrate": "drizzle-kit migrate"
   - "db:push": "drizzle-kit push"
   - "db:studio": "drizzle-kit studio"

6. Criar /app/api/test-db/route.ts:
   - GET: retorna count de usuários
   - POST: cria usuário teste
   - Validação com Zod

7. Atualizar .env.example:
   - DATABASE_URL="postgresql://..."

VALIDAÇÃO:
- npm run db:generate deve gerar migration
- npm run db:push deve aplicar no Neon
- npm run db:studio deve abrir interface
- POST /api/test-db deve inserir registro
- GET /api/test-db deve retornar count

IMPORTANTE:
- Usar @neondatabase/serverless (não pg)
- Pool max connections: 1 (Vercel Hobby)
- Prepared statements: false (Neon serverless)

NÃO CRIAR AINDA:
- Tabelas de produção
- Relacionamentos complexos
- Migrations avançadas

GERAR:
- Código completo
- Comandos setup passo a passo
- Teste manual cURL para /api/test-db
Critérios de Aceite

 Neon conecta sem erros
 db:studio abre interface
 Migration aplica com sucesso
 POST/GET /api/test-db funciona
 Deploy Vercel com DATABASE_URL OK


Sub-Fase 2.2: Schema Core (Empresas + Projetos)
Objetivo
Criar tabelas core do domínio com relacionamentos básicos.
Prompt Antigravity
CONTEXTO:
Neon + Drizzle funcionando.
Tabela "usuarios" validada.
Sistema multiempresa para marcenaria planejada.

OBJETIVO:
Criar schema core: empresas, projetos, clientes.

MODELO:
empresa 1:N projetos
empresa 1:N clientes
projeto N:1 cliente

IMPLEMENTAR:

1. Criar /lib/db/schema/empresas.ts:
   - id (uuid, pk)
   - nome (text, not null)
   - cnpj (text, unique, not null)
   - ativo (boolean, default true)
   - created_at, updated_at

2. Criar /lib/db/schema/clientes.ts:
   - id (uuid, pk)
   - empresa_id (uuid, fk empresas)
   - nome (text, not null)
   - cpf_cnpj (text)
   - email (text)
   - telefone (text)
   - ativo (boolean, default true)
   - created_at, updated_at
   - Index: empresa_id

3. Criar /lib/db/schema/projetos.ts:
   - id (uuid, pk)
   - empresa_id (uuid, fk empresas)
   - cliente_id (uuid, fk clientes, nullable)
   - codigo (text, not null) // "PROJ-2024-001"
   - nome (text, not null)
   - status (enum: "rascunho", "orcamento", "aprovado", "producao", "concluido")
   - data_inicio (date, nullable)
   - data_entrega (date, nullable)
   - valor_total (decimal(12,2), default 0)
   - created_at, updated_at
   - Index: empresa_id, cliente_id, status
   - Unique: (empresa_id, codigo)

4. Criar /lib/db/schema/index.ts:
   - Export all schemas
   - Export tipos inferidos

5. Criar seed /scripts/seed-core.ts:
   - 1 empresa teste "D'Luxury Demo"
   - 3 clientes teste
   - 5 projetos teste (diversos status)
   - Usar Drizzle insert

6. Criar API CRUD básica:
   - /api/projetos/route.ts (GET list, POST create)
   - /api/projetos/[id]/route.ts (GET one, PATCH update, DELETE)
   - Validação Zod em todos endpoints
   - Filtro por empresa_id (preparar multiempresa)

VALIDAÇÃO:
- Migration aplica sem erros
- Seed popula dados
- GET /api/projetos retorna lista
- POST /api/projetos cria registro
- Foreign keys enforçam integridade

REGRAS DE NEGÓCIO:
- Soft delete (ativo = false)
- updated_at auto-atualiza (trigger ou middleware)
- codigo projeto auto-incrementa por empresa

NÃO IMPLEMENTAR:
- RBAC/Auth (ainda)
- Auditoria completa
- Relacionamentos complexos (ambientes, módulos)

GERAR:
- Código completo
- Script seed executável
- Testes manuais cURL
Critérios de Aceite

 Migration aplica com FK constraints
 Seed popula empresas + clientes + projetos
 GET /api/projetos retorna JSON válido
 POST cria projeto com validação
 FK integrity funciona (cascade?)


Sub-Fase 2.3: Schema SketchUp (Módulos + Peças)
Objetivo
Criar tabelas para receber dados exportados do SketchUp.
Prompt Antigravity
CONTEXTO:
Schema core funcionando (empresas, projetos, clientes).
Próximo: receber módulos exportados do SketchUp.

OBJETIVO:
Criar schema para armazenar geometria e metadados do SketchUp.

MODELO:
projeto 1:N ambientes (cozinha, dormitório, etc)
ambiente 1:N modulos_sketchup (armário aéreo, balcão, etc)
modulo 1:N pecas (laterais, prateleiras, portas, etc)

IMPLEMENTAR:

1. Criar /lib/db/schema/ambientes.ts:
   - id (uuid, pk)
   - projeto_id (uuid, fk projetos)
   - nome (text) // "Cozinha", "Dormitório 1"
   - tipo (enum: "cozinha", "dormitorio", "banheiro", "lavanderia", "outro")
   - ordem (integer) // para ordenação visual
   - created_at, updated_at

2. Criar /lib/db/schema/modulos_sketchup.ts:
   - id (uuid, pk)
   - ambiente_id (uuid, fk ambientes)
   - sketchup_guid (text, unique) // GUID do componente SketchUp
   - nome (text) // "Armário Aéreo 01"
   - tipo_modulo (enum: "aereo", "balcao", "gaveteiro", "torre", "outro")
   - largura (decimal(10,2))
   - altura (decimal(10,2))
   - profundidade (decimal(10,2))
   - material_padrao (text) // "MDF Branco 18mm"
   - json_bruto (jsonb) // dados completos do SketchUp
   - validado (boolean, default false)
   - created_at, updated_at
   - Index: ambiente_id, sketchup_guid

3. Criar /lib/db/schema/pecas.ts:
   - id (uuid, pk)
   - modulo_id (uuid, fk modulos_sketchup)
   - codigo (text) // "LAT-01", "PRAT-02"
   - nome (text) // "Lateral Esquerda"
   - tipo_peca (enum: "lateral", "base", "tampo", "fundo", "prateleira", "porta", "gaveta", "divisoria", "outro")
   - largura (decimal(10,2))
   - altura (decimal(10,2))
   - espessura (decimal(10,2)) // 18mm, 15mm, etc
   - quantidade (integer, default 1)
   - material (text) // "MDF Branco 18mm"
   - acabamento (text, nullable) // "Fita Branca 22mm"
   - observacoes (text, nullable)
   - created_at, updated_at
   - Index: modulo_id

4. Criar /lib/db/schema/index.ts:
   - Adicionar exports

5. Criar endpoint /api/sketchup/import/route.ts:
   - POST: recebe JSON do plugin SketchUp
   - Estrutura esperada:
```json
     {
       "projeto_codigo": "PROJ-2024-001",
       "ambiente_nome": "Cozinha",
       "modulos": [
         {
           "sketchup_guid": "abc-123",
           "nome": "Armário Aéreo",
           "largura": 800,
           "altura": 700,
           "profundidade": 350,
           "tipo": "aereo"
         }
       ]
     }
```
   - Validação Zod rigorosa
   - Cria ambiente se não existir
   - Cria módulo + peças básicas mockadas
   - Retorna IDs criados

6. Criar seed /scripts/seed-sketchup.ts:
   - 1 ambiente "Cozinha"
   - 2 módulos: "Aéreo 01", "Balcão 01"
   - 4 peças por módulo (laterais, tampo, fundo, prateleira)

VALIDAÇÃO:
- Migration OK
- Seed popula estrutura completa
- POST /api/sketchup/import aceita JSON mockado
- Relacionamentos funcionam (projeto → ambiente → módulo → peça)

IMPORTANTE:
- json_bruto em modulos_sketchup guarda tudo do SketchUp
- Peças ainda são mockadas (engine paramétrica vem depois)
- Validação geométrica vem em fase posterior

NÃO CRIAR:
- Engine de cálculo de peças
- Validações estruturais complexas
- Ferragens, usinagens

GERAR:
- Código completo
- JSON exemplo para teste
- cURL para testar import
Critérios de Aceite

 Tabelas criadas com FKs
 Seed popula hierarquia completa
 POST /api/sketchup/import aceita JSON
 JSONB armazena dados brutos
 Queries por projeto funcionam


FASE 3 — AUTH ENTERPRISE
Sub-Fase 3.1: Auth.js Setup Mínimo
Objetivo
Configurar Auth.js com login email/senha e sessão persistente.
Prompt Antigravity
CONTEXTO:
Sistema com Neon + Drizzle funcionando.
Schema: usuarios, empresas, projetos.

OBJETIVO:
Implementar autenticação básica com Auth.js (NextAuth).

STACK:
- next-auth@beta (v5)
- Drizzle adapter
- Credentials provider (email/password)

IMPLEMENTAR:

1. Instalar:
   - next-auth@beta
   - @auth/drizzle-adapter
   - bcryptjs + @types/bcryptjs

2. Atualizar /lib/db/schema/usuarios.ts:
   - senha_hash (text, not null)
   - empresa_id (uuid, fk empresas)
   - perfil (enum: "admin", "engenharia", "producao", "comercial")
   - ativo (boolean, default true)
   - ultimo_login (timestamp, nullable)

3. Criar /lib/auth/auth.config.ts:
   - CredentialsProvider
   - session: { strategy: "jwt" }
   - callbacks: jwt, session
   - Verificar senha com bcrypt

4. Criar /lib/auth/index.ts:
   - Export auth, signIn, signOut
   - Configurar DrizzleAdapter

5. Criar /app/api/auth/[...nextauth]/route.ts:
   - Handlers GET/POST

6. Criar /app/(auth)/login/page.tsx:
   - Form: email, senha
   - shadcn/ui Form + Input
   - Client component com useFormState
   - Action: signIn("credentials")
   - Redirect para /dashboard após sucesso

7. Criar /middleware.ts:
   - Proteger rotas /(dashboard)/*
   - Redirect não-autenticados para /login
   - Permitir: /login, /api/auth/*, /api/health

8. Criar script /scripts/create-user.ts:
   - Criar usuário admin teste
   - Bcrypt hash da senha
   - Associar à empresa seed

VALIDAÇÃO:
- Login com credenciais corretas funciona
- Redirect para /dashboard
- Middleware bloqueia rotas protegidas
- Logout funciona
- Session persiste (refresh página)

SEGURANÇA:
- Senhas com bcrypt (salt rounds: 10)
- JWT secret aleatório (.env)
- CSRF protection nativo do NextAuth

NÃO IMPLEMENTAR:
- OAuth providers
- Magic link
- Recuperação senha
- RBAC completo (só preparar perfil)
- 2FA

GERAR:
- Código completo
- Script create-user
- Teste manual: login → dashboard → logout
Critérios de Aceite

 Login funciona com email/senha
 Middleware protege rotas
 Session persiste após refresh
 Logout funciona
 Script create-user OK


Sub-Fase 3.2: RBAC Básico + Multiempresa
Objetivo
Implementar controle de acesso por perfil e isolamento de dados por empresa.
Prompt Antigravity
CONTEXTO:
Auth.js funcionando com login.
Schema: usuarios têm empresa_id e perfil.

OBJETIVO:
Implementar RBAC básico e filtro automático por empresa.

PERFIS:
- admin: acesso total
- engenharia: projetos, módulos, validações
- producao: ordens, peças, impressão
- comercial: projetos, clientes, orçamentos

IMPLEMENTAR:

1. Criar /lib/auth/permissions.ts:
```ts
   const PERMISSIONS = {
     "admin": ["*"],
     "engenharia": ["projetos.read", "projetos.write", "modulos.*", "validacoes.*"],
     "producao": ["projetos.read", "ordens.*", "pecas.read"],
     "comercial": ["projetos.*", "clientes.*", "orcamentos.*"]
   }
   export function hasPermission(perfil, action) { ... }
```

2. Criar /lib/auth/get-session.ts:
   - Server function async
   - Retorna { userId, empresaId, perfil, nome }
   - Throw error se não autenticado

3. Criar /lib/db/filters.ts:
   - whereEmpresa(empresaId): fragment Drizzle
   - Aplicar em todas queries automáticamente

4. Atualizar /app/api/projetos/route.ts:
   - Adicionar getSession() no início
   - Filtrar por empresaId automaticamente
   - Validar permission "projetos.read"

5. Criar /app/(dashboard)/layout.tsx:
   - Mostrar nome usuário + perfil no topbar
   - Badge com cor por perfil

6. Criar /components/auth/require-permission.tsx:
   - Client component
   - Props: permission, fallback?
   - Esconde children se sem permissão

7. Criar hook /hooks/use-permissions.ts:
   - useSession do NextAuth
   - Retorna { hasPermission(action), perfil }

8. Atualizar sidebar:
   - Menu items condicionais:
     * "Produção" só para producao, engenharia, admin
     * "Clientes" só para comercial, admin
   - Usar RequirePermission ou hook

VALIDAÇÃO:
- Admin vê tudo
- Engenharia não vê menu Clientes
- Produção não consegue editar projetos
- Queries filtram por empresa_id automaticamente
- Trocar de empresa no seed testa isolamento

IMPORTANTE:
- NUNCA confiar em frontend para segurança
- SEMPRE validar no backend (API routes)
- Filtro empresa_id em TODA query

NÃO IMPLEMENTAR:
- Troca de empresa (multi-tenant)
- Permissões granulares (campo-level)
- Auditoria de acesso

GERAR:
- Código completo
- Matriz de permissões por perfil
- Testes: criar usuários de cada perfil e validar acessos
Critérios de Aceite

 Permissões por perfil funcionam
 API filtra por empresa_id automaticamente
 Menu condicional por perfil OK
 Usuários de empresas diferentes não veem dados um do outro


FASE 4 — DASHBOARD BASE
Sub-Fase 4.1: Dashboard Home (Métricas)
Objetivo
Criar dashboard principal com métricas reais do banco.
Prompt Antigravity
CONTEXTO:
Auth + RBAC funcionando.
Schema: projetos com status.

OBJETIVO:
Criar dashboard home com métricas industriais.

MÉTRICAS:
1. Projetos por status (count)
2. Valor total em produção (sum)
3. Entregas atrasadas (count, where data_entrega < today)
4. Módulos validados vs não-validados

IMPLEMENTAR:

1. Criar /lib/services/dashboard-service.ts:
```ts
   export async function getDashboardMetrics(empresaId: string) {
     // Query com Drizzle
     // Retornar:
     // - projetosAtivos
     // - emProducao
     // - valorTotal
     // - entregasAtrasadas
     // - modulosValidados / modulosTotal
   }
```

2. Criar /app/(dashboard)/page.tsx:
   - Server component
   - Buscar metrics via service
   - Grid 4 colunas (StatCard para cada métrica)
   - Loading skeleton (Suspense)

3. Criar /components/industrial/metric-card.tsx:
   - Exibe: label, valor, trend (↑↓), percentual
   - Props: { label, value, trend?, compareValue?, icon }
   - Variantes: success, warning, danger

4. Criar /components/dashboard/recent-projects.tsx:
   - Tabela últimos 5 projetos
   - Colunas: código, cliente, status, valor, entrega
   - Badge colorido por status
   - Link para /projetos/[id]

5. Criar /components/dashboard/status-distribution.tsx:
   - Gráfico simples com divs (bar chart CSS)
   - Projetos por status (horizontal bars)
   - Cores: rascunho(gray), orcamento(blue), aprovado(green), producao(orange), concluido(green-dark)

6. Layout dashboard:
+------------------+------------------+
| Projetos Ativos  | Em Produção      |
+------------------+------------------+
| Valor Total      | Entregas Atraso  |
+------------------+------------------+
| Status Distribution (gráfico)       |
+-----------+-------------------------+
| Recent Projects (tabela)            |
+-------------------------------------+

VALIDAÇÃO:
- Métricas devem bater com count manual no db:studio
- Atualizar ao criar/editar projetos
- Performance: single query com aggregations

IMPORTANTE:
- Cache server-side (revalidate: 60)
- Loading states com Suspense
- Números grandes formatados (1.234.567,89)

NÃO IMPLEMENTAR:
- Gráficos complexos (Chart.js, Recharts)
- Filtros avançados (date range, etc)
- Real-time updates (WebSocket)

GERAR:
- Código completo
- SQL das queries para referência
Critérios de Aceite

 Métricas corretas vs banco
 Loading skeleton funciona
 Responsivo em mobile
 Performance <500ms


Sub-Fase 4.2: Página Projetos (CRUD)
Objetivo
Criar página completa de projetos com tabela e formulário.
Prompt Antigravity
CONTEXTO:
Dashboard home funcionando.
API CRUD projetos existe.

OBJETIVO:
Criar interface completa para gerenciar projetos.

FUNCIONALIDADES:
- Listar projetos (tabela paginada)
- Criar projeto (modal)
- Editar projeto (modal)
- Deletar projeto (soft delete)
- Filtrar por status
- Buscar por código/nome

IMPLEMENTAR:

1. Criar /app/(dashboard)/projetos/page.tsx:
   - Server component fetch inicial
   - Client component tabela + filtros

2. Criar /components/projetos/projetos-table.tsx:
   - TanStack Table
   - Colunas: código, cliente, status, valor, entrega, ações
   - Ordenação: código, data, valor
   - Paginação: 20 por página
   - Row actions: editar, deletar
   - Status badge colorido

3. Criar /components/projetos/projeto-form-modal.tsx:
   - shadcn/ui Dialog
   - React Hook Form + Zod
   - Campos:
     * codigo (auto, readonly se edição)
     * nome (text, required)
     * cliente_id (combobox, buscar clientes da empresa)
     * status (select)
     * data_inicio (date picker)
     * data_entrega (date picker)
     * valor_total (currency input)
   - Submit: POST ou PATCH /api/projetos

4. Criar /components/projetos/filters-bar.tsx:
   - Select status (multi)
   - Input busca (debounced 300ms)
   - Button "Limpar filtros"
   - Query params na URL (searchParams)

5. Criar /lib/actions/projetos.ts:
   - Server actions:
     * createProjeto
     * updateProjeto
     * deleteProjeto (soft delete: ativo = false)
   - Revalidate: revalidatePath("/projetos")

6. Criar /app/api/clientes/search/route.ts:
   - GET ?q=termo
   - Retornar clientes da empresa (combobox)

VALIDAÇÃO:
- Tabela ordena corretamente
- Filtros aplicam sem reload
- Modal cria/edita sem erros
- Soft delete esconde projeto da lista
- Paginação funciona com filtros

UX:
- Loading ao submit (button disabled)
- Toast success/error (shadcn/ui sonner)
- Confirmação antes de deletar

NÃO IMPLEMENTAR:
- Export Excel/PDF
- Bulk actions
- Advanced search

GERAR:
- Código completo
- Validação Zod do form
Critérios de Aceite

 Tabela lista projetos
 Create/Update/Delete funciona
 Filtros aplicam corretamente
 Paginação OK
 Toast feedback funciona


FASE 5 — INTEGRAÇÃO SKETCHUP
Sub-Fase 5.1: Plugin Ruby SketchUp (Exportador JSON)
Objetivo
Criar plugin SketchUp que exporta módulos para JSON.
Prompt Antigravity
CONTEXTO:
Você é especialista em SketchUp Ruby API.
Sistema SaaS pronto para receber dados (API /api/sketchup/import).

OBJETIVO:
Criar plugin SketchUp que exporta componentes selecionados para JSON.

REQUISITOS PLUGIN:
- Nome: "D'Luxury Exporter"
- Menu: Extensions > D'Luxury > Exportar Módulos
- Funcionalidade: exportar componente selecionado

DADOS A EXTRAIR:
1. GUID do componente (único)
2. Nome do componente
3. Dimensões (largura, altura, profundidade)
4. Material aplicado (nome do material)
5. Atributos dinâmicos (se existir: LenX, LenY, LenZ)

ESTRUTURA RUBY:

1. Criar /plugins/dluxury_exporter.rb:
```ruby
   require 'sketchup.rb'
   require 'json'
   
   module DLuxury
     module Exporter
       def self.export_selected
         # Validar seleção
         # Iterar componentes
         # Extrair dados
         # Gerar JSON
         # Salvar arquivo
       end
     end
   end
   
   # Registrar menu
   unless file_loaded?(__FILE__)
     menu = UI.menu('Extensions')
     menu.add_item('D\'Luxury > Exportar Módulos') {
       DLuxury::Exporter.export_selected
     }
     file_loaded(__FILE__)
   end
```

2. Função extract_component_data(component):
   - component.definition.name
   - component.guid
   - bounds = component.bounds
   - largura = (bounds.width / 25.4).round(2) # polegadas → mm
   - altura = (bounds.height / 25.4).round(2)
   - profundidade = (bounds.depth / 25.4).round(2)
   - material = component.material&.display_name || "Sem material"

3. Função export_to_json(data):
   - File dialog para salvar
   - JSON.pretty_generate(data)
   - Criar arquivo .json

4. JSON output esperado:
```json
   {
     "projeto_codigo": "PROJ-2024-001",
     "ambiente_nome": "Cozinha",
     "modulos": [
       {
         "sketchup_guid": "abc-123-def",
         "nome": "Armário Aéreo",
         "largura": 800,
         "altura": 700,
         "profundidade": 350,
         "material": "MDF Branco 18mm",
         "tipo": "aereo"
       }
     ]
   }
```

5. UX:
   - WebDialog simples para input:
     * projeto_codigo (text)
     * ambiente_nome (text)
   - Após input, processar seleção
   - Salvar JSON em desktop

VALIDAÇÃO:
- Plugin instala sem erros
- Menu aparece em Extensions
- Exportar componente simples funciona
- JSON válido (testar em jsonlint.com)
- Dimensões batem (medir manualmente)

LIMITAÇÕES V1:
- Apenas componentes de 1º nível (não aninhados)
- Sem decomposição automática em peças
- Material é só nome (não analisa espessura)
- Tipo módulo é inferido do nome ou manual

NÃO IMPLEMENTAR:
- Autenticação API (ainda)
- Upload automático
- Análise de ferragens
- Componentes aninhados

GERAR:
- Código Ruby completo
- Instruções instalação plugin
- SketchUp scene exemplo para teste
- JSON mockado esperado
Critérios de Aceite

 Plugin instala no SketchUp
 Menu aparece
 Exporta JSON válido
 Dimensões corretas (mm)
 GUID único por componente


Sub-Fase 5.2: Upload JSON → Sistema
Objetivo
Criar interface para upload do JSON exportado do SketchUp.
Prompt Antigravity
CONTEXTO:
Plugin SketchUp exporta JSON.
API /api/sketchup/import já existe (criada na Fase 2.3).

OBJETIVO:
Criar página para upload e visualização do JSON importado.

IMPLEMENTAR:

1. Criar /app/(dashboard)/sketchup/page.tsx:
   - Título "Importar do SketchUp"
   - Dropzone para JSON
   - Preview do JSON (code block)
   - Button "Importar"

2. Criar /components/sketchup/json-uploader.tsx:
   - react-dropzone
   - Aceitar apenas .json
   - Validar estrutura JSON:
     * projeto_codigo existe
     * modulos é array
     * cada módulo tem: nome, largura, altura, profundidade
   - Preview formatado (JSON.stringify(json, null, 2))
   - Estado: idle, validating, ready, uploading, success, error

3. Criar /lib/actions/sketchup-import.ts:
   - Server action: importSketchupData(jsonData)
   - Validação Zod rigorosa
   - Chamar API interna /api/sketchup/import
   - Retornar: { success, modulosImportados, errors? }
   - Revalidate: /projetos, /sketchup

4. Criar /components/sketchup/import-result.tsx:
   - Mostrar após import:
     * ✓ X módulos importados
     * Lista módulos (nome, dimensões)
     * Link para projeto
   - Button "Importar outro"

5. Fluxo UX:
Upload .json
↓
Validação automática
↓
Preview (expand/collapse)
↓
Button "Importar" (enabled se válido)
↓
Loading (spinner)
↓
Resultado (success ou errors)

6. Validação Zod /lib/validators/sketchup.ts:
```ts
   const ModuloSchema = z.object({
     sketchup_guid: z.string().uuid(),
     nome: z.string().min(1),
     largura: z.number().positive(),
     altura: z.number().positive(),
     profundidade: z.number().positive(),
     material: z.string().optional(),
     tipo: z.enum(["aereo", "balcao", "gaveteiro", "torre", "outro"])
   });
   
   export const SketchupImportSchema = z.object({
     projeto_codigo: z.string().regex(/^PROJ-\d{4}-\d{3}$/),
     ambiente_nome: z.string().min(1),
     modulos: z.array(ModuloSchema).min(1)
   });
```

VALIDAÇÃO:
- Upload JSON válido funciona
- Validação rejeita JSON inválido (mostrar erros)
- Módulos aparecem no projeto correto
- Ambiente criado se não existir
- GUID previne duplicados (upsert?)

ERROR HANDLING:
- JSON malformado: "Arquivo inválido"
- Projeto não existe: "Código projeto não encontrado"
- Validação falha: listar campos inválidos

NÃO IMPLEMENTAR:
- Edição inline do JSON
- Import múltiplos arquivos
- Histórico de imports

GERAR:
- Código completo
- JSON exemplo para teste
Critérios de Aceite

 Upload JSON funciona
 Validação detecta erros
 Import cria módulos no projeto
 Preview mostra dados
 Feedback success/error claro


Sub-Fase 5.3: Visualização Módulos Importados
Objetivo
Criar página para visualizar e validar módulos importados.
Prompt Antigravity
CONTEXTO:
Módulos importados do SketchUp estão no banco.
Tabelas: ambientes, modulos_sketchup, pecas (ainda mockadas).

OBJETIVO:
Criar interface para visualizar módulos de um projeto.

IMPLEMENTAR:

1. Criar /app/(dashboard)/projetos/[id]/modulos/page.tsx:
   - Título "Módulos do Projeto"
   - Tabs por ambiente (Cozinha, Dormitório, etc)
   - Grid cards de módulos

2. Criar /components/modulos/modulo-card.tsx:
   - Nome módulo
   - Tipo (badge: aéreo, balcão, etc)
   - Dimensões (LxAxP em mm)
   - Material
   - Status validação (badge: validado/pendente)
   - Actions: ver detalhes, editar, deletar

3. Criar /app/(dashboard)/projetos/[id]/modulos/[moduloId]/page.tsx:
   - Detalhes completos do módulo:
     * Dimensões
     * Material
     * JSON bruto (collapsible, code block)
     * Lista de peças (ainda mockadas)
   - Button "Validar Módulo"
   - Button "Editar Dimensões"

4. Criar /components/modulos/dimensoes-form.tsx:
   - Form inline para editar L/A/P
   - Validação: positivos, max 5000mm
   - Submit: atualiza modulos_sketchup
   - Revalidate página

5. Criar /lib/actions/modulos.ts:
   - updateModulo(id, data)
   - validateModulo(id): marca validado = true
   - deleteModulo(id): soft delete

6. Layout visual:
Projeto PROJ-2024-001 > Módulos
[Tab Cozinha] [Tab Dormitório]
+----------+----------+----------+
| Card 1   | Card 2   | Card 3   |
| Aéreo    | Balcão   | Torre    |
| 800x700  | 1200x900 | 600x2100 |
| MDF 18mm | MDF 18mm | MDF 18mm |
| ⚠️ Pend. | ✓ Valid. | ⚠️ Pend. |
+----------+----------+----------+

VALIDAÇÃO:
- Tabs carregam ambientes dinamicamente
- Cards mostram dados corretos
- Editar dimensões funciona
- Validar módulo marca ✓
- JSON bruto renderiza formatado

UX:
- Loading skeleton nos cards
- Empty state se sem módulos
- Confirmação antes de deletar

NÃO IMPLEMENTAR:
- Renderização 3D
- Editor visual de módulos
- Drag & drop para reordenar

GERAR:
- Código completo
- Mock 3 módulos por ambiente
Critérios de Aceite

 Tabs por ambiente funcionam
 Cards renderizam dados
 Editar dimensões persiste
 Validar módulo marca status
 JSON bruto exibe corretamente


FASE 6 — ENGINE PARAMÉTRICA
Sub-Fase 6.1: Parser & Validação Geométrica
Objetivo
Criar parser que valida dados do SketchUp antes de calcular peças.
Prompt Antigravity
CONTEXTO:
Módulos importados do SketchUp no banco.
Próximo: validar geometria e preparar para engine.

OBJETIVO:
Criar parser que valida limites estruturais e detecta inconsistências.

REGRAS ESTRUTURAIS MARCENARIA:
1. Largura mínima: 200mm, máxima: 3000mm
2. Altura mínima: 100mm, máxima: 2500mm
3. Profundidade mínima: 100mm, máxima: 700mm
4. Relação altura/largura:
   - Aéreo: altura ≤ largura * 1.5
   - Balcão: altura < largura
   - Torre: altura ≥ largura * 2
5. Espessura padrão: 15mm ou 18mm
6. Limites de vãos: sem suporte > 1200mm = erro

IMPLEMENTAR:

1. Criar /lib/engine/parser.ts:
```ts
   export interface ParsedModule {
     id: string;
     tipo: ModuleType;
     dimensoes: { L: number; A: number; P: number };
     material: Material;
     validacoes: Validation[];
     metadata: Record<string, any>;
   }
   
   export async function parseModule(moduloId: string): Promise<ParsedModule> {
     // Buscar módulo do banco
     // Validar dimensões
     // Detectar tipo se não definido
     // Inferir material/espessura
     // Retornar parsed + validações
   }
```

2. Criar /lib/engine/validators.ts:
```ts
   type ValidationLevel = "error" | "warning" | "info";
   
   interface Validation {
     level: ValidationLevel;
     code: string;
     message: string;
     field?: string;
   }
   
   export function validateDimensions(L, A, P): Validation[] {
     const validations: Validation[] = [];
     
     if (L < 200) validations.push({
       level: "error",
       code: "DIM_MIN_WIDTH",
       message: "Largura mínima: 200mm",
       field: "largura"
     });
     
     // ... outras validações
     
     return validations;
   }
   
   export function validateModuleType(tipo, L, A, P): Validation[] { ... }
   export function validateMaterial(material): Validation[] { ... }
```

3. Criar /lib/engine/rules.ts:
   - DIMENSIONS_LIMITS
   - TYPE_RATIOS
   - MATERIAL_SPECS (espessura por material)

4. Criar /app/api/modulos/[id]/validate/route.ts:
   - POST: executa parseModule + validações
   - Retorna: { valid, validations[], parsedData }
   - Atualiza: modulos_sketchup.validado = (erros.length === 0)

5. Criar /components/modulos/validation-panel.tsx:
   - Lista validations agrupadas:
     * ❌ Erros (level: error)
     * ⚠️ Avisos (level: warning)
     * ℹ️ Infos (level: info)
   - Badge count por nível
   - Expandir/colapsar

6. Integrar na página módulo detalhes:
   - Button "Executar Validação"
   - Loading durante validação
   - Mostrar ValidationPanel com resultado
   - Desabilitar "Validar Módulo" se erros

CASOS DE TESTE:
- Módulo válido: 800x700x350 aéreo
- Erro largura: 150x700x350
- Erro altura: 800x3000x350 aéreo (ratio)
- Warning: 1400x900x350 balcão (vão sem suporte)

VALIDAÇÃO:
- Parser identifica erros geométricos
- Validações corretas por tipo módulo
- Material inferido (se não informado)
- API retorna JSON estruturado

NÃO IMPLEMENTAR:
- Cálculo de peças (próxima sub-fase)
- Correção automática
- Validação de ferragens

GERAR:
- Código completo
- Matriz de regras por tipo
- 10 casos de teste com expected output
Critérios de Aceite

 Parser detecta dimensões inválidas
 Validações por tipo módulo OK
 API /validate funciona
 UI mostra erros/warnings/infos
 Casos de teste passam


Sub-Fase 6.2: Engine - Cálculo Peças Básicas
Objetivo
Criar engine que gera peças a partir de módulos validados.
Prompt Antigravity
CONTEXTO:
Parser valida módulos.
Próximo: calcular peças automaticamente.

OBJETIVO:
Criar engine paramétrica que gera peças para módulos simples.

ESCOPO V1 (apenas):
- Aéreo simples (sem gavetas/portas)
- Balcão simples (sem gavetas/portas)
- Composição: laterais + tampo + base + fundo + prateleiras

REGRAS CÁLCULO:

Aéreo (LxAxP):
- 2 laterais: (P-2mm) x (A) x (18mm)
- 1 tampo: (L) x (P) x (18mm)
- 1 base: (L) x (P) x (18mm)
- 1 fundo: (L-36mm) x (A-36mm) x (6mm)
- N prateleiras: (L-36mm) x (P-20mm) x (18mm)
  * N = floor(A / 400) - 1

Balcão (LxAxP):
- Similar aéreo, mas:
  * A típica: 850mm
  * Prateleiras: N = floor((A-200) / 400)

IMPLEMENTAR:

1. Criar /lib/engine/calculator.ts:
```ts
   export interface CalculatedPiece {
     codigo: string;
     nome: string;
     tipo: PieceType;
     largura: number;
     altura: number;
     espessura: number;
     quantidade: number;
     material: string;
     acabamento?: string;
   }
   
   export function calculatePieces(parsed: ParsedModule): CalculatedPiece[] {
     switch (parsed.tipo) {
       case "aereo":
         return calculateAereo(parsed);
       case "balcao":
         return calculateBalcao(parsed);
       default:
         throw new Error(`Tipo ${parsed.tipo} não suportado`);
     }
   }
```

2. Implementar calculateAereo:
```ts
   function calculateAereo(module: ParsedModule): CalculatedPiece[] {
     const { L, A, P } = module.dimensoes;
     const material = module.material.nome; // "MDF Branco 18mm"
     
     const pieces: CalculatedPiece[] = [];
     
     // Laterais
     pieces.push({
       codigo: "LAT-ESQ",
       nome: "Lateral Esquerda",
       tipo: "lateral",
       largura: P - 2,
       altura: A,
       espessura: 18,
       quantidade: 1,
       material,
       acabamento: "Fita 22mm nos 4 lados"
     });
     
     // ... tampo, base, fundo, prateleiras
     
     return pieces;
   }
```

3. Criar /lib/engine/piece-codes.ts:
   - Gerador códigos únicos: LAT-01, LAT-02, TAM-01, etc
   - Sequencial por módulo

4. Criar /app/api/modulos/[id]/calculate/route.ts:
   - POST: executa parseModule + calculatePieces
   - Salva peças no banco (tabela pecas)
   - Retorna: { pieces[], totalPecas }

5. Criar /lib/actions/engine.ts:
   - Server action: runEngineCalculation(moduloId)
   - Transação: deletar peças antigas + inserir novas
   - Marcar módulo como "calculado"

6. Integrar na página módulo:
   - Button "Calcular Peças" (enabled se validado)
   - Loading durante cálculo
   - Após sucesso: mostrar lista peças geradas
   - Tabela: código, nome, dimensões, qtd, material

VALIDAÇÃO:
- Aéreo 800x700x350:
  * 2 laterais (348x700x18)
  * 1 tampo (800x350x18)
  * 1 base (800x350x18)
  * 1 fundo (764x664x6)
  * 1 prateleira (764x330x18)
- Balcão 1200x850x600:
  * Similar estrutura
  * 1 prateleira (vão 650mm)

IMPORTANTE:
- Todas dimensões em milímetros
- Arredondar para inteiro
- Validar: nenhuma peça < 50mm
- Gerar apenas para módulos validados

NÃO IMPLEMENTAR:
- Portas, gavetas, divisórias
- Ferragens
- Usinagens (furos)
- Otimização layout

GERAR:
- Código completo
- Fórmulas documentadas
- 5 exemplos cálculo manual vs engine
Critérios de Aceite

 Engine calcula laterais corretamente
 Tampo/base/fundo com dimensões corretas
 Prateleiras calculadas por altura
 Códigos peças únicos
 Peças salvas no banco


Sub-Fase 6.3: Composição Modular (Múltiplos Módulos)
Objetivo
Calcular peças para conjunto de módulos considerando adjacências.
Prompt Antigravity
CONTEXTO:
Engine calcula peças para módulos isolados.
Próximo: considerar múltiplos módulos adjacentes (compartilhar laterais).

OBJETIVO:
Otimizar cálculo quando módulos estão lado a lado.

CONCEITO:
Se 2 aéreos estão lado a lado, compartilham lateral central.

Exemplo:
- Aéreo 800mm + Aéreo 600mm lado a lado
- Lateral direita do primeiro = lateral esquerda do segundo
- Total laterais: 3 (não 4)

IMPLEMENTAR:

1. Criar /lib/engine/composition.ts:
```ts
   export interface ModuleComposition {
     modules: ParsedModule[];
     layout: "horizontal" | "vertical" | "stacked";
     sharedPieces: SharedPiece[];
   }
   
   export function detectComposition(
     ambienteId: string
   ): ModuleComposition { ... }
```

2. Algoritmo detecção adjacência:
   - Buscar módulos do ambiente ordenados por posição
   - Se largura1 + largura2 ≈ larguraTotal → horizontal
   - Marcar laterais compartilhadas

3. Criar /lib/engine/optimizer.ts:
```ts
   export function optimizePieces(
     composition: ModuleComposition
   ): CalculatedPiece[] {
     const allPieces = composition.modules.flatMap(calculatePieces);
     
     // Remover laterais duplicadas
     const optimized = removeDuplicateLaterals(allPieces, composition.sharedPieces);
     
     return optimized;
   }
```

4. Atualizar /app/api/ambientes/[id]/calculate/route.ts:
   - POST: calcula todos módulos do ambiente
   - Detecta composição
   - Otimiza peças
   - Salva resultado

5. Criar /components/ambientes/composition-viewer.tsx:
   - Visualização ASCII da composição:
 +--------+-------+
 | Aéreo  | Aéreo |
 | 800mm  | 600mm |
 +--------+-------+
    ^-- lateral compartilhada
   - Lista peças totais
   - Highlight peças compartilhadas

VALIDAÇÃO:
- 2 aéreos 800mm lado a lado:
  * 3 laterais (não 4)
  * 2 tampos, 2 bases, 2 fundos
  * prateleiras independentes

IMPORTANTE:
- V1: apenas horizontal (lado a lado)
- NÃO: vertical (empilhado), L-shaped
- Tolerância adjacência: ±5mm

NÃO IMPLEMENTAR:
- Composições complexas (U, L)
- Torres empilhadas
- Módulos de profundidades diferentes

GERAR:
- Código completo
- Algoritmo detecção adjacência
- 3 casos teste composição
Critérios de Aceite

 Detecta módulos lado a lado
 Remove laterais duplicadas
 Peças totais corretas
 Viewer mostra composição


FASE 7 — PDF PRODUÇÃO [CONCLUÍDA ✅]
Sub-Fase 7.1: Lista de Peças (PDF)
Objetivo
Gerar PDF profissional com lista de peças para produção.
Prompt Antigravity
CONTEXTO:
Engine calcula peças.
Próximo: gerar documento PDF para enviar à produção.

OBJETIVO:
Criar PDF industrial com lista completa de peças.

STACK:
- react-pdf/renderer (ou jsPDF)

LAYOUT PDF:

Página 1:
- Header: Logo D'Luxury, projeto código, data
- Info Projeto: cliente, ambiente, total peças
- Tabela Peças:
  | Cód | Nome | Dimensões (LxAxE) | Qtd | Material | Acabamento |
  |-----|------|-------------------|-----|----------|------------|
  | ... | ...  | ...               | ... | ...      | ...        |
- Footer: página X/Y

IMPLEMENTAR:

1. Criar /lib/pdf/pieces-list.tsx (react-pdf):
```tsx
   import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
   
   export function PiecesListPDF({ projeto, modulos, pecas }) {
     return (
       <Document>
         <Page size="A4" style={styles.page}>
           <View style={styles.header}>
             <Text style={styles.title}>D'LUXURY INDUSTRIAL</Text>
             <Text>Projeto: {projeto.codigo}</Text>
             <Text>Cliente: {projeto.cliente.nome}</Text>
           </View>
           
           <View style={styles.table}>
             {/* header row */}
             {pecas.map(p => (
               <View style={styles.row} key={p.id}>
                 <Text style={styles.col}>{p.codigo}</Text>
                 <Text style={styles.col}>{p.nome}</Text>
                 <Text style={styles.col}>{p.largura}x{p.altura}x{p.espessura}</Text>
                 {/* ... */}
               </View>
             ))}
           </View>
           
           <Text style={styles.footer}>
             Gerado em {new Date().toLocaleString('pt-BR')}
           </Text>
         </Page>
       </Document>
     );
   }
```

2. Criar /app/api/projetos/[id]/pdf/route.ts:
   - GET: gera PDF
   - Busca projeto + módulos + peças
   - Renderiza PiecesListPDF
   - Retorna blob PDF
   - Headers: Content-Type, Content-Disposition

3. Criar /components/projetos/pdf-generator.tsx:
   - Button "Gerar PDF Lista de Peças"
   - Loading durante geração
   - Download automático após gerado
   - Link preview (abrir em nova tab)

4. Styles PDF (industrial):
   - Font: Helvetica
   - Header: fundo cinza escuro, texto branco
   - Tabela: bordas, zebra-stripes
   - Footer: fonte pequena, centralizado

VALIDAÇÃO:
- PDF abre sem erros
- Tabela completa visível
- Todas peças listadas
- Dimensões formatadas corretamente
- Download funciona

IMPORTANTE:
- Ordenar peças: por módulo, depois por tipo
- Totalizar: X peças, Y m² de chapa
- QRCode (próxima sub-fase)

NÃO INCLUIR:
- Desenhos técnicos
- Instruções montagem
- Etiquetas (separado)

GERAR:
- Código completo
- Screenshot mockup do PDF
Critérios de Aceite

✅ PDF gera sem erros
✅ Tabela peças completa
✅ Download funciona
✅ Layout profissional


Sub-Fase 7.2: Etiquetas com QRCode
Objetivo
Gerar PDF com etiquetas individuais por peça (rastreabilidade).
Prompt Antigravity
CONTEXTO:
PDF lista de peças funcionando.
Próximo: etiquetas para colar em cada peça na produção.

OBJETIVO:
Gerar PDF A4 com etiquetas 10x5cm (grid 2x5 por página).

LAYOUT ETIQUETA:
+----------------------+
| [QRCode]  PROJ-001   |
|           LAT-01     |
|                      |
| Lateral Esquerda     |
| 348 x 700 x 18mm     |
| MDF Branco 18mm      |
+----------------------+

QRCode conteúdo:
{projeto}/{modulo}/{peca}
Ex: "PROJ-2024-001/MOD-001/LAT-01"

IMPLEMENTAR:

1. Instalar qrcode:
   - npm install qrcode
   - npm install @types/qrcode

2. Criar /lib/pdf/labels.tsx (react-pdf):
```tsx
   import QRCode from 'qrcode';
   
   async function generateQRDataURL(text: string) {
     return await QRCode.toDataURL(text, {
       width: 150,
       margin: 1
     });
   }
   
   export function LabelsPDF({ pecas }) {
     const chunks = chunk(pecas, 10); // 10 por página
     
     return (
       <Document>
         {chunks.map((chunk, pageIdx) => (
           <Page size="A4" key={pageIdx}>
             <View style={styles.grid}>
               {chunk.map(peca => (
                 <View style={styles.label} key={peca.id}>
                   <Image src={peca.qrDataURL} />
                   <Text>{peca.projeto_codigo}</Text>
                   <Text style={styles.bold}>{peca.codigo}</Text>
                   <Text>{peca.nome}</Text>
                   <Text>{peca.largura}x{peca.altura}x{peca.espessura}mm</Text>
                   <Text>{peca.material}</Text>
                 </View>
               ))}
             </View>
           </Page>
         ))}
       </Document>
     );
   }
```

3. Criar /app/api/projetos/[id]/labels/route.ts:
   - GET: gera PDF etiquetas
   - Para cada peça: gerar QRCode data URL
   - Renderizar LabelsPDF
   - Retornar blob

4. Layout grid:
   - 2 colunas x 5 linhas
   - Margem: 10mm
   - Espaçamento: 5mm
   - Etiqueta: 90mm x 50mm

5. Adicionar button na página projeto:
   - "Imprimir Etiquetas"
   - Download PDF etiquetas

VALIDAÇÃO:
- PDF gera grid correto
- QRCode escaneável (testar com app)
- Texto legível (fonte ≥10pt)
- 10 etiquetas por página

IMPORTANTE:
- QRCode deve abrir URL sistema (futuro: /pecas/{id})
- Etiquetas recortáveis (guias pontilhadas?)

NÃO IMPLEMENTAR:
- Códigos de barras lineares
- RFID
- Etiquetas personalizadas por tipo

GERAR:
- Código completo
- Grid layout CSS/PDF
Critérios de Aceite

✅ PDF etiquetas gera OK
✅ QRCode escaneável
✅ Grid 2x5 correto
✅ Texto legível


FASE 8 — IA GEMINI
Sub-Fase 8.1: Setup Gemini + Prompt Base [CONCLUÍDA ✅]
Objetivo
Configurar Gemini 2.5 Pro com prompt industrial.
Prompt Antigravity
CONTEXTO:
Sistema funcionando: projetos, módulos, peças, PDFs.
Próximo: adicionar assistente IA técnica industrial.

OBJETIVO:
Configurar Gemini 2.5 Pro com Vercel AI SDK.

STACK:
- @ai-sdk/google (Gemini provider)
- ai (Vercel AI SDK)
- Streaming UI

IMPLEMENTAR:

1. Instalar:
   - ai
   - @ai-sdk/google

2. Criar /lib/ai/client.ts:
```ts
   import { createGoogleGenerativeAI } from '@ai-sdk/google';
   
   export const google = createGoogleGenerativeAI({
     apiKey: process.env.GOOGLE_AI_API_KEY!
   });
   
   export const model = google('gemini-2.0-flash-exp');
```

3. Criar /lib/ai/prompts.ts:
```ts
   export const SYSTEM_PROMPT = `
   Você é um especialista técnico em marcenaria planejada e engenharia de móveis industriais.
   
   CONTEXTO:
   - Sistema: D'Luxury Industrial Platform
   - Função: assistir engenheiros e produção
   - Dados: projetos, módulos, peças calculadas automaticamente
   
   REGRAS CRÍTICAS:
   1. NUNCA inventar medidas ou dimensões
   2. SEMPRE basear em dados fornecidos
   3. Se não souber, dizer "não tenho essa informação"
   4. Respostas objetivas e técnicas
   5. Unidades: milímetros (mm)
   
   PODE:
   - Explicar estrutura de móveis
   - Orientar montagem
   - Interpretar lista de peças
   - Explicar tipos de ferragens
   - Responder dúvidas técnicas gerais
   
   NÃO PODE:
   - Alterar dimensões calculadas pela engine
   - Criar peças não listadas
   - Contradizer validações estruturais
   - Fazer design (apenas explicar)
   
   ESTILO:
   - Técnico mas acessível
   - Bullet points quando relevante
   - Exemplos práticos
   `;
```

4. Criar /app/api/chat/route.ts:
```ts
   import { streamText } from 'ai';
   import { model } from '@/lib/ai/client';
   import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
   
   export async function POST(req: Request) {
     const { messages } = await req.json();
     
     const result = await streamText({
       model,
       system: SYSTEM_PROMPT,
       messages,
       temperature: 0.3, // baixo = mais preciso
       maxTokens: 2000
     });
     
     return result.toDataStreamResponse();
   }
```

5. Criar /components/ai/chat-interface.tsx:
   - shadcn/ui design
   - useChat hook (Vercel AI SDK)
   - Input message
   - Streaming messages
   - Loading states

6. Criar /app/(dashboard)/assistente/page.tsx:
   - ChatInterface component
   - Título "Assistente Técnico D'Luxury"
   - Sugestões iniciais:
     * "Explique a estrutura de um armário aéreo"
     * "Qual a diferença entre balcão e torre?"
     * "Como calcular número de prateleiras?"

VALIDAÇÃO:
- Chat responde perguntas gerais técnicas
- Streaming funciona
- Respostas objetivas (não inventar)
- Temperature baixo = consistente

TESTES:
- "Qual a altura padrão de um balcão?" → ~850mm
- "Quantas prateleiras em 700mm de altura?" → 1
- "Me dê dimensões do projeto X" → "Não tenho acesso, consulte a página do projeto"

NÃO IMPLEMENTAR:
- RAG (próxima sub-fase)
- Contexto projeto (ainda)
- Ferramentas (function calling)

GERAR:
- Código completo
- 10 prompts teste
Critérios de Aceite

✅ Gemini responde via API
✅ Streaming funciona
✅ Respostas técnicas corretas
✅ Não inventa dados


Sub-Fase 8.2: RAG - Vetorização Documentação
Objetivo
Implementar RAG para consultar manuais técnicos e documentação.
Prompt Antigravity
CONTEXTO:
Gemini funcionando.
Próximo: adicionar knowledge base (manuais ferragens, técnicas).

OBJETIVO:
Implementar RAG com pgvector para documentação técnica.

STACK:
- pgvector (Neon)
- text-embedding-3-small (OpenAI) ou Gemini embeddings

ARQUITETURA:
documentos → chunks → embeddings → pgvector → retrieval → context → Gemini

IMPLEMENTAR:

1. Adicionar pgvector ao Neon:
   - Migration: CREATE EXTENSION vector;

2. Criar /lib/db/schema/embeddings.ts:
```ts
   export const documentos = pgTable('documentos', {
     id: uuid('id').primaryKey().defaultRandom(),
     titulo: text('titulo').notNull(),
     tipo: text('tipo').notNull(), // "manual", "tecnica", "norma"
     conteudo: text('conteudo').notNull(),
     arquivo_url: text('arquivo_url'),
     created_at: timestamp('created_at').defaultNow()
   });
   
   export const chunks = pgTable('chunks', {
     id: uuid('id').primaryKey().defaultRandom(),
     documento_id: uuid('documento_id').references(() => documentos.id),
     chunk_index: integer('chunk_index').notNull(),
     conteudo: text('conteudo').notNull(),
     embedding: vector('embedding', { dimensions: 768 }), // ajustar modelo
     created_at: timestamp('created_at').defaultNow()
   });
```

3. Criar /lib/ai/embeddings.ts:
```ts
   import { embed } from 'ai';
   import { model } from './client';
   
   export async function generateEmbedding(text: string): Promise<number[]> {
     const { embedding } = await embed({
       model: model.textEmbeddingModel('text-embedding-3-small'),
       value: text
     });
     return embedding;
   }
```

4. Criar /lib/ai/rag.ts:
```ts
   export async function retrieveContext(
     query: string,
     limit: number = 3
   ): Promise<string[]> {
     // 1. Gerar embedding da query
     const queryEmbedding = await generateEmbedding(query);
     
     // 2. Buscar chunks similares (cosine similarity)
     const results = await db.execute(sql`
       SELECT conteudo
       FROM chunks
       ORDER BY embedding <=> ${queryEmbedding}::vector
       LIMIT ${limit}
     `);
     
     return results.rows.map(r => r.conteudo);
   }
```

5. Atualizar /app/api/chat/route.ts:
```ts
   const context = await retrieveContext(lastUserMessage);
   
   const systemWithContext = `
   ${SYSTEM_PROMPT}
   
   CONTEXTO ADICIONAL:
   ${context.join('\n\n---\n\n')}
   `;
   
   const result = await streamText({
     model,
     system: systemWithContext,
     messages
   });
```

6. Criar /scripts/ingest-docs.ts:
   - Ler PDFs da pasta /docs
   - Chunkar texto (500 tokens, overlap 50)
   - Gerar embeddings
   - Inserir no banco

7. Criar /app/(dashboard)/documentos/page.tsx:
   - Upload PDFs
   - Lista documentos ingeridos
   - Button "Processar"

VALIDAÇÃO:
- Upload PDF → chunks criados
- Query similar retorna chunks relevantes
- Chat usa contexto recuperado
- Respostas mais precisas

DOCUMENTOS SEED:
- Manual Blum (ferragens)
- Técnicas de acabamento MDF
- Normas segurança marcenaria

NÃO IMPLEMENTAR:
- Chunking avançado (semântico)
- Reranking
- Hybrid search (keyword + vector)

GERAR:
- Código completo
- Script ingest com exemplo PDF
Critérios de Aceite

 pgvector instalado
 Upload PDF funciona
 Embeddings gerados
 Retrieval retorna chunks relevantes
 Chat usa contexto


Sub-Fase 8.3: Tools - Function Calling (Consultar Projeto) [CONCLUÍDA ✅]
Objetivo
Adicionar function calling para IA consultar dados do sistema.
Prompt Antigravity
CONTEXTO:
RAG funcionando.
Próximo: permitir IA consultar projetos/módulos/peças diretamente.

OBJETIVO:
Implementar function calling para buscar dados em tempo real.

FERRAMENTAS:
1. get_projeto(codigo)
2. get_modulos_projeto(projeto_id)
3. get_pecas_modulo(modulo_id)

IMPLEMENTAR:

1. Criar /lib/ai/tools.ts:
```ts
   import { tool } from 'ai';
   import { z } from 'zod';
   
   export const getProjetoTool = tool({
     description: 'Busca informações de um projeto pelo código',
     parameters: z.object({
       codigo: z.string().describe('Código do projeto (ex: PROJ-2024-001)')
     }),
     execute: async ({ codigo }) => {
       const projeto = await db.query.projetos.findFirst({
         where: eq(projetos.codigo, codigo),
         with: { cliente: true }
       });
       
       if (!projeto) return { error: 'Projeto não encontrado' };
       
       return {
         codigo: projeto.codigo,
         nome: projeto.nome,
         cliente: projeto.cliente.nome,
         status: projeto.status,
         valor_total: projeto.valor_total,
         data_entrega: projeto.data_entrega
       };
     }
   });
   
   export const getModulosTool = tool({
     description: 'Lista módulos de um projeto',
     parameters: z.object({
       projeto_codigo: z.string()
     }),
     execute: async ({ projeto_codigo }) => {
       // buscar projeto
       // buscar módulos
       // retornar array
     }
   });
   
   export const getPecasTool = tool({
     description: 'Lista peças de um módulo',
     parameters: z.object({
       modulo_id: z.string().uuid()
     }),
     execute: async ({ modulo_id }) => {
       // buscar peças
       // retornar array
     }
   });
```

2. Atualizar /app/api/chat/route.ts:
```ts
   import { getProjetoTool, getModulosTool, getPecasTool } from '@/lib/ai/tools';
   
   const result = await streamText({
     model,
     system: systemWithContext,
     messages,
     tools: {
       get_projeto: getProjetoTool,
       get_modulos: getModulosTool,
       get_pecas: getPecasTool
     },
     maxSteps: 5 // permitir múltiplas chamadas
   });
```

3. Atualizar SYSTEM_PROMPT:
FERRAMENTAS DISPONÍVEIS:

get_projeto(codigo): buscar projeto
get_modulos(projeto_codigo): listar módulos
get_pecas(modulo_id): listar peças

USE quando o usuário perguntar sobre dados específicos.
SEMPRE use ferramenta antes de responder sobre dados do sistema.

4. Criar /components/ai/tool-call-display.tsx:
   - Mostrar loading "Consultando projeto..."
   - Mostrar resultado ferramenta (collapsible)

VALIDAÇÃO:
- User: "Me mostre o projeto PROJ-2024-001"
  → IA chama get_projeto
  → Retorna dados corretos
- User: "Quantos módulos tem esse projeto?"
  → IA chama get_modulos
  → Conta e responde

IMPORTANTE:
- Tools retornam JSON estruturado
- IA interpreta e responde em linguagem natural
- Múltiplas tools podem ser chamadas em sequência

NÃO IMPLEMENTAR:
- Tools de escrita (create, update, delete)
- Streaming tool calls (ainda beta)

GERAR:
- Código completo
- 10 exemplos conversação usando tools
Critérios de Aceite

✅ Function calling funciona
✅ IA busca dados corretamente
✅ Respostas baseadas em dados reais
✅ UI mostra tool calls


VALIDAÇÃO FINAL DO MVP
Após todas as fases, validar fluxo completo:
Fluxo End-to-End

Login → Dashboard
Criar projeto → Cliente, nome
SketchUp → Exportar JSON módulo
Upload JSON → Sistema importa
Validar módulo → Engine valida geometria
Calcular peças → Engine gera lista
Gerar PDF → Lista peças + etiquetas
Assistente IA → "Explique o módulo X"

Critérios Aceite MVP

 Fluxo completo funciona sem erros
 Performance: dashboard < 1s
 Mobile: responsivo 100%
 Deploy Vercel: build OK
 Banco: queries otimizadas (índices)
 Auth: sessão persistente
 PDF: gera e download OK
 IA: respostas técnicas corretas


OBSERVAÇÕES FINAIS
O que FOI feito no MVP

✅ Fundação enterprise (Next.js + TypeScript + Tailwind + shadcn/ui)
✅ Banco industrial (Neon + Drizzle + pgvector)
✅ Auth completo (NextAuth + RBAC + multiempresa)
✅ Dashboard métricas + CRUD projetos
✅ Integração SketchUp (plugin Ruby + import JSON)
✅ Engine paramétrica (validação + cálculo peças básicas)
✅ PDF produção (lista peças + etiquetas QRCode)
✅ IA Gemini (chat + RAG + function calling)

O que NÃO foi feito (backlog)

❌ Portas, gavetas, divisórias (engine avançada)
❌ Ferragens automáticas
❌ Usinagens (furos, rebaixos)
❌ Otimização layout chapa (nesting)
❌ CNC integration
❌ ERP completo
❌ Render 3D

Próximos Passos Sugeridos

Validar com usuário real (marceneiro)
Coletar feedback engine paramétrica
Expandir tipos módulos (torre, canto, nicho)
Adicionar ferragens (dobradiças, corrediças)
Melhorar IA (mais documentação RAG)


# FASE 9: DASHBOARD ADMIN / SUPERADMIN (SaaS Control Panel) [CONCLUÍDA ✅]
Objetivo: Implementar o painel de controle global (SuperAdmin) para gerenciamento de Tenants, assinaturas, planos de faturamento e auditoria global.

### Sub-Fase 9.1: Role SuperAdmin & Middleware de Proteção [CONCLUÍDA ✅]
- **Objetivo:** Adicionar rotas administrativas restritas e garantir que somente usuários com `role: 'superadmin'` acessem `/admin/*`.
- **Entregáveis:**
  * Guardas de rota em layouts administrativos que validem `session.user.role === 'superadmin'`.
  * Rota de fallback segura de "Acesso Negado" (`/admin/unauthorized`).

### Sub-Fase 9.2: Dashboard de Métricas SaaS Globais [CONCLUÍDA ✅]
- **Objetivo:** Painel gerencial agregando os dados de todas as empresas do ecossistema SaaS.
- **Entregáveis:**
  * Métricas Brutalistas Dark de MRR (Receita Recorrente Mensal), Tenants Ativos, Projetos Totais e Peças Produzidas.
  * Gráficos analíticos elegantes demonstrando taxa de crescimento de novos tenants e volumetria de importação de SketchUp.

### Sub-Fase 9.3: Gestão de Inquilinos (Tenants CRUD & Planos) [CONCLUÍDA ✅]
- **Objetivo:** Interface administrativa para listagem, alteração de status e planos de assinaturas das empresas.
- **Entregáveis:**
  * Painel `/admin/empresas` com listagem tabular de tenants.
  * Modal administrativo para Ativar/Inativar empresa, alterar o plano (starter, pro, enterprise) e ajustar cotas de licenças corporativas.

### Sub-Fase 9.4: Logs Globais de Rastreabilidade e Auditoria [CONCLUÍDA ✅]
- **Objetivo:** Auditoria centralizada de eventos críticos ocorridos na plataforma.
- **Entregáveis:**
  * Visualização cronológica em tempo real de logs de auditoria (criação/exclusão de inquilinos, logins administrativos, etc.).

Critérios de Aceite da Fase 9:
- ✅ Somente SuperAdmin pode acessar o painel `/admin`.
- ✅ Mudança de planos e cotas reflete nos limites dos inquilinos imediatamente.
- ✅ Logs e auditorias salvos com integridade e rastreabilidade total.


FIM DO ROADMAP DETALHADO
Total: 9 Fases → 32 Sub-Fases
Cada sub-fase é validável individualmente.