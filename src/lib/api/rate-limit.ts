import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/ai/memory'; // Reaproveitando instância

// Rate Limit para APIs (ERP, CNC Integrations, Web App)
// Ex: 100 requisições a cada 10 segundos por IP ou API Key
export const apiRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '10 s'),
  analytics: true, // Registra logs de tentativa no Upstash
});
