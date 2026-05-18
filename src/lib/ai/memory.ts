import { Redis } from '@upstash/redis';

export type CoreMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Instância singleton para o Redis do Upstash
let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  if (!redisInstance) {
    try {
      redisInstance = new Redis({ url, token });
    } catch (error) {
      console.error("[Upstash Redis] Falha ao criar cliente:", error);
      return null;
    }
  }

  return redisInstance;
};

// Safe wrapper para evitar null pointer exceptions e sanar o TypeScript
const realRedis = getRedisClient();
export const redis = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      return realRedis ? await realRedis.get<T>(key) : null;
    } catch (e) {
      return null;
    }
  },
  setex: async (key: string, seconds: number, value: string): Promise<any> => {
    try {
      return realRedis ? await realRedis.setex(key, seconds, value) : null;
    } catch (e) {
      return null;
    }
  },
  del: async (key: string): Promise<any> => {
    try {
      return realRedis ? await realRedis.del(key) : null;
    } catch (e) {
      return null;
    }
  }
};

const MEMORY_TTL = 60 * 60 * 24; // 24 hours in seconds

export async function saveChatMemory(chatId: string, messages: CoreMessage[]) {
  const r = getRedisClient();
  if (!r) return;
  await r.setex(`chat:memory:${chatId}`, MEMORY_TTL, JSON.stringify(messages));
}

export async function getChatMemory(chatId: string): Promise<CoreMessage[]> {
  const r = getRedisClient();
  if (!r) return [];
  const data = await r.get<string | CoreMessage[]>(`chat:memory:${chatId}`);
  if (!data) return [];
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

export async function clearChatMemory(chatId: string) {
  const r = getRedisClient();
  if (!r) return;
  await r.del(`chat:memory:${chatId}`);
}
