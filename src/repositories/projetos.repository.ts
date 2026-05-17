import { db } from '@/db';
import { projetos } from '@/db/schema/projetos';
import { eq, and, desc } from 'drizzle-orm';
import { CreateProjetoData } from '@/lib/api/dtos';

export class ProjetosRepository {
  
  async findAll(empresaId: string, limit = 50) {
    return await db.select()
      .from(projetos)
      .where(eq(projetos.empresaId, empresaId))
      .orderBy(desc(projetos.createdAt))
      .limit(limit);
  }

  async findById(id: string, empresaId: string) {
    const [projeto] = await db.select()
      .from(projetos)
      .where(and(eq(projetos.id, id), eq(projetos.empresaId, empresaId)));
    return projeto;
  }

  async create(data: CreateProjetoData, empresaId: string, createdBy: string) {
    const [novoProjeto] = await db.insert(projetos).values({
      empresaId,
      clienteId: data.clienteId,
      nome: data.nome,
      valorTotal: data.valorTotal ? data.valorTotal.toString() : undefined,
      notas: data.notas,
      status: 'orcamento',
      createdBy,
    }).returning();
    return novoProjeto;
  }
}
