import { db } from '@/db';
import { auditoria } from '@/db/schema/auditoria';

interface SecurityEventParams {
  tabela: string;
  acao: string;
  usuarioId?: string | null;
  dadosAntigos?: any;
  dadosNovos?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Registra eventos de segurança e acessos críticos no log de auditoria.
 */
export async function logSecurityEvent({
  tabela,
  acao,
  usuarioId,
  dadosAntigos,
  dadosNovos,
  ipAddress,
  userAgent,
}: SecurityEventParams) {
  try {
    await db.insert(auditoria).values({
      tabela,
      acao,
      usuarioId: usuarioId || undefined,
      registroId: usuarioId || '00000000-0000-0000-0000-000000000000', // Padrão se não houver um registro alvo
      dadosAntigos,
      dadosNovos,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Falha ao registrar log de segurança:', error);
    // Não estouramos o erro para não travar o fluxo principal (ex: login falhando se o log falhar)
  }
}
