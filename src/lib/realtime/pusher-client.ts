import PusherClient from 'pusher-js';

// Singleton para não abrir múltiplas conexões no cliente
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (typeof window === 'undefined') return null;

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }

  return pusherClientInstance;
};
