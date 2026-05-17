import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from 'next-auth/providers/credentials';
import Resend from 'next-auth/providers/resend'; // Or Nodemailer
import bcrypt from 'bcryptjs';

import { authConfig } from './auth.config';
import { db } from '@/db';
import { usuarios } from '@/db/schema/usuarios';
import { eq } from 'drizzle-orm';
import { logSecurityEvent } from '@/lib/auth/security-logs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: { strategy: 'database' },
  providers: [
    // Magic Link
    Resend({
      from: 'MarcenAI <no-reply@marcenai.com>',
      server: process.env.EMAIL_SERVER,
    }),
    // Credentials (Email + Senha)
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        
        const [user] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.email, email))
          .limit(1);

        if (!user || !user.senhaHash) {
          // Log failed attempt
          await logSecurityEvent({
            tabela: 'usuarios',
            acao: 'login_failed',
            usuarioId: null,
            dadosNovos: { email, reason: 'user_not_found' },
          });
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.senhaHash
        );

        if (!passwordsMatch) {
          await logSecurityEvent({
            tabela: 'usuarios',
            acao: 'login_failed',
            usuarioId: user.id,
            dadosNovos: { reason: 'invalid_password' },
          });
          return null;
        }

        if (!user.ativo) {
           await logSecurityEvent({
            tabela: 'usuarios',
            acao: 'login_blocked',
            usuarioId: user.id,
            dadosNovos: { reason: 'user_inactive' },
          });
          throw new Error('User is inactive');
        }

        await logSecurityEvent({
          tabela: 'usuarios',
          acao: 'login_success',
          usuarioId: user.id,
          dadosNovos: { method: 'credentials' },
        });

        // Mapping to NextAuth expected format
        return {
          id: user.id,
          email: user.email,
          name: user.nome,
          role: user.role,
          empresaId: user.empresaId,
        };
      },
    }),
  ],
});
