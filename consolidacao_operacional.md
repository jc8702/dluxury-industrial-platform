# CONSOLIDAÇÃO OPERACIONAL — PLANO DE VALIDAÇÃO INDUSTRIAL
## MarcenAI Enterprise | D'Luxury Ambientes

**Data:** 18 de Maio de 2026  
**Objetivo:** Validar operacionalmente o sistema antes de qualquer expansão  
**Período:** 30 dias corridos  
**Responsável:** Jose (comercial) + cunhado (produção)

---

# ⚠️ PREMISSA CRÍTICA

> **Nenhuma feature nova será desenvolvida durante os próximos 30 dias.**

O sistema afirma ter 9 fases completas incluindo:
- Engine paramétrica
- Integração SketchUp
- PDF de produção
- IA RAG Gemini
- Multi-tenant
- Painel SuperAdmin

**Mas nunca foi testado com projetos reais da D'Luxury.**

Esta validação determina se o investimento em desenvolvimento foi bem-sucedido ou se há débito técnico crítico que precisa ser pago antes de escalar.

---

## 📊 ESTRUTURA DO PLANO

```
SEMANA 1-2: Setup + 5 projetos piloto
SEMANA 3: Análise intermediária + correções críticas
SEMANA 4: 5 projetos finais + relatório consolidado
```

---

# SEMANA 1-2: PREPARAÇÃO E PRIMEIROS TESTES

## DIA 1-2: SETUP OPERACIONAL

### Checklist Infraestrutura

- [x] Sistema acessível via URL produção Vercel (Compilação Concluída c7d7568)
- [x] Login funcionando (NextAuth v5 + Sandbox)
- [x] Empresa D'Luxury cadastrada como tenant (empresaId: d0000000-0000-0000-0000-000000000000)
- [x] Usuários criados: Jose (Admin - jose@dluxury.com) + Cunhado (Marceneiro - cunhado@dluxury.com)
- [ ] Materiais básicos cadastrados (MDF BP 15mm, 18mm, etc.) (Cadastrar via painel)
- [ ] Ferragens cadastradas (minifix, dobradiça, corrediça básica) (Cadastrar via painel)

### Checklist Validação Técnica Inicial

```bash
# Testar cada rota crítica:
✓ /dashboard → carrega sem erro
✓ /materiais → lista e cria material
✓ /projetos → lista vazio inicialmente
✓ /producao → painel vazio mas carrega
✓ /admin → bloqueia se não for SuperAdmin
```

### Criar Documento de Registro

Criar planilha Excel: `validacao_marcenai_dluxury.xlsx`

**Colunas:**
- Data
- Projeto (nome/código)
- Tipo módulo (cozinha/closet/banheiro)
- Tempo engenharia manual (antes)
- Tempo engenharia sistema (depois)
- Erro encontrado? (sim/não)
- Descrição erro
- Peça gerada correta? (sim/não/parcial)
- Observações

---

## DIA 3-14: PROCESSAR 5 PROJETOS REAIS

### Seleção de Projetos

**Critério de seleção:**

1. **Projeto Simples** (armário suspenso 2 portas)
2. **Projeto Médio** (cozinha linear 3 módulos)
3. **Projeto Complexo** (cozinha L com ilha)
4. **Projeto com gavetas** (gaveteiro 4 gavetas)
5. **Projeto com portas** (guarda-roupa 3 portas de correr)

**Evitar:** Projetos com elementos curvos ou especiais na primeira rodada.

---

### PROTOCOLO DE TESTE POR PROJETO

Para cada um dos 5 projetos, seguir este protocolo:

#### ETAPA 1: Modelagem SketchUp

```
TEMPO INÍCIO: ________
TEMPO FIM: ________
DURAÇÃO: ________

CHECKLIST:
□ Projeto modelado seguindo padrões D'Luxury
□ Plugin marcenai_sync.rb instalado e ativo
□ Componentes nomeados corretamente
□ Usinagens marcadas (furos, rasgos)
□ Exportação executada sem erro
□ Arquivo JSON gerado
```

#### ETAPA 2: Importação Sistema

```
TEMPO INÍCIO: ________
TEMPO FIM: ________
DURAÇÃO: ________

CHECKLIST:
□ Upload do arquivo JSON executado
□ Parsing concluído sem erro HTTP 500
□ Projeto criado no banco de dados
□ Móveis listados corretamente
□ Peças exibidas na interface
□ Usinagens importadas
```

**Captura obrigatória:**
- Screenshot da lista de peças
- Screenshot do móvel expandido
- Cópia do JSON enviado (backup)

#### ETAPA 3: Validação Engine Paramétrica

```
CHECKLIST VALIDAÇÃO:

DIMENSÕES:
□ Largura das peças está correta?
□ Altura das peças está correta?
□ Espessura corresponde ao material?

USINAGENS:
□ Furos minifix estão posicionados corretamente?
□ Furos dobradiça estão na face correta?
□ Furações de corrediça estão alinhadas?
□ Não há furos fantasmas (fora da peça)?
□ Não há sobreposição de furos?

BORDAS:
□ Bordas necessárias foram identificadas?
□ Tipo de borda está correto (ABS/PVC)?
□ Metragem de borda está consistente?

MATERIAIS:
□ Material correto foi atribuído?
□ Quantidade de chapas calculada?
□ Reaproveitamento considerado?
```

**Validação Manual Obrigatória:**

Pegar **UMA peça** do projeto e validar manualmente:

```
PEÇA SELECIONADA: ________________

DIMENSÕES ESPERADAS:
- Largura: _____ mm
- Altura: _____ mm
- Espessura: _____ mm

DIMENSÕES SISTEMA:
- Largura: _____ mm
- Altura: _____ mm
- Espessura: _____ mm

BORDAS ESPERADAS:
- Lado A: sim/não | tipo: _____
- Lado B: sim/não | tipo: _____
- Lado C: sim/não | tipo: _____
- Lado D: sim/não | tipo: _____

BORDAS SISTEMA:
- Lado A: sim/não | tipo: _____
- Lado B: sim/não | tipo: _____
- Lado C: sim/não | tipo: _____
- Lado D: sim/não | tipo: _____

FUROS ESPERADOS: _____ unidades
FUROS SISTEMA: _____ unidades

STATUS FINAL: ✅ CORRETO | ⚠️ PARCIAL | ❌ INCORRETO
```

#### ETAPA 4: Geração PDF Produção

```
TEMPO INÍCIO: ________
TEMPO FIM: ________
DURAÇÃO: ________

CHECKLIST:
□ Botão "Gerar PDF" clicado
□ PDF gerado sem erro
□ PDF abriu corretamente
□ Todas as peças listadas
□ Dimensões legíveis
□ Código de barras gerado
□ Ordem de corte lógica
□ Fitas de borda descritas
□ Usinagens descritas por peça
```

**Teste de Produção Real:**

Imprimir o PDF e entregar ao cunhado (produção):

```
FEEDBACK PRODUÇÃO:
□ PDF está legível na marcenaria?
□ Informações estão completas?
□ Ordem de corte faz sentido?
□ Consegue identificar usinagens?
□ Faltou alguma informação?

OBSERVAÇÕES:
_________________________________
_________________________________
_________________________________
```

#### ETAPA 5: Produção Física (CRÍTICO)

**Este é o teste definitivo.**

Selecionar **1 peça simples** de cada projeto e mandar produzir fisicamente.

```
PEÇA PRODUZIDA: ________________

CHECKLIST FÍSICO:
□ Corte executado
□ Dimensões conferidas com trena
□ Furos executados
□ Furos estão na posição correta?
□ Borda colada
□ Borda está nas faces corretas?

MEDIÇÕES REAIS:
- Largura real: _____ mm
- Altura real: _____ mm
- Espessura real: _____ mm

FUROS VALIDADOS:
- Furo 1: posição _____ mm x _____ mm → ✅ OK | ❌ ERRO
- Furo 2: posição _____ mm x _____ mm → ✅ OK | ❌ ERRO
- Furo 3: posição _____ mm x _____ mm → ✅ OK | ❌ ERRO

STATUS FINAL: ✅ MONTOU CORRETAMENTE | ❌ NÃO MONTOU
```

Se a peça **não montar corretamente**, o sistema **FALHOU** no teste.

#### ETAPA 6: Métricas de Tempo

```
COMPARAÇÃO ANTES vs DEPOIS:

ENGENHARIA MANUAL (método antigo):
- Tempo desenho técnico: _____ min
- Tempo lista de corte: _____ min
- Tempo conferência: _____ min
- TOTAL: _____ min

ENGENHARIA SISTEMA (método novo):
- Tempo modelagem SketchUp: _____ min
- Tempo importação: _____ min
- Tempo validação: _____ min
- TOTAL: _____ min

ECONOMIA: _____ min (_____ %)

VALE A PENA? ✅ SIM | ❌ NÃO
```

---

## REGISTRO DE ERROS OBRIGATÓRIO

Para **cada erro encontrado**, preencher:

```
ERRO #___

DATA: ________
PROJETO: ________________
ETAPA: Importação / Engine / PDF / Produção

DESCRIÇÃO:
_________________________________
_________________________________

IMPACTO:
□ Crítico (bloqueia uso)
□ Alto (gera retrabalho)
□ Médio (gera confusão)
□ Baixo (cosmético)

SCREENSHOT/LOG:
[anexar]

WORKAROUND USADO:
_________________________________
```

---

# SEMANA 3: ANÁLISE INTERMEDIÁRIA

## DIA 15: CONSOLIDAR RESULTADOS

### Métricas a Calcular

```python
# Pseudo-código das métricas

total_projetos = 5
projetos_sucesso = 0  # peça montou corretamente
projetos_falha = 0    # peça não montou
projetos_parcial = 0  # montou mas com ajustes

taxa_sucesso = (projetos_sucesso / total_projetos) * 100

tempo_medio_antes = sum(tempos_manuais) / 5
tempo_medio_depois = sum(tempos_sistema) / 5
economia_tempo = ((tempo_medio_antes - tempo_medio_depois) / tempo_medio_antes) * 100

erros_criticos = count(erros where impacto == "Crítico")
erros_altos = count(erros where impacto == "Alto")
```

### Critérios de Decisão

```
SE taxa_sucesso >= 80%:
    → Sistema validado
    → Prosseguir para Semana 4
    → Planejar correções não-críticas

SE taxa_sucesso < 80%:
    → PARAR validação
    → Executar correções CRÍTICAS
    → Reiniciar protocolo

SE erros_criticos > 0:
    → PARAR validação
    → Priorizar correção
    → Não prosseguir até resolver
```

---

## DIA 16-21: CORREÇÕES CRÍTICAS

Se houver erros críticos ou taxa de sucesso < 80%, usar esta semana para:

### Processo de Correção

1. **Listar erros por prioridade**
   - Críticos primeiro
   - Altos depois
   - Médios por último

2. **Para cada erro crítico:**

```markdown
PROMPT ANTIGRAVITY:

Arquivo: [caminho_exato_do_arquivo]

Problema identificado:
[descrição_detalhada_do_erro]

Comportamento esperado:
[como_deveria_funcionar]

Comportamento atual:
[como_está_funcionando]

Contexto:
- Stack: Next.js 15 + Drizzle + Neon
- Tenant: empresaId isolation
- Fase: [número_da_fase]

Correção necessária:
[passo_a_passo_da_correção]

NÃO simplificar.
Manter arquitetura existente.
Validar isolamento multi-tenant.
```

3. **Testar correção imediatamente**
   - Re-executar o projeto que falhou
   - Validar se erro foi eliminado
   - Documentar resultado

---

# SEMANA 4: RODADA FINAL

## DIA 22-28: PROCESSAR 5 NOVOS PROJETOS

Repetir o protocolo completo com 5 projetos diferentes:

6. **Projeto mesa escritório** (tampo + lateral)
7. **Projeto rack TV** (3 nichos)
8. **Projeto criado-mudo** (gaveta + porta)
9. **Projeto módulo ilha** (cozinha)
10. **Projeto painel TV** (fixação parede)

**Objetivo:** Confirmar que correções funcionaram e sistema é estável.

---

## DIA 29-30: RELATÓRIO FINAL DE VALIDAÇÃO

### Estrutura do Relatório

```markdown
# RELATÓRIO FINAL DE VALIDAÇÃO OPERACIONAL
## MarcenAI Enterprise @ D'Luxury Ambientes

### 1. RESUMO EXECUTIVO

Total de projetos testados: 10
Projetos bem-sucedidos: ___
Taxa de sucesso: ____%

Economia de tempo média: _____%
Erros críticos resolvidos: ___
Erros pendentes: ___

RECOMENDAÇÃO: ✅ APROVADO PARA USO | ⚠️ CONDICIONAL | ❌ REQUER REFATORAÇÃO

---

### 2. MÉTRICAS OPERACIONAIS

| Métrica | Antes (manual) | Depois (sistema) | Melhoria |
|---------|----------------|------------------|----------|
| Tempo engenharia | ___ min | ___ min | ___% |
| Erros produção | ___ | ___ | ___% |
| Retrabalho | ___ | ___ | ___% |
| Precisão peças | __% | __% | ___pp |

---

### 3. DETALHAMENTO POR PROJETO

[Para cada projeto]

**Projeto #1: [nome]**
- Status: ✅ / ⚠️ / ❌
- Tempo: ___ min
- Erros: ___
- Observações: ___

---

### 4. ERROS IDENTIFICADOS

#### Erros Críticos Resolvidos
1. [descrição]
2. [descrição]

#### Erros Pendentes
1. [descrição] - Impacto: ___
2. [descrição] - Impacto: ___

---

### 5. CASOS DE SUCESSO

[Descrever 2-3 casos onde sistema superou expectativas]

---

### 6. LIMITAÇÕES IDENTIFICADAS

O sistema NÃO funciona bem para:
- [tipo de projeto 1]
- [tipo de projeto 2]

Requer validação manual para:
- [situação 1]
- [situação 2]

---

### 7. RECOMENDAÇÕES

#### Uso Imediato (aprovado)
- [módulos/tipos que funcionam]

#### Uso Condicional (validar sempre)
- [módulos/tipos que precisam atenção]

#### Não Usar (requer correção)
- [módulos/tipos que falharam]

---

### 8. PRÓXIMOS PASSOS

SE APROVADO:
→ Integrar na operação diária D'Luxury
→ Processar todos os novos projetos pelo sistema
→ Manter registro de erros encontrados
→ Após 90 dias operação estável → avaliar FASE 17

SE CONDICIONAL:
→ Corrigir erros pendentes
→ Re-validar módulos problemáticos
→ Usar apenas para tipos aprovados
→ Revisitar validação em 60 dias

SE REPROVADO:
→ PARAR uso produtivo
→ Priorizar refatoração técnica
→ Re-executar validação completa
→ Não avançar para novas features
```

---

# 🎯 CRITÉRIOS DE APROVAÇÃO FINAL

## Aprovação Completa (pode usar em produção)

```
✅ Taxa sucesso >= 80%
✅ Zero erros críticos pendentes
✅ Economia tempo >= 30%
✅ Feedback produção positivo
✅ Pelo menos 8 de 10 peças físicas corretas
```

## Aprovação Condicional (usar com atenção)

```
⚠️ Taxa sucesso >= 60%
⚠️ Erros críticos <= 2 e com workaround
⚠️ Economia tempo >= 15%
⚠️ Feedback produção neutro
⚠️ Pelo menos 6 de 10 peças físicas corretas
```

## Reprovação (não usar em produção)

```
❌ Taxa sucesso < 60%
❌ Erros críticos > 2
❌ Economia tempo < 15% ou negativa
❌ Feedback produção negativo
❌ Menos de 6 de 10 peças físicas corretas
```

---

# 📋 CHECKLIST DIÁRIO DURANTE VALIDAÇÃO

```
DIA ____ / 30

□ Acordei cedo
□ Separei 4h ininterruptas para teste
□ Abri planilha de registro
□ Sistema acessível
□ Materiais/ferragens cadastrados

PROJETOS DO DIA:
□ Projeto #___ → Status: _______
□ Projeto #___ → Status: _______

□ Erros registrados detalhadamente
□ Screenshots salvos
□ Planilha atualizada
□ Backup dos JSONs feito

OBSERVAÇÕES DO DIA:
___________________________________
___________________________________
```

---

# ⚠️ REGRAS ABSOLUTAS DURANTE VALIDAÇÃO

## NÃO FAZER:

❌ Adicionar features novas  
❌ Refatorar código por "beleza"  
❌ Otimizar performance prematuramente  
❌ Desenvolver integrações novas  
❌ Planejar FASE 17+ antes de concluir validação  
❌ Ignorar erros "pequenos"  
❌ Passar para próximo projeto sem documentar  
❌ Usar sistema em cliente real antes de aprovar  

## FAZER:

✅ Registrar TUDO  
✅ Ser brutal e honesto nas avaliações  
✅ Testar peças fisicamente  
✅ Envolver o cunhado (produção) em todos os testes  
✅ Documentar workarounds necessários  
✅ Fotografar peças produzidas  
✅ Comparar tempos honestamente  
✅ Parar se taxa de falha > 40%  

---

# 🚨 SINAIS DE ALERTA

## PARAR VALIDAÇÃO IMEDIATAMENTE SE:

1. **3 projetos consecutivos falharem completamente**
   - Significa problema estrutural na engine
   - Refatoração necessária antes de continuar

2. **Sistema gerar peças com dimensões erradas > 5mm**
   - Erro crítico de engenharia
   - Pode gerar prejuízo material

3. **Furos fantasmas ou fora da peça aparecerem**
   - Problema na geometria paramétrica
   - Bloqueia produção CNC futura

4. **Imports do SketchUp falharem > 50%**
   - Plugin ou parser com problema
   - Base de dados pode estar corrompida

5. **PDFs não gerarem ou travarem**
   - Problema de infraestrutura
   - Inviabiliza uso prático

Nesses casos:
→ **ABORTAR validação**  
→ **PRIORIZAR correção do problema**  
→ **REINICIAR validação após correção**

---

# 📊 MODELO DE PLANILHA DE REGISTRO

## Aba 1: Projetos

| Data | Projeto | Tipo | Tempo Manual | Tempo Sistema | Economia | Status | Erros | Obs |
|------|---------|------|--------------|---------------|----------|--------|-------|-----|
| 19/05 | Arm-001 | Suspenso | 45min | 20min | 56% | ✅ | 0 | Perfeito |
| 19/05 | Coz-001 | Linear | 120min | 60min | 50% | ⚠️ | 2 | Furo errado |
| | | | | | | | | |

## Aba 2: Erros

| # | Data | Projeto | Etapa | Descrição | Impacto | Status | Solução |
|---|------|---------|-------|-----------|---------|--------|---------|
| 1 | 19/05 | Coz-001 | Engine | Furo minifix 5mm deslocado | Alto | Pendente | - |
| 2 | 19/05 | Coz-001 | PDF | Falta metragem total borda | Médio | Resolvido | v1.2 |
| | | | | | | | |

## Aba 3: Métricas

| Métrica | Valor |
|---------|-------|
| Projetos testados | 10 |
| Projetos OK | 8 |
| Taxa sucesso | 80% |
| Tempo médio antes | 75 min |
| Tempo médio depois | 35 min |
| Economia tempo | 53% |
| Erros críticos | 0 |
| Erros altos | 3 |
| Erros médios | 7 |
| Erros baixos | 12 |

## Aba 4: Feedback Produção

| Data | Feedback | Categoria |
|------|----------|-----------|
| 20/05 | PDF está confuso, falta legenda | Documentação |
| 22/05 | Ordem de corte não faz sentido | Lógica |
| 25/05 | Usinagens claras, muito bom | Positivo |
| | | |

---

# 🎯 CONCLUSÃO

Este plano de validação tem um objetivo simples:

> **Descobrir se o investimento em 9 fases de desenvolvimento gerou um sistema que funciona na vida real.**

Não é sobre features.  
Não é sobre tecnologia.  
Não é sobre arquitetura bonita.

É sobre:

```
A PEÇA SAI CORRETA?
```

Se sim → Sistema validado → Avançar  
Se não → Sistema reprovado → Refatorar

**30 dias para descobrir a verdade.**

---

*Documento criado em 18/05/2026 por Claude + Jose*  
*D'Luxury Ambientes — Validação Operacional MarcenAI Enterprise*