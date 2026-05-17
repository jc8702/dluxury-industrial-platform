import { Redis } from '@upstash/redis';
import { CoreMessage } from 'ai';

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

const MEMORY_TTL = 60 * 60 * 24; // 24 hours in seconds

export async function saveChatMemory(chatId: string, messages: CoreMessage[]) {
  const redis = getRedisClient();
  if (!redis) return;
  // Save the full history for the conversation to keep context active
  await redis.setex(`chat:memory:${chatId}`, MEMORY_TTL, JSON.stringify(messages));
}

export async function getChatMemory(chatId: string): Promise<CoreMessage[]> {
  const redis = getRedisClient();
  if (!redis) return [];
  const data = await redis.get<string | CoreMessage[]>(`chat:memory:${chatId}`);
  if (!data) return [];
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

export async function clearChatMemory(chatId: string) {
  const redis = getRedisClient();
  if (!redis) return;
  await redis.del(`chat:memory:${chatId}`);
}

