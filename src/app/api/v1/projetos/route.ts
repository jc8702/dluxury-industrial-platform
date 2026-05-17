import { NextRequest, NextResponse } from 'next/server';
import { withEnterpriseMiddleware } from '@/lib/api/middlewares';
import { ProjetosService } from '@/services/projetos.service';
import { CreateProjetoDto } from '@/lib/api/dtos';

const projetosService = new ProjetosService();

// GET /api/v1/projetos
export const GET = withEnterpriseMiddleware('projetos:read', async (req, ctx, session) => {
  const empresaId = session.user.empresaId;
  const projetos = await projetosService.listarProjetos(empresaId);
  
  return NextResponse.json({ data: projetos });
});

// POST /api/v1/projetos
export const POST = withEnterpriseMiddleware('projetos:write', async (req, ctx, session) => {
  const empresaId = session.user.empresaId;
  const body = await req.json();

  // Validação Zod DTO
  const validation = CreateProjetoDto.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
  }

  const novoProjeto = await projetosService.criarProjeto(validation.data, empresaId, session.user.id);
  
  return NextResponse.json({ data: novoProjeto }, { status: 201 });
});
