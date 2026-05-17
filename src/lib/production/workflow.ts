import QRCode from 'qrcode';
import { db } from '@/db';
import { rastreabilidadePecas, apontamentoLogs } from '@/db/schema/rastreabilidade';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enterprise Production Workflow System
 */
export class ProductionWorkflow {
  
  /**
   * Gera código de barras / QRCode em Base64 para impressão em etiquetas
   */
  static async generatePartQRCode(codigoBarras: string): Promise<string> {
    try {
      // Retorna uma string Base64 da imagem do QRCode
      return await QRCode.toDataURL(codigoBarras, { errorCorrectionLevel: 'H', width: 200 });
    } catch (err) {
      throw new Error('Falha ao gerar QRCode da peça.');
    }
  }

  /**
   * Inicializa rastreabilidade para as peças de uma nova Ordem de Produção
   */
  static async initializeOrderTraceability(producaoId: string, pecasIds: string[], empresaId: string) {
    const traces = pecasIds.map(pecaId => ({
      empresaId,
      producaoId,
      pecaId,
      codigoBarras: `P-${uuidv4().substring(0, 8).toUpperCase()}`, // Ex: P-8F3A2B1C
    }));

    // Inserção em batch para alta performance
    await db.insert(rastreabilidadePecas).values(traces);
    return traces;
  }

  /**
   * Apontamento de chão de fábrica: Avança a etapa da peça usando leitor de código de barras
   */
  static async pointProductionStep(codigoBarras: string, etapa: 'corte' | 'borda' | 'furo' | 'montagem', operadorId: string) {
    const [trace] = await db
      .select()
      .from(rastreabilidadePecas)
      .where(eq(rastreabilidadePecas.codigoBarras, codigoBarras));

    if (!trace) throw new Error('Código de barras não encontrado no sistema.');

    const updates: Record<string, boolean | Date | string> = {
      dataUltimaLeitura: new Date(),
    };

    switch (etapa) {
      case 'corte': updates.statusCorte = true; break;
      case 'borda': updates.statusBorda = true; break;
      case 'furo': updates.statusFuro = true; break;
      case 'montagem': updates.statusMontagem = true; break;
    }

    // Atualiza status da peça
    await db.update(rastreabilidadePecas)
      .set(updates)
      .where(eq(rastreabilidadePecas.id, trace.id));

    // Salva no log de auditoria operacional do chão de fábrica
    await db.insert(apontamentoLogs).values({
      rastreabilidadeId: trace.id,
      etapa,
      operadorId,
    });

    return { success: true, traceId: trace.id, newStatus: etapa };
  }
}
