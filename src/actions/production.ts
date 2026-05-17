'use server';

import { db } from '@/db';
import { producao, pecas } from '@/db/schema/index';
import { rastreabilidadePecas } from '@/db/schema/rastreabilidade';
import { eq } from 'drizzle-orm';
import { requirePermission } from '@/lib/auth/roles';
import { ProductionWorkflow } from '@/lib/production/workflow';
import { ProductionExport, ReportPart } from '@/lib/production/export';

/**
 * Libera projeto da Engenharia para a Produção
 * Cria as chaves de rastreabilidade para todas as peças.
 */
export async function releaseOrderToProduction(producaoId: string, empresaId: string, userRole: string) {
  requirePermission(userRole, 'projetos:write');

  // Buscar todas as peças atreladas a esta Ordem
  // Neste schema simplificado, precisariamos fazer join projeto -> moveis -> pecas.
  // Vamos abstrair pegando todas as peças do ambiente (simulação)
  const pecasDB = await db.select({ id: pecas.id }).from(pecas).limit(10); // Mock

  // Gera o Tracking ID em batch
  await ProductionWorkflow.initializeOrderTraceability(producaoId, pecasDB.map(p => p.id), empresaId);

  // Muda status da OP
  await db.update(producao).set({ status: 'corte' }).where(eq(producao.id, producaoId));

  return { success: true, message: 'Ordem liberada para a fábrica com Rastreabilidade Ativada.' };
}

/**
 * Aponta leitura de código de barras (Bipagem na fábrica)
 */
export async function scanBarcodeOperation(codigoBarras: string, etapa: 'corte' | 'borda' | 'furo' | 'montagem', userId: string, userRole: string) {
  requirePermission(userRole, 'producao:write');
  return await ProductionWorkflow.pointProductionStep(codigoBarras, etapa, userId);
}

/**
 * Gera e retorna Base64 das Etiquetas em PDF
 */
export async function getProductionLabelsBase64(producaoId: string, userRole: string): Promise<string> {
  requirePermission(userRole, 'producao:read');

  // Consulta real buscaria as peças + rastreabilidade.id
  const traces = await db.select()
    .from(rastreabilidadePecas)
    .where(eq(rastreabilidadePecas.producaoId, producaoId));

  const items = await Promise.all(traces.map(async (t) => ({
    codigo: t.codigoBarras,
    nome: `Peça ${t.id.substring(0,4)}`,
    dimensoes: '800 x 600 x 18',
    qrCodeBase64: await ProductionWorkflow.generatePartQRCode(t.codigoBarras)
  })));

  const pdfBuffer = await ProductionExport.generateLabelsPDF(items);
  return pdfBuffer.toString('base64');
}

/**
 * Retorna Base64 do Excel (BOM / Plano de Corte)
 */
export async function getExcelBOMBase64(producaoId: string, userRole: string): Promise<string> {
  requirePermission(userRole, 'producao:read');

  const items: ReportPart[] = [
    { codigo: 'P-1A2B', nome: 'Lateral Dir', dimensoes: '700x550x18', fitaBorda: 'Frente' },
    { codigo: 'P-3C4D', nome: 'Base', dimensoes: '764x550x18', fitaBorda: 'Frente/Trás' },
  ];

  const excelBuffer = await ProductionExport.generateExcelBOM(items);
  return excelBuffer.toString('base64');
}
