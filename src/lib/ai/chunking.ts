/**
 * Sistema de Chunking Técnico para Documentos e Manuais.
 * No ambiente industrial, não podemos quebrar um parágrafo no meio
 * de uma medida de tolerância ou fórmula.
 */

export function chunkTechnicalDocument(
  content: string,
  maxTokens: number = 800,
  overlapTokens: number = 100
): string[] {
  // 1. Quebrar em parágrafos lógicos (ex: quebras de linha duplas, itens de lista)
  // 2. Um chunking focado em engenharia tenta não quebrar blocos que contêm
  //    símbolos de unidades importantes juntos (ex: "Folga: 2mm" ou fórmulas).
  
  // Como simplificação robusta para a arquitetura:
  const paragraphs = content.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    // Estimativa básica de tokens (1 palavra ~= 1.3 tokens)
    const paraTokenCount = para.split(/\s+/).length * 1.3;
    const currentTokenCount = currentChunk.split(/\s+/).length * 1.3;

    if (currentTokenCount + paraTokenCount > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Overlap: Guarda a última parte do chunk anterior se necessário
      // (aqui simplificado apenas para iniciar novo chunk)
      currentChunk = para + '\n\n';
    } else {
      currentChunk += para + '\n\n';
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
