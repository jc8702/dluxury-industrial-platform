import { streamText, stepCountIs } from 'ai';
import { model } from '@/lib/ai/client';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { auth } from '@/auth';
import { gerarEmbedding } from '@/lib/ai/embeddings';
import { buscarContextoSemantico } from '@/lib/ai/retrieval';
import { createAiTools } from '@/lib/ai/tools';

export async function POST(req: Request) {
  try {
    if (
      !process.env.GEMINI_API_KEY &&
      !process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
      !process.env.GOOGLE_AI_API_KEY
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Serviço de IA Indisponível: A chave de API do Gemini não está configurada no servidor (.env).",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const session = await auth();
    if (!session && process.env.NODE_ENV === "production") {
      return new Response(
        JSON.stringify({ success: false, error: "Não autorizado. Faça login primeiro." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "O corpo da requisição deve conter um array de mensagens.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const empresaId = session?.user?.empresaId;
    let promptDinamico = SYSTEM_PROMPT;

    if (empresaId && messages.length > 0) {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === "user" && lastMessage.content) {
          console.log(`[RAG] Gerando embedding para a dúvida do usuário no tenant: ${empresaId}`);

          const queryEmbedding = await gerarEmbedding(lastMessage.content);

          const contextos = await buscarContextoSemantico(empresaId, queryEmbedding, 3, 0.65);

          if (contextos.length > 0) {
            console.log(
              `[RAG] Sucesso: ${contextos.length} documento(s) técnico(s) recuperado(s) do Neon!`
            );

            const contextText = contextos
              .map(
                (c, i) =>
                  `[DOCUMENTO OFICIAL ${i + 1} - Categoria: ${c.entidadeTipo.toUpperCase()} - Confiança Semântica: ${(c.similarity * 100).toFixed(1)}%]:\n${c.conteudoTexto}`
              )
              .join("\n\n");

            promptDinamico = `${SYSTEM_PROMPT}

### CONTEXTO TÉCNICO OFICIAL RECUPERADO (Use estas especificações oficiais da D'Luxury para responder com prioridade absoluta e evite alucinar):
${contextText}
`;
          } else {
            console.log(
              "[RAG] Nenhuma correspondência semântica de alta confiança encontrada na base de manuais."
            );
          }
        }
      } catch (ragError) {
        console.error("[RAG] Falha tolerada no pipeline de recuperação semântica:", ragError);
      }
    }

    const tools = empresaId ? createAiTools(empresaId) : undefined;

    const result = await streamText({
      model: model,
      system: promptDinamico,
      messages: messages,
      temperature: 0.25,
      maxOutputTokens: 2000,
      maxToolCalls: 0,
      ...(tools ? { tools, stopWhen: stepCountIs(5) } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Erro na API de Chat IA com RAG e Tools:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro interno do servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}