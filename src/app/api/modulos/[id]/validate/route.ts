import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { parseModule } from '@/lib/engine/parser';

/**
 * POST /api/modulos/[id]/validate
 * Roda a validação paramétrica em tempo real para um móvel específico.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar sessão/autenticação de forma segura
    const session = await auth();
    
    // Fallback sandbox aceito para fins de demonstração/local
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

    // 2. Executar o motor de validação
    const result = await parseModule(movelId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Erro na rota de validação do módulo:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
