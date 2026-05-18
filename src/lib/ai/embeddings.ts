import { embed } from 'ai';
import { google } from './client';

/**
 * Gera a representação vetorial (embedding) de 768 dimensões de um texto usando o Gemini.
 * @param texto O conteúdo em texto para ser vetorizado.
 * @returns Array de floats de tamanho 768.
 */
export async function gerarEmbedding(texto: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: texto,
    });
    return embedding;
  } catch (error: any) {
    console.error('Erro na geração de embedding com Gemini:', error);
    throw new Error(`Falha de vetorização: ${error.message || error}`);
  }
}
