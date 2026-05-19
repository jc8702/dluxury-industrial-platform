import { streamText } from 'ai';
import { model } from '@/lib/ai/client';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { auth } from '@/auth';
import { gerarEmbedding } from '@/lib/ai/embeddings';
import { buscarContextoSemantico } from '@/lib/ai/retrieval';
import { createAiTools } from '@/lib/ai/tools';

/**
 * POST /api/chat
 * Endpoint seguro, autenticado e integrado com RAG e Function Calling protegidos por multi-tenancy
 */
export async function POST(req: Request) {
  try {
    // 0. Validar configuração do Gemini
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Serviço de IA Indisponível: A chave de API do Gemini não está configurada no servidor (.env).' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // 3. Obter ID da empresa (tenant) para isolamento absoluto RLS no RAG e nas AI Tools
    const empresaId = session?.user?.empresaId;
    let promptDinamico = SYSTEM_PROMPT;

    // 4. Executar pipeline RAG se houver tenant ativo e mensagens
    if (empresaId && messages.length > 0) {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user' && lastMessage.content) {
          console.log(`[RAG] Gerando embedding para a dúvida do usuário no tenant: ${empresaId}`);
          
          // a. Gerar embedding da dúvida
          const queryEmbedding = await gerarEmbedding(lastMessage.content);
          
          // b. Buscar no Neon Postgres usando pgvector os manuais com similaridade semântica
          const contextos = await buscarContextoSemantico(empresaId, queryEmbedding, 3, 0.65);
          
          // c. Se houver manuais correspondentes, enriquecer o prompt do sistema
          if (contextos.length > 0) {
            console.log(`[RAG] Sucesso: ${contextos.length} documento(s) técnico(s) recuperado(s) do Neon!`);
            
            const contextText = contextos
              .map((c, i) => `[DOCUMENTO OFICIAL ${i + 1} - Categoria: ${c.entidadeTipo.toUpperCase()} - Confiança Semântica: ${(c.similarity * 100).toFixed(1)}%]:\n${c.conteudoTexto}`)
              .join('\n\n');

            promptDinamico = `${SYSTEM_PROMPT}

### CONTEXTO TÉCNICO OFICIAL RECUPERADO (Use estas especificações oficiais da D'Luxury para responder com prioridade absoluta e evite alucinar):
${contextText}
`;
          } else {
            console.log('[RAG] Nenhuma correspondência semântica de alta confiança encontrada na base de manuais.');
          }
        }
      } catch (ragError) {
        console.error('[RAG] Falha tolerada no pipeline de recuperação semântica:', ragError);
      }
    }

    // 5. Instanciar as ferramentas protegidas com isolamento multi-tenant
    const tools = empresaId ? createAiTools(empresaId) : {};

    // 6. Executar o streaming de texto com Gemini 2.0 Flash enriquecido com RAG e Function Calling
    const result = await streamText({
      model: model,
      system: promptDinamico,
      messages: messages,
      temperature: 0.25, // Baixo para maior fidelidade e controle de respostas de engenharia
      // @ts-ignore
      maxTokens: 2000,
      tools: tools,
      maxSteps: 5, // Habilita a IA a encadear chamadas de ferramentas e consolidar as respostas de forma autônoma
    });

    // 7. Retornar o stream binário de dados no formato padrão do AI SDK
    // @ts-ignore
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Erro na API de Chat IA com RAG e Tools:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Erro interno do servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
