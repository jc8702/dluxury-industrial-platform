import * as Sentry from "@sentry/nextjs";

// Configuração para Vercel Edge Functions (Middlewares, NextAuth, RateLimits)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
