import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { parseModule } from '@/lib/engine/parser';
import { runEngineCalculationForModule } from '@/lib/engine/calculator';

/**
 * POST /api/modulos/[id]/calculate
 * Dispara o cálculo paramétrico de peças para um móvel validado.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar sessão/autenticação
    const session = await auth();
    
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    const { id: movelId } = await params;

    if (!movelId) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro ID do móvel é obrigatório.' },
        { status: 400 }
      );
    }

    // 2. Roda a validação estrutural e geométrica antes de prosseguir com o cálculo
    const parsed = await parseModule(movelId);

    // Regra rígida do Roadmap: Não permitir cálculo de peças se o módulo tiver erros graves (validado = false)
    if (!parsed.validado) {
      return NextResponse.json(
        {
          success: false,
          error: 'Não é possível calcular as peças deste móvel porque ele possui erros estruturais/geométricos graves de engenharia.',
          validations: parsed.validations,
        },
        { status: 400 }
      );
    }

    // 3. Executar cálculo de peças paramétricas e persistir no Neon PostgreSQL
    const pecasCalculadas = await runEngineCalculationForModule(movelId, parsed);

    return NextResponse.json({
      success: true,
      data: {
        movelId,
        nome: parsed.nome,
        largura: parsed.largura,
        altura: parsed.altura,
        profundidade: parsed.profundidade,
        tipo: parsed.tipo,
        pecasCalculadas,
      },
    });
  } catch (error: any) {
    console.error('Erro na rota de cálculo de peças do módulo:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
