'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/db';
import { usuarios } from '@/db/schema/usuarios';
import { verificationTokens } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { logSecurityEvent } from '@/lib/auth/security-logs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';

export async function loginCredentials(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    throw error;
  }
}

export async function loginMagicLink(formData: FormData) {
  const email = formData.get('email') as string;
  
  await logSecurityEvent({
    tabela: 'usuarios',
    acao: 'magic_link_requested',
    dadosNovos: { email }
  });

  await signIn('resend', { email, redirectTo: '/dashboard' });
}

export async function logoutUser() {
  await logSecurityEvent({
    tabela: 'usuarios',
    acao: 'logout_success',
  });
  await signOut({ redirectTo: '/login' });
}

/**
 * Fluxo de Recuperação de Senha (Esqueci minha senha)
 */
export async function requestPasswordReset(email: string) {
  const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
  
  if (!user) return { success: true }; // Não vazar se email existe (OWASP Best Practice)

  const token = uuidv4();
  const expires = addHours(new Date(), 2);

  // Reutilizando tabela verificationToken do NextAuth para reset customizado
  await db.insert(verificationTokens).values({
    identifier: `reset_${user.email}`,
    token,
    expires,
  });

  // Em um sistema real, enviaria email aqui.
  // mockSendEmail(user.email, `/reset-password?token=${token}&email=${user.email}`);

  await logSecurityEvent({
    tabela: 'usuarios',
    acao: 'password_reset_requested',
    usuarioId: user.id
  });

  return { success: true };
}

export async function resetPassword(password: string, token: string, email: string) {
  // 1. Verifica token
  const [vt] = await db.select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, `reset_${email}`));

  if (!vt || vt.token !== token || vt.expires < new Date()) {
    throw new Error('Token inválido ou expirado');
  }

  // 2. Hash da nova senha
  const senhaHash = await bcrypt.hash(password, 12);

  // 3. Atualiza usuário
  await db.update(usuarios)
    .set({ senhaHash })
    .where(eq(usuarios.email, email));

  // 4. Invalida Token
  await db.delete(verificationTokens).where(eq(verificationTokens.identifier, `reset_${email}`));

  const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
  
  await logSecurityEvent({
    tabela: 'usuarios',
    acao: 'password_reset_success',
    usuarioId: user?.id
  });

  return { success: true };
}
