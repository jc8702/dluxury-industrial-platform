import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { moveis } from '@/db/schema/moveis';
import { eq } from 'drizzle-orm';
import { parseModule } from '@/lib/engine/parser';
import { runEngineCalculationForModule } from '@/lib/engine/calculator';
import { optimizeEnvironmentPieces } from '@/lib/engine/optimizer';

/**
 * POST /api/ambientes/[id]/calculate
 * Processa a validação, o cálculo de peças paramétricas e a otimização
 * de adjacências de TODOS os móveis pertencentes a um ambiente.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar autenticação
    const session = await auth();
    
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    const { id: ambienteId } = await params;

    if (!ambienteId) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro ID do ambiente é obrigatório.' },
        { status: 400 }
      );
    }

    // 2. Buscar os móveis deste ambiente
    const listMoveis = await db
      .select()
      .from(moveis)
      .where(eq(moveis.ambienteId, ambienteId));

    if (listMoveis.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum móvel cadastrado neste ambiente para cálculo.',
        data: {
          calculados: 0,
          pulados: 0,
          detalhes: [],
        },
      });
    }

    let calculados = 0;
    let pulados = 0;
    const detalhes: any[] = [];

    // 3. Loop de validação e cálculo individual
    for (const movel of listMoveis) {
      const parsed = await parseModule(movel.id);

      if (!parsed.validado) {
        pulados++;
        detalhes.push({
          movelId: movel.id,
          nome: movel.nome,
          status: 'erro_estrutural',
          validations: parsed.validations,
        });
        continue;
      }

      const pecasCriadas = await runEngineCalculationForModule(movel.id, parsed);
      calculados++;
      detalhes.push({
        movelId: movel.id,
        nome: movel.nome,
        status: 'calculado',
        pecasCalculadas: pecasCriadas,
      });
    }

    // 4. Disparar a otimização geométrica do ambiente (fusão de laterais comuns)
    let otimizacao = { totalPecasOriginais: 0, totalPecasOtimizadas: 0, fusõesEfetuadas: 0 };
    if (calculados >= 2) {
      otimizacao = await optimizeEnvironmentPieces(ambienteId);
    }

    return NextResponse.json({
      success: true,
      data: {
        ambienteId,
        móveisTotais: listMoveis.length,
        calculados,
        pulados,
        detalhes,
        otimizacao,
      },
    });
  } catch (error: any) {
    console.error('Erro no cálculo do ambiente:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
