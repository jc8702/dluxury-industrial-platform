import { db } from '@/db';
import { moveis } from '@/db/schema/moveis';
import { eq, asc } from 'drizzle-orm';

export interface AdjacencyRelation {
  movelId1: string;
  movelId2: string;
  distancia: number;
}

export interface ModuleCompositionResult {
  ambienteId: string;
  layout: 'horizontal' | 'independente';
  sharedLaterals: AdjacencyRelation[];
}

/**
 * Analisa as posições e dimensões físicas dos móveis de um ambiente para detectar adjacências laterais (módulos lado a lado).
 * Tolerância física padrão: até 5mm.
 */
export async function detectModuleComposition(ambienteId: string): Promise<ModuleCompositionResult> {
  // 1. Buscar todos os móveis do ambiente
  const listMoveis = await db
    .select()
    .from(moveis)
    .where(eq(moveis.ambienteId, ambienteId));

  if (listMoveis.length < 2) {
    return {
      ambienteId,
      layout: 'independente',
      sharedLaterals: [],
    };
  }

  // 2. Mapear móveis com suas coordenadas e dimensões numéricas
  const positionedMoveis = listMoveis
    .map((m) => {
      // Tenta obter as posições a partir dos parâmetros construtivos ou iniciais salvos
      let posX = 0;
      let posY = 0;
      
      if (m.parametrosIniciais && typeof m.parametrosIniciais === 'object') {
        const params = m.parametrosIniciais as Record<string, any>;
        if (typeof params.posicaoX === 'number' || typeof params.posicaoX === 'string') {
          posX = Number(params.posicaoX) || 0;
        }
        if (typeof params.posicaoY === 'number' || typeof params.posicaoY === 'string') {
          posY = Number(params.posicaoY) || 0;
        }
      }

      return {
        id: m.id,
        nome: m.nome,
        largura: Number(m.largura),
        altura: Number(m.altura),
        profundidade: Number(m.profundidade),
        posX,
        posY,
      };
    })
    // Ordenar horizontalmente (eixo X)
    .sort((a, b) => a.posX - b.posX);

  const sharedLaterals: AdjacencyRelation[] = [];
  const TOLERANCIA = 5; // em milímetros

  // 3. Algoritmo de varredura de adjacência horizontal
  for (let i = 0; i < positionedMoveis.length - 1; i++) {
    const m1 = positionedMoveis[i];
    const m2 = positionedMoveis[i + 1];

    // O fim físico de M1 é posX1 + largura1
    const fimM1 = m1.posX + m1.largura;
    // O início de M2 é posX2
    const inicioM2 = m2.posX;

    const distancia = Math.abs(inicioM2 - fimM1);

    // Se a distância horizontal for menor que a tolerância e eles estiverem na mesma altura ergonômica (eixo Y similar)
    const mesmaAltura = Math.abs(m1.posY - m2.posY) < 50; // tolerância vertical maior para alinhamento geral

    if (distancia <= TOLERANCIA && mesmaAltura) {
      sharedLaterals.push({
        movelId1: m1.id,
        movelId2: m2.id,
        distancia,
      });
    }
  }

  return {
    ambienteId,
    layout: sharedLaterals.length > 0 ? 'horizontal' : 'independente',
    sharedLaterals,
  };
}
