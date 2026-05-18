import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL precisa ser uma URL PostgreSQL válida"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET é obrigatório"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL precisa ser uma URL válida").optional().or(z.string().min(0)),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL precisa ser uma URL válida").optional().or(z.string().min(0)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas ou ausentes:", parsed.error.format());
  throw new Error("Erro de configuração nas variáveis de ambiente. Verifique o seu console.");
}

export const env = parsed.data;
