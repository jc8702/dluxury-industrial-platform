import { db } from '@/db';
import { usoRecursos, planos, empresas } from '@/db/schema/saas';
import { eq, and } from 'drizzle-orm';
import { redis } from '@/lib/ai/memory';
import { format } from 'date-fns';

type ResourceType = 'users' | 'projects' | 'storage' | 'ai_tokens';

export class TenantLimits {
  
  /**
   * Verifica se o tenant atual estourou o limite do plano
   * Usa Redis Edge Cache para performance em milissegundos
   */
  static async checkLimit(empresaId: string, resource: ResourceType, incrementAmount = 1): Promise<boolean> {
    const periodo = format(new Date(), 'yyyy-MM');
    const cacheKey = `tenant:${empresaId}:limits:${periodo}`;
    
    let limits = await redis.get<any>(cacheKey);

    if (!limits) {
      // 1. Busca dados de limites do banco de dados (Cold Start)
      const [empresa] = await db.select({ planoId: empresas.plano })
        .from(empresas).where(eq(empresas.id, empresaId));
      
      const [plano] = await db.select()
        .from(planos).where(eq(planos.id, empresa.planoId));

      const [uso] = await db.select()
        .from(usoRecursos).where(and(eq(usoRecursos.empresaId, empresaId), eq(usoRecursos.periodo, periodo)));

      limits = {
        max_users: plano.limiteUsuarios,
        max_projects: plano.limiteProjetos,
        max_storage: plano.limiteStorageMb,
        max_ai_tokens: plano.limiteAiTokens,
        used_users: uso?.usuariosAtivos || 0,
        used_projects: uso?.projetosCriados || 0,
        used_storage: uso?.storageUtilizadoMb || 0,
        used_ai_tokens: uso?.aiTokensUtilizados || 0,
      };

      await redis.setex(cacheKey, 3600, JSON.stringify(limits)); // Cache por 1 hora
    } else if (typeof limits === 'string') {
      limits = JSON.parse(limits);
    }

    // 2. Valida o estouro
    switch (resource) {
      case 'users': return (limits.used_users + incrementAmount) <= limits.max_users;
      case 'projects': return (limits.used_projects + incrementAmount) <= limits.max_projects;
      case 'storage': return (limits.used_storage + incrementAmount) <= limits.max_storage;
      case 'ai_tokens': return (limits.used_ai_tokens + incrementAmount) <= limits.max_ai_tokens;
      default: return false;
    }
  }

  /**
   * Registra o consumo de um recurso assincronamente (Tracking)
   */
  static async consumeResource(empresaId: string, resource: ResourceType, amount: number) {
    // Num cenário Enterprise, enviamos para uma fila (SQS, Inngest, QStash) 
    // para atualizar o BD consolidado em batch sem prender o Event Loop.
    // Simulação do update Redis:
    const periodo = format(new Date(), 'yyyy-MM');
    const cacheKey = `tenant:${empresaId}:limits:${periodo}`;
    
    // Invalida cache para forçar recálculo na próxima leitura ou atualiza dinamicamente
    await redis.del(cacheKey);
  }
}
