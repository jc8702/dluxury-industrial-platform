import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient } from '@/lib/ai/memory'; // Reaproveitando instância

// Instanciamos o rate limiter de forma preguiçosa (lazy) ou defensiva
let rateLimitInstance: Ratelimit | null = null;

const getApiRatelimit = () => {
  if (rateLimitInstance) return rateLimitInstance;

  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  try {
    rateLimitInstance = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, '10 s'),
      analytics: true, // Registra logs de tentativa no Upstash
    });
    return rateLimitInstance;
  } catch (error) {
    console.error("[Rate Limit] Erro ao instanciar Ratelimit:", error);
    return null;
  }
};

// Rate Limit para APIs (ERP, CNC Integrations, Web App)
// Ex: 100 requisições a cada 10 segundos por IP ou API Key
export const apiRatelimit = {
  limit: async (identifier: string) => {
    const limiter = getApiRatelimit();
    if (!limiter) {
      return { success: true, limit: 100, reset: Date.now() + 10000, remaining: 100 };
    }
    
    try {
      return await limiter.limit(identifier);
    } catch (error) {
      console.error("[Rate Limit] Falha ao comunicar com Redis do Upstash:", error);
      return { success: true, limit: 100, reset: Date.now() + 10000, remaining: 100 };
    }
  }
};
