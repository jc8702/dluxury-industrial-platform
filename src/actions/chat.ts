'use server';

import { streamText, CoreMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { retrieveTechnicalContext } from '@/lib/ai/retrieval';
import { SYSTEM_PROMPT_MARCENAI } from '@/lib/ai/prompts';
import { saveChatMemory, getChatMemory } from '@/lib/ai/memory';

export async function askIndustrialAI(
  chatId: string,
  userMessage: string,
  empresaId: string
) {
  // 1. Recupera Memória de Curto Prazo (Redis)
  const previousMessages = await getChatMemory(chatId);

  // 2. RAG Pipeline: Recupera Contexto Técnico do Banco de Dados Vectorial (Neon/pgvector)
  const technicalContext = await retrieveTechnicalContext(userMessage, { 
    empresaId, 
    limit: 3, 
    similarityThreshold: 0.75 
  });

  // 3. Monta o Prompt de Contexto Rigoroso
  // Caso não encontre contexto forte, a IA deve avisar (conforme SYSTEM_PROMPT)
  let contextInjection = '';
  if (technicalContext) {
    contextInjection = `\n\n[CONTEXTO TÉCNICO RECUPERADO DA ENGENHARIA]:\n${technicalContext}`;
  } else {
    contextInjection = `\n\n[CONTEXTO TÉCNICO RECUPERADO]: Nenhuma instrução específica encontrada. AJA COM CAUTELA.`;
  }

  const finalSystemPrompt = SYSTEM_PROMPT_MARCENAI + contextInjection;

  // 4. Constrói mensagens
  const messages: CoreMessage[] = [
    { role: 'system', content: finalSystemPrompt },
    ...previousMessages,
    { role: 'user', content: userMessage }
  ];

  // 5. Configura e dispara o Gemini 2.5 Pro
  const result = await streamText({
    model: google('gemini-2.5-pro'),
    messages,
    temperature: 0.0, // Regra Crítica: 0 para máxima precisão técnica e zero alucinação
    maxTokens: 1000,
  });

  // 6. Atualiza Memória Contextual de forma assíncrona usando 'onFinish' callback do frontend 
  // (Neste caso de Server Action abstrata, delegaríamos o append ou faríamos localmente)
  // Como estamos num ambiente simplificado, para uso em server-side puro:
  
  // NOTA: Em produção real com streamText, o saveChatMemory seria chamado
  // no client, ou usando o callback `onFinish` do useChat.

  return result.toDataStreamResponse();
}
