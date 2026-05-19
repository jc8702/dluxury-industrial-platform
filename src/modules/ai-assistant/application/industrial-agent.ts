import { generateText, streamText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { VectorStore } from '../infrastructure/vector-store';
import { AskRequest } from '../domain/types';

export class IndustrialAgent {
  
  /**
   * Prompt de Sistema Rigoroso (Anti-Alucinação e Compliance de Engenharia)
   */
  private static readonly SYSTEM_PROMPT = `
Você é o MarcenAI, um Engenheiro Chefe de Produção e Assistente CAD/CAM Industrial.
Você ajuda marceneiros, projetistas e operadores de chão de fábrica.

REGRAS CRÍTICAS (DEVER DE MÁXIMA IMPORTÂNCIA):
1. NUNCA invente medidas, espessuras ou folgas. Baseie-se APENAS no contexto fornecido.
2. NUNCA altere cálculos de engenharia paramétrica. Se um vão livre é X, é X.
3. Se lhe perguntarem sobre peso suportado, instalação de dobradiças, ou usinagem CNC e a resposta não constar no contexto técnico recuperado, Diga: "Não tenho documentação técnica de fábrica para validar essa operação. Consulte a Engenharia."
4. NUNCA gere respostas genéricas de assistentes (ex: "Claro, posso ajudar!"). Seja direto, frio e focado no chão de fábrica.
5. Se identificar risco de colisão estrutural na pergunta (ex: Prateleira de 1200mm sem engrossos), alerte imediatamente sobre flambagem.
`;

  /**
   * RAG Pipeline Completo: Vetoriza Pergunta -> Busca no DB -> Injeta Contexto -> Gemini Responde
   */
  public static async ask(request: AskRequest) {
    // 1. Vetoriza a pergunta do usuário para comparar com nossa base industrial
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: request.question,
    });

    // 2. Busca Fragmentos (Chunks) Relevantes no PostgreSQL (pgvector) daquele Tenant Específico
    const relevantDocs = await VectorStore.findSimilar(
      request.context.empresaId, 
      queryEmbedding, 
      5
    );

    // 3. Constrói o Bloco de Contexto RAG para o LLM
    const contextText = relevantDocs
      .map(doc => `[FONTE TÉCNICA - TIPO: ${doc.entidadeTipo} | SIMILARIDADE: ${(doc.similarity as number).toFixed(2)}]\n${doc.conteudoTexto}`)
      .join('\n\n---\n\n');

    const finalPrompt = `
CONTEXTO INDUSTRIAL RECUPERADO DA EMPRESA:
${contextText.length > 0 ? contextText : "Nenhum documento técnico encontrado nesta marcenaria."}

---

PERGUNTA DO OPERADOR/PROJETISTA:
${request.question}

Lembre-se das suas diretrizes críticas. Responda baseando-se ESTRITAMENTE no contexto acima.
`;

    // 4. Invoca o Modelo Gemini 2.5 Pro (Otimizado para Raciocínio Profundo)
    const result = await streamText({
      model: google('gemini-2.5-pro'),
      system: this.SYSTEM_PROMPT,
      prompt: finalPrompt,
      temperature: 0.1, // Temperatura baixa forçando respostas precisas e matemáticas (menos criatividade, mais engenharia)
    });

    return result;
  }
}
