import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Inicializamos NextAuth com a config que é compativel com Edge runtime
export default NextAuth(authConfig).auth;

// Definimos em quais rotas o middleware vai agir
export const config = {
  matcher: [
    // Pula rotas estáticas e imagens
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
