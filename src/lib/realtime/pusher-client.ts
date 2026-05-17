import PusherClient from 'pusher-js';

// Singleton para não abrir múltiplas conexões no cliente
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (typeof window === 'undefined') return null;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    return null;
  }

  if (!pusherClientInstance) {
    try {
      pusherClientInstance = new PusherClient(key, {
        cluster: cluster,
      });
    } catch (error) {
      console.error("[Pusher] Erro ao inicializar cliente:", error);
      return null;
    }
  }

  return pusherClientInstance;
};
