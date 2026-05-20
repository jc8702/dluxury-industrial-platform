import { streamText } from 'ai';
import { model } from '@/lib/ai/client';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { auth } from '@/auth';
import { gerarEmbedding } from '@/lib/ai/embeddings';
import { buscarContextoSemantico } from '@/lib/ai/retrieval';
import { createAiTools } from '@/lib/ai/tools';

export async function POST(req: Request) {
  try {
    const hasApiKey = !!(
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY
    );

    if (!hasApiKey) {
      return new Response("[ERRO] Chave de API do Gemini não configurada.", { status: 503 });
    }

    const session = await auth();
    const empresaId = session?.user?.empresaId;
    let promptDinamico = SYSTEM_PROMPT;

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("[ERRO] O corpo da requisição deve conter um array de mensagens.", { status: 400 });
    }

    if (empresaId && messages.length > 0) {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user" && lastMessage.content) {
          const queryEmbedding = await gerarEmbedding(lastMessage.content);
          const contextos = await buscarContextoSemantico(empresaId, queryEmbedding, 3, 0.65);

          if (contextos.length > 0) {
            const contextText = contextos
              .map(
                (c, i) =>
                  `[DOCUMENTO OFICIAL ${i + 1} - ${c.entidadeTipo.toUpperCase()} - Confiança: ${(c.similarity * 100).toFixed(1)}%]:\n${c.conteudoTexto}`
              )
              .join("\n\n");

            promptDinamico = `${SYSTEM_PROMPT}\n\n### CONTEXTO TÉCNICO OFICIAL:\n${contextText}`;
          }
        }
      } catch (ragError) {
        console.warn("[RAG] Falha tolerada — continuando sem contexto RAG:", ragError);
      }
    }

    const tools = empresaId ? createAiTools(empresaId) : undefined;

    const result = await streamText({
      model: model,
      system: promptDinamico,
      messages: messages,
      temperature: 0.3,
      maxOutputTokens: 2048,
      ...(tools ? { tools } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[CHAT API] Erro:", error);
    return new Response(
      `[ERRO] Não foi possível processar sua dúvida técnica: ${error.message || "Erro interno."}`,
      { status: 500 }
    );
  }
}