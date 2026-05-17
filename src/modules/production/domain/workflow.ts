export type ProductionStatus = 'aguardando' | 'corte' | 'borda' | 'furo' | 'montagem' | 'expedicao';

export interface ProductionEvent {
  pecaId: string;
  operadorId: string;
  statusAnterior: ProductionStatus;
  statusNovo: ProductionStatus;
  timestamp: Date;
  maquinaId?: string; // ID da CNC ou Seccionadora
}

/**
 * Máquina de Estados Finita (FSM) para garantir a ordem correta de fabricação
 * Uma peça não pode ir para FURO sem passar pelo CORTE e BORDA antes.
 */
export class ProductionWorkflow {
  private static readonly FLOW: Record<ProductionStatus, ProductionStatus[]> = {
    'aguardando': ['corte'],
    'corte': ['borda', 'furo', 'montagem'], // Peças sem borda podem ir pro furo direto
    'borda': ['furo', 'montagem'],
    'furo': ['montagem'],
    'montagem': ['expedicao'],
    'expedicao': []
  };

  public static canTransition(current: ProductionStatus, next: ProductionStatus): boolean {
    return this.FLOW[current].includes(next);
  }

  public static generateBarcodePayload(pecaId: string, moduloId: string, orderId: string): string {
    // Padrão GS1-128 simplificado para leitura óptica no chão de fábrica
    // Mapeia: OrdemProducao | Modulo | Peca
    return `OP:${orderId}|MOD:${moduloId}|PC:${pecaId}`;
  }
}
