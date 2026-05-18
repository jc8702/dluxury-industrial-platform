import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Inicializa o provedor do Google Generative AI com suporte a múltiplas chaves de ambiente
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY || '',
});

// Usamos o modelo 'gemini-2.0-flash' como padrão, que é extremamente performático, rápido e ideal para chat streaming em tempo real.
export const model = google('gemini-2.0-flash');
