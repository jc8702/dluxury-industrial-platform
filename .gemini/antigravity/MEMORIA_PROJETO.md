# SISTEMA DE MEMÓRIA DE PROJETO - ANTIGRAVITY

## REGRA GLOBAL OBRIGATÓRIA

Esta regra garante que todo projeto tenha memória persistente, contexto técnico completo e histórico de decisões. A IA DEVE seguir este protocolo em TODAS as interações.

---

## PROTOCOLO OBRIGATÓRIO

### 1. ANTES DE QUALQUER TAREFA
✓ Verificar se existe RESUMO_TRABALHO.md na raiz do projeto
✓ Se existir: LER COMPLETAMENTE antes de iniciar
✓ Se não existir: CRIAR usando o template abaixo
✓ Entender contexto, stack, decisões anteriores e TODOs pendentes

### 2. APÓS QUALQUER TAREFA
✓ ATUALIZAR o RESUMO_TRABALHO.md OBRIGATORIAMENTE
✓ Adicionar entrada detalhada no histórico
✓ Atualizar seções relevantes (funcionalidades, stack, TODOs)
✓ Documentar problemas e decisões técnicas
✓ Nunca deixar trabalho sem registro

### 3. FLUXO VISUAL
┌─────────────────────────────────────────────┐
│ INÍCIO: Usuário solicita tarefa             │
└─────────────────┬───────────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│ LER: RESUMO_TRABALHO.md                     │
│ • Contexto do projeto                       │
│ • Decisões anteriores                       │
│ • Padrões estabelecidos                     │
│ • TODOs pendentes                           │
└─────────────────┬───────────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│ EXECUTAR: Tarefa solicitada                 │
│ • Seguir padrões do projeto                 │
│ • Respeitar decisões anteriores             │
│ • Evitar conflitos                          │
└─────────────────┬───────────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│ ATUALIZAR: RESUMO_TRABALHO.md               │
│ • Data/hora + descrição                     │
│ • Arquivos modificados                      │
│ • Decisões técnicas                         │
│ • Problemas e soluções                      │
│ • Novos TODOs                               │
└─────────────────┬───────────────────────────┘
│
▼

## TEMPLATE OBRIGATÓRIO: RESUMO_TRABALHO.md

Copie este template para criar o arquivo em cada projeto:

````markdown
# RESUMO DE TRABALHO - [NOME DO PROJETO]

**Última atualização:** [DD/MM/AAAA HH:MM]  
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
| **Nome do projeto** | |
| **Descrição** | |
| **Repositório** | |
| **Branch principal** | |
| **Ambiente de desenvolvimento** | |
| **Ambiente de produção** | |
| **Criado em** | |
| **Última atualização** | |

---

## 🛠️ Stack Tecnológica

### Backend
- **Linguagem/Runtime:** 
- **Framework:** 
- **Banco de dados:** 
- **ORM/Query Builder:** 
- **Autenticação:** 
- **Validação:** 
- **Outras libs principais:**

### Frontend
- **Framework/Lib:** 
- **Linguagem:** 
- **Build tool:** 
- **Roteamento:** 
- **Estado global:** 
- **UI/Styling:** 
- **Outras libs principais:**

### DevOps/Infraestrutura
- **Hospedagem backend:** 
- **Hospedagem frontend:** 
- **Hospedagem DB:** 
- **CI/CD:** 
- **Monitoramento:** 

### Dependências Críticas
```json
{
  "dependência-chave": "versão",
  "outra-dependência": "versão"
}
```

---

## 📁 Estrutura de Arquivos

````
projeto/
├── src/
│   ├── api/              # Endpoints e rotas
│   ├── components/       # Componentes React
│   ├── lib/              # Utilitários e helpers
│   ├── types/            # Definições TypeScript
│   └── ...
├── public/
├── RESUMO_TRABALHO.md
├── README.md
└── package.json
Arquivos críticos:

caminho/arquivo-importante.ts - Descrição da função
outro/arquivo-chave.tsx - Descrição da função


📝 Histórico de Alterações
[20/05/2026 14:30] - Inicialização do projeto
Arquivos criados:

/RESUMO_TRABALHO.md
/README.md

O que foi feito:

Estrutura inicial do projeto
Configuração do ambiente de desenvolvimento

Decisões técnicas:

Escolhido [tecnologia X] por [motivo Y]


[DD/MM/AAAA HH:MM] - [Título da alteração]
Contexto:
Breve explicação do motivo da alteração
Arquivos modificados:

src/caminho/arquivo1.ts - Alteração X
src/caminho/arquivo2.tsx - Alteração Y
api/endpoint.ts - Nova rota Z

O que foi feito:

Implementação da funcionalidade X
Correção do bug Y no componente Z
Refatoração do módulo W para melhor performance
Adição de validação V

Código relevante:
typescript// Trecho importante de código
function exemplo() {
  // ...
}
Decisões técnicas:

Por que A e não B: Justificativa técnica detalhada
Trade-offs considerados: Performance vs. legibilidade

Dependências adicionadas/removidas:
bashnpm install pacote@1.2.3
npm uninstall pacote-antigo
Migrações de banco (se aplicável):
sqlALTER TABLE tabela ADD COLUMN nova_coluna VARCHAR(255);
Testes realizados:

 Teste manual de funcionalidade X
 Teste de integração Y
 Teste E2E pendente

Problemas encontrados:

Problema X: Descrição do problema

Causa raiz: Análise técnica
Solução aplicada: Como foi resolvido
Impacto: Quem/o que foi afetado



TODOs gerados:

 Implementar validação adicional em Z
 Otimizar query W (atualmente 300ms)
 Adicionar testes unitários para módulo V

Links úteis:

Issue relacionada: #123
PR relacionada: #456
Documentação: [link]


✅ Funcionalidades Implementadas
🟢 [Nome da Funcionalidade 1]
Status: ✅ Funcionando | ⚠️ Com bugs | 🚧 Em desenvolvimento
Descrição:
Descrição detalhada do que a funcionalidade faz
Localização no código:

Backend: src/api/modulo/funcionalidade.ts
Frontend: src/components/Funcionalidade.tsx
Tipos: src/types/funcionalidade.ts

Endpoints (se aplicável):

POST /api/funcionalidade - Descrição
GET /api/funcionalidade/:id - Descrição

Exemplo de uso:
typescript// Código de exemplo
const resultado = await funcionalidade({
  parametro: 'valor'
});
Dependências:

Depende de: Funcionalidade X, Módulo Y
Requerido por: Funcionalidade Z

Observações importantes:

Limitação conhecida: X
Performance: ~100ms em média
Casos extremos: Como lidar com Y


🟢 [Nome da Funcionalidade 2]
[Seguir mesmo formato acima]

⚠️ Problemas Conhecidos
🔴 [CRÍTICO] - [Título do problema]
Impacto: Sistema inacessível / Perda de dados / Performance crítica
Descrição detalhada:
O que acontece, quando acontece, frequência
Como reproduzir:

Passo 1
Passo 2
Resultado esperado vs. resultado atual

Causa raiz (se conhecida):
Análise técnica do problema
Workaround temporário:
Como contornar o problema até a correção definitiva
Solução definitiva planejada:
O que precisa ser feito para resolver permanentemente
Responsável/Prazo:
Quem está resolvendo e quando
Links relacionados:

Issue: #789
Discussão: [link]


🟡 [MÉDIO] - [Título do problema]
[Seguir mesmo formato acima]

🟢 [BAIXO] - [Título do problema]
[Seguir mesmo formato acima]

📋 TODOs e Melhorias
🔥 Prioridade CRÍTICA

 [SEGURANÇA] Implementar rate limiting em endpoints públicos
 [BUG CRÍTICO] Corrigir vazamento de memória no módulo X

⚡ Prioridade ALTA

 [FEATURE] Implementar sistema de notificações em tempo real
 [REFACTOR] Modularizar componente Y que está com 800 linhas
 [PERFORMANCE] Otimizar query Z (atualmente 2s)

📌 Prioridade MÉDIA

 [MELHORIA] Adicionar loading states em todos os forms
 [UX] Melhorar feedback visual em ações assíncronas
 [TESTES] Aumentar cobertura de testes de 40% para 80%

💡 Prioridade BAIXA

 [DOCUMENTAÇÃO] Adicionar JSDoc em funções públicas
 [DX] Configurar Prettier e ESLint mais rigorosos
 [ESTÉTICA] Padronizar espaçamentos em todos os componentes

🎯 Backlog / Ideias futuras

 Migrar de REST para GraphQL
 Implementar cache distribuído com Redis
 Adicionar dark mode
 Internacionalização (i18n)


🏗️ Decisões Arquiteturais
[DD/MM/AAAA] - [Título da decisão]
Contexto:
Por que precisamos tomar essa decisão
Opções consideradas:

Opção A: Prós e contras
Opção B: Prós e contras
Opção C: Prós e contras

Decisão final:
Escolhemos [Opção X]
Justificativa técnica:

Motivo 1: Explicação detalhada
Motivo 2: Explicação detalhada
Motivo 3: Explicação detalhada

Trade-offs aceitos:

Sacrificamos X para ganhar Y
Aumentamos complexidade em Z para melhorar W

Consequências esperadas:

Positivas: A, B, C
Negativas: D, E (mas aceitáveis porque...)

Critérios de revisão:
Quando reavaliar essa decisão (exemplo: se tráfego ultrapassar 10k req/s)
Referências:

ADR relacionada: [link]
Discussão técnica: [link]
Benchmark: [link]


📚 Glossário e Convenções
Termos do domínio

Termo técnico X: Definição específica do projeto
Sigla Y: O que significa no contexto deste sistema

Convenções de código

Nomenclatura de componentes: PascalCase, prefixo por contexto
Nomenclatura de funções: camelCase, verbos no início
Nomenclatura de arquivos: kebab-case para utilitários
Estrutura de commits: conventional commits (feat:, fix:, docs:)

Padrões estabelecidos

Gerenciamento de estado: Context API para dados globais
Estilização: Tailwind com classes utilitárias
Validação: Zod em frontend e backend
Error handling: Try/catch com logs centralizados


🔐 Segurança e Credenciais
NUNCA COMMITAR CREDENCIAIS NESTE ARQUIVO
Variáveis de ambiente necessárias:
envDATABASE_URL=
API_KEY=
JWT_SECRET=
Onde encontrar credenciais:

Desenvolvimento: .env.local (não commitado)
Produção: Painel da [plataforma de hospedagem]


📖 Como usar este documento
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
Arquivar entradas antigas do histórico (mover para HISTORICO_COMPLETO.md após 3 meses)
Revisar decisões arquiteturais a cada major release


⚙️ Metadados do documento
Versão do template: 1.0
Criado em: [DD/MM/AAAA]
Última revisão: [DD/MM/AAAA]
Mantido por: IA (Antigravity Agent) + Desenvolvedor Humano
Localização: /RESUMO_TRABALHO.md (raiz do projeto)

---

## REGRAS DE FORMATAÇÃO PARA A IA

### Ao adicionar entrada no histórico:

1. **Data/hora sempre no formato:** `[DD/MM/AAAA HH:MM]`
2. **Título claro e específico:** "Implementa autenticação JWT" (não "Alterações")
3. **Seções obrigatórias mínimas:**
   - Arquivos modificados
   - O que foi feito
   - Decisões técnicas (se relevante)
   - TODOs gerados (se houver)

4. **Use emojis consistentemente:**
   - ✅ = Funcionando
   - ⚠️ = Com bugs
   - 🚧 = Em desenvolvimento
   - 🔴 = Crítico
   - 🟡 = Médio
   - 🟢 = Baixo

5. **Código inline:** Use \`backticks\` para nomes de arquivos, funções, variáveis
6. **Blocos de código:** Use \`\`\`linguagem para snippets
7. **Links:** Sempre usar formato markdown `[texto](url)`

### Ao atualizar funcionalidades:

- Se funcionalidade nova: adicionar seção completa
- Se funcionalidade existente: atualizar Status e Observações
- Se funcionalidade removida: mudar status para "❌ Removida" + data

### Ao atualizar TODOs:

- Marcar com [x] quando completo
- Mover para seção "Concluídos" ao final (criar se não existir)
- Sempre adicionar **contexto** entre colchetes: `[FEATURE]`, `[BUG]`, etc.

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

---

## VERSIONAMENTO DESTE ARQUIVO

**Versão:** 1.0  
**Data:** 20/05/2026  
**Mantido em:** `.gemini/antigravity/MEMORIA_PROJETO.md`  
**Aplica-se a:** Todos os projetos desenvolvidos com Antigravity Agent

---

**FIM DO DOCUMENTO**