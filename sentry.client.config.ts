import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Tracing (Monitoramento de Performance e Gargalos no Frontend)
  tracesSampleRate: 1.0, // 100% de tracing na Vercel para identificar lentidão no UI
  
  // Rastreamento Completo de Replays de Sessão (Grava o que o usuário fez antes do erro)
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false, // Em um ambiente B2B restrito (ERP), ver o texto real ajuda no debug
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Ambiente de Execução
  environment: process.env.NODE_ENV,
});
