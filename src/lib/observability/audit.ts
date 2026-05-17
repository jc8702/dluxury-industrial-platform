import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { EnterpriseLogger } from './logger';

export interface AuditEvent {
  empresaId: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
}

export class AuditLog {
  
  /**
   * Grava logs de auditoria no Banco de Dados (PostgreSQL) para compliance e no Axiom
   * Não utilizar este método para debug, apenas para Trilhas de Auditoria (Audit Trail).
   */
  static async record(event: AuditEvent) {
    // 1. Grava no sistema de Logs distribuído
    EnterpriseLogger.info(`Audit: ${event.action} on ${event.resource}`, {
      empresaId: event.empresaId,
      userId: event.userId,
      audit_action: event.action,
      audit_resource: event.resource,
      audit_details: JSON.stringify(event.details),
      ip: event.ipAddress,
      is_audit_event: true // Flag importante para criar alertas e dashboards no Axiom
    });

    try {
      // 2. Grava Fisicamente no Banco de Dados (Storage frio, compliance longo)
      // Exemplo usando raw query para tabela 'audit_logs' que não está mapeada no ORM primário 
      // ou usando a tabela 'logs' definida antes:
      await db.execute(sql`
        INSERT INTO logs (id, empresa_id, usuario_id, acao, entidade, dados, nivel, criado_em)
        VALUES (
          gen_random_uuid(), 
          ${event.empresaId}, 
          ${event.userId}, 
          ${event.action}, 
          ${event.resource}, 
          ${JSON.stringify(event.details)}::jsonb, 
          'info', 
          NOW()
        )
      `);
    } catch (e) {
      // Fallback: Se o banco cair, o Axiom já capturou a trilha de auditoria
      EnterpriseLogger.error('Erro Crítico ao gravar log de auditoria no DB', e, { event });
    }
  }

  /**
   * Monitoramento Frequente de Abusos (Alerting Concept)
   */
  static async checkAbuse(userId: string, action: string) {
     // Ex: Disparar Sentry captureMessage se houver 50 deleções seguidas
     // Sentry.captureMessage(`Possible abuse detected for user ${userId}`, 'fatal')
  }
}
