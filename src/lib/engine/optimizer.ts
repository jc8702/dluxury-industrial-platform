import { db } from '@/db';
import { pecas } from '@/db/schema/pecas';
import { eq, and, inArray } from 'drizzle-orm';
import { detectModuleComposition } from './composition';

/**
 * Executa a otimização de plano de peças por ambiente fundindo laterais adjacentes redundantes.
 */
export async function optimizeEnvironmentPieces(ambienteId: string): Promise<{ totalPecasOriginais: number; totalPecasOtimizadas: number; fusõesEfetuadas: number }> {
  // 1. Detectar as composições e adjacências espaciais dos móveis no ambiente
  const composition = await detectModuleComposition(ambienteId);

  // Buscar todas as peças das tabelas associadas aos móveis deste ambiente
  // Primeiro, buscamos os móveis do ambiente
  const listMoveis = await db
    .query
    .moveis
    .findMany({
      where: (moveis, { eq }) => eq(moveis.ambienteId, ambienteId),
    });

  if (listMoveis.length === 0) {
    return { totalPecasOriginais: 0, totalPecasOtimizadas: 0, fusõesEfetuadas: 0 };
  }

  const movelIds = listMoveis.map((m) => m.id);

  // Buscar todas as peças desses móveis
  const listPecas = await db
    .select()
    .from(pecas)
    .where(inArray(pecas.movelId, movelIds));

  const totalPecasOriginais = listPecas.reduce((acc, p) => acc + Number(p.quantidade), 0);
  let fusõesEfetuadas = 0;

  // Se houver adjacências laterais horizontais, realizamos a fusão das laterais comuns
  if (composition.layout === 'horizontal' && composition.sharedLaterals.length > 0) {
    for (const rel of composition.sharedLaterals) {
      // Procuramos a lateral direita do móvel 1 e a lateral esquerda do móvel 2
      const lateralDirM1 = listPecas.find(
        (p) => p.movelId === rel.movelId1 && p.nome.toLowerCase().includes('lateral direita')
      );
      const lateralEsqM2 = listPecas.find(
        (p) => p.movelId === rel.movelId2 && p.nome.toLowerCase().includes('lateral esquerda')
      );

      if (lateralDirM1 && lateralEsqM2) {
        // Efetuamos a fusão: Atualizamos o nome da lateral de M1 para "Lateral Central Compartilhada"
        // E deletamos a lateral redundante de M2 do banco de dados!
        await db
          .update(pecas)
          .set({
            nome: 'Lateral Central Compartilhada (Otimizada)',
          })
          .where(eq(pecas.id, lateralDirM1.id));

        await db
          .delete(pecas)
          .where(eq(pecas.id, lateralEsqM2.id));

        fusõesEfetuadas++;
      }
    }
  }

  // Recalcular quantidade atual de peças no banco após a otimização
  const updatedPecas = await db
    .select()
    .from(pecas)
    .where(inArray(pecas.movelId, movelIds));

  const totalPecasOtimizadas = updatedPecas.reduce((acc, p) => acc + Number(p.quantidade), 0);

  return {
    totalPecasOriginais,
    totalPecasOtimizadas,
    fusõesEfetuadas,
  };
}
