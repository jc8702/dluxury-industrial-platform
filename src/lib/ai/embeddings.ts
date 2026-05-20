import { genAI } from './client';

export async function gerarEmbedding(texto: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent({
      content: { parts: [{ text: texto }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    } as any);
    return result.embedding.values;
  } catch (error: any) {
    console.error('Erro embedding Gemini:', error);
    throw new Error(`Falha de vetorização: ${error.message}`);
  }
}