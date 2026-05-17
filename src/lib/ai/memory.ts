import { Redis } from '@upstash/redis';
import { CoreMessage } from 'ai';

// Initialize Redis client. Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();

const MEMORY_TTL = 60 * 60 * 24; // 24 hours in seconds

export async function saveChatMemory(chatId: string, messages: CoreMessage[]) {
  // Save the full history for the conversation to keep context active
  await redis.setex(`chat:memory:${chatId}`, MEMORY_TTL, JSON.stringify(messages));
}

export async function getChatMemory(chatId: string): Promise<CoreMessage[]> {
  const data = await redis.get<string | CoreMessage[]>(`chat:memory:${chatId}`);
  if (!data) return [];
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

export async function clearChatMemory(chatId: string) {
  await redis.del(`chat:memory:${chatId}`);
}
