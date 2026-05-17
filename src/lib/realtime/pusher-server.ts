import PusherServer from 'pusher';

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/**
 * Emite eventos Real-time para todos os clientes conectados.
 * Chamado nos gatilhos de banco (ex: Peça cortada, projeto aprovado)
 */
export async function emitRealtimeUpdate(empresaId: string, eventName: string, payload: any) {
  try {
    await pusherServer.trigger(`empresa-${empresaId}`, eventName, payload);
  } catch (error) {
    console.error('Falha no Pusher Realtime:', error);
  }
}
