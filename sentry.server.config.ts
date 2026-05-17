import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Monitoramento severo no backend
  tracesSampleRate: 1.0, 
  
  // Habilita profile do V8 no Node para achar gargalos de CPU (Ex: Engine Paramétrica pesada)
  profilesSampleRate: 1.0,
  
  environment: process.env.NODE_ENV,
  
  // Filtro de erros desnecessários para economizar cota no Sentry
  ignoreErrors: [
    "RateLimitExceeded", // Já logamos no Axiom de forma estruturada
    "Unauthorized",
  ],
});
