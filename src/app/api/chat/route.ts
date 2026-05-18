import { streamText } from 'ai';
import { model } from '@/lib/ai/client';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { auth } from '@/auth';

/**
 * POST /api/chat
 * Endpoint seguro e autenticado que roda o streaming de IA técnica usando Gemini 2.0 Flash
 */
export async function POST(req: Request) {
  try {
    // 1. Validar autenticação do usuário com NextAuth v5
    const session = await auth();
    if (!session && process.env.NODE_ENV === 'production') {
      return new Response(
        JSON.stringify({ success: false, error: 'Não autorizado. Faça login primeiro.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Extrair mensagens do body
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ success: false, error: 'O corpo da requisição deve conter um array de mensagens.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Executar o streaming de texto com Gemini 2.0 Flash e o prompt especializado
    const result = await streamText({
      model: model,
      system: SYSTEM_PROMPT,
      messages: messages,
      temperature: 0.3, // Baixo para respostas técnicas mais previsíveis, precisas e livres de alucinação
      maxTokens: 2000,
    });

    // 4. Retornar o stream binário de dados no formato de dados de IA padrão
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Erro na API de Chat IA:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Erro interno do servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
