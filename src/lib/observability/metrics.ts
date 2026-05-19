import * as Sentry from '@sentry/nextjs';

/**
 * Utilitário de Monitoramento de Performance (APM)
 */
export class PerformanceMonitor {
  
  /**
   * Monitora uma transação custosa (Ex: Cálculo Paramétrico, RAG, API Call Externa)
   */
  static async traceOperation<T>(name: string, operation: string, fn: () => Promise<T>): Promise<T> {
    return await Sentry.startSpan(
      {
        name, // Ex: "Calculo_Parametrico_Movel"
        op: operation, // Ex: "math.calculation" ou "db.query"
      },
      async () => {
        try {
          return await fn();
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  }

  /**
   * Envia métricas Customizadas (Axiom Datasets)
   * Útil para plotar gráficos no Grafana/Axiom UI de contadores de negócio.
   */
  static sendMetric(name: string, value: number, tags: Record<string, string>) {
    // Sentry Metrics (Beta) ou logs agregados pelo Axiom
    // @ts-ignore
    Sentry.metrics.increment(name, value, { tags });
  }
}
