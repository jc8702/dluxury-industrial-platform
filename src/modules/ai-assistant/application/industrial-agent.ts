import { genAI } from '@/lib/ai/client';
import { VectorStore } from '../infrastructure/vector-store';
import { AskRequest } from '../domain/types';

export class IndustrialAgent {
  private static readonly SYSTEM_PROMPT = `
Você é o MarcenAI, um Engenheiro Chefe de Produção e Assistente CAD/CAM Industrial.
Você ajuda marceneiros, projetistas e operadores de chão de fábrica.

REGRAS CRÍTICAS:
1. NUNCA invente medidas, espessuras ou folgas. Baseie-se APENAS no contexto fornecido.
2. NUNCA altere cálculos de engenharia paramétrica.
3. Se não tiver contexto técnico, diga: "Não tenho documentação técnica para validar essa operação. Consulte a Engenharia."
4. Seja direto, frio e focado no chão de fábrica.
5. Se identificar risco de colisão estrutural, alerte imediatamente sobre flambagem.
`;

  public static async ask(request: AskRequest) {
    const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await embedModel.embedContent({
      content: { parts: [{ text: request.question }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    } as any);

    const relevantDocs = await VectorStore.findSimilar(
      request.context.empresaId,
      result.embedding.values,
      5
    );

    const contextText = relevantDocs
      .map(doc => `[FONTE TÉCNICA - ${doc.entidadeTipo} | SIM: ${(doc.similarity as number).toFixed(2)}]\n${doc.conteudoTexto}`)
      .join('\n\n---\n\n');

    const finalPrompt = `${contextText.length > 0 ? `CONTEXTO:\n${contextText}\n\n---\n\n` : ''}PERGUNTA:\n${request.question}\n\n${this.SYSTEM_PROMPT}`;

    const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const response = await chatModel.generateContent(finalPrompt);
    return response.response.text();
  }
}