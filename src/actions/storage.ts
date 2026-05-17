'use server';

import { db } from '@/db';
import { documentosTecnicos } from '@/db/schema/documentos';
import { requirePermission } from '@/lib/auth/roles';
import { getPresignedUploadUrl } from '@/lib/storage/r2';
import { processDocumentPipeline } from '@/lib/storage/indexer';
import { logSecurityEvent } from '@/lib/auth/security-logs';
import { desc, eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // Precisa npm install uuid

export async function requestDirectUpload(
  fileName: string, 
  fileType: string, 
  categoria: string,
  userRole: string,
  empresaId: string
) {
  // Controle de Auditoria e Permissão
  requirePermission(userRole, 'projetos:write');

  const fileKey = `tenant-${empresaId}/${uuidv4()}-${fileName}`;
  
  // Gera URL da Cloudflare R2 direto para o cliente (evita gargalo no servidor)
  const url = await getPresignedUploadUrl(fileKey, fileType);

  await logSecurityEvent({
    tabela: 'documentos_tecnicos',
    acao: 'presigned_url_generated',
    dadosNovos: { fileName, provider: 'cloudflare_r2' }
  });

  return { uploadUrl: url, key: fileKey };
}

export async function registerUploadedDocument(data: {
  empresaId: string;
  nomeArquivo: string;
  url: string;
  provider: 'cloudflare_r2' | 'uploadthing';
  chaveStorage: string;
  extensao: string;
  tamanhoBytes: number;
  categoria: string;
  substituirDocumentoAntigoId?: string; // Para Versionamento
}, userRole: string, userId: string) {
  
  requirePermission(userRole, 'projetos:write');

  let versao = 1;
  let versaoAnteriorId = null;

  // Lógica de Versionamento (Version Control)
  if (data.substituirDocumentoAntigoId) {
    const [oldDoc] = await db.select()
      .from(documentosTecnicos)
      .where(and(
        eq(documentosTecnicos.id, data.substituirDocumentoAntigoId),
        eq(documentosTecnicos.empresaId, data.empresaId)
      ));
      
    if (oldDoc) {
      versao = oldDoc.versao + 1;
      versaoAnteriorId = oldDoc.id;
    }
  }

  // Registra no Banco
  const [novoDoc] = await db.insert(documentosTecnicos).values({
    empresaId: data.empresaId,
    nomeArquivo: data.nomeArquivo,
    url: data.url,
    provider: data.provider,
    chaveStorage: data.chaveStorage,
    extensao: data.extensao,
    tamanhoBytes: data.tamanhoBytes,
    categoria: data.categoria,
    versao,
    versaoAnteriorId,
    createdBy: userId
  }).returning();

  // Dispara a Indexação Assíncrona no background (OCR -> Embeddings -> RAG)
  // No Vercel Functions isso deve ser disparado via inngest/upstash_qstash 
  // ou waitUntil() do vercel/functions.
  // Vamos apenas disparar de forma não-bloqueante simulada:
  processDocumentPipeline(novoDoc.id, data.empresaId).catch(console.error);

  return { success: true, documentoId: novoDoc.id };
}
