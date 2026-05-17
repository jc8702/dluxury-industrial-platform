import { Logger } from 'next-axiom';
import * as Sentry from '@sentry/nextjs';
import { v4 as uuidv4 } from 'uuid';

export const logger = new Logger();

interface LogMetadata {
  empresaId?: string;
  userId?: string;
  requestId?: string;
  modulo?: 'engenharia' | 'producao' | 'financeiro' | 'api' | 'auth';
  [key: string]: any;
}

export class EnterpriseLogger {
  
  static info(message: string, meta?: LogMetadata) {
    const enrichedMeta = this.enrich(meta);
    logger.info(message, enrichedMeta);
    // Flush implícito em Serveless no Axiom ocorre ao fim da request.
  }

  static warn(message: string, meta?: LogMetadata) {
    const enrichedMeta = this.enrich(meta);
    logger.warn(message, enrichedMeta);
    Sentry.captureMessage(message, { level: 'warning', extra: enrichedMeta });
  }

  static error(message: string, error: Error | unknown, meta?: LogMetadata) {
    const enrichedMeta = this.enrich(meta);
    
    // Log Estruturado (Axiom/Elasticsearch)
    logger.error(message, {
      ...enrichedMeta,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Rastreamento de Erro (Sentry/Stacktrace)
    Sentry.withScope((scope) => {
      if (enrichedMeta.empresaId) scope.setTag('tenant_id', enrichedMeta.empresaId);
      if (enrichedMeta.userId) scope.setUser({ id: enrichedMeta.userId });
      if (enrichedMeta.modulo) scope.setTag('modulo', enrichedMeta.modulo);
      
      Sentry.captureException(error);
    });
  }

  /**
   * Adiciona Tracing Context ID automaticamente se não passado
   */
  private static enrich(meta?: LogMetadata): LogMetadata {
    return {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...meta,
    };
  }
}
