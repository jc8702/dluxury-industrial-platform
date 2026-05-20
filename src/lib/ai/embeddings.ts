import { embed } from 'ai';
import { google } from './client';

export async function gerarEmbedding(texto: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('gemini-embedding-001'),
      value: texto,
      providerOptions: {
        google: { outputDimensionality: 768 },
      },
    });
    return embedding;
  } catch (error: any) {
    console.error('Erro embedding Gemini:', error);
    throw new Error(`Falha de vetorização: ${error.message}`);
  }
}