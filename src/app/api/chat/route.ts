import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';
import { buscarContextoSemantico } from '@/lib/ai/retrieval';
import { gerarEmbedding } from '@/lib/ai/embeddings';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return new Response('[ERRO] Chave de API do Gemini não configurada.', { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const session = await auth();
    const empresaId = session?.user?.empresaId;

    let SYSTEM_PROMPT = `Você é o "MarcenAI Expert", um engenheiro de móveis e especialista técnico especializado em marcenaria planejada industrial de alto padrão da D'Luxury. Responda sempre em milímetros (mm). Seja técnico e objetivo.`;

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response('[ERRO] Requisição inválida.', { status: 400 });
    }

    if (empresaId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user' && lastMessage.content) {
        try {
          const embedding = await gerarEmbedding(lastMessage.content);
          const contextos = await buscarContextoSemantico(empresaId, embedding, 3, 0.65);
          if (contextos.length > 0) {
            const contextText = contextos
              .map((c, i) => `[DOC ${i + 1} - ${c.entidadeTipo}]:\n${c.conteudoTexto}`)
              .join('\n\n');
            SYSTEM_PROMPT = `${SYSTEM_PROMPT}\n\n### CONTEXTO:\n${contextText}`;
          }
        } catch {}
      }
    }

    const history = messages
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    if (!lastUserMessage) {
      return new Response('[ERRO] Nenhuma mensagem do usuário.', { status: 400 });
    }

    const result = await chat.sendMessageStream(lastUserMessage.content);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode(`\n[ERRO] ${err.message}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[CHAT API] Erro:', error);
    return new Response(`[ERRO] ${error.message || 'Erro interno.'}`, { status: 500 });
  }
}