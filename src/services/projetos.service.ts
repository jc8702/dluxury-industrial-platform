import { ProjetosRepository } from '@/repositories/projetos.repository';
import { CreateProjetoData } from '@/lib/api/dtos';

const repository = new ProjetosRepository();

export class ProjetosService {
  
  /**
   * Obtém a lista de projetos e formata para o DTO de Resposta (Isolamento do schema do banco)
   */
  async listarProjetos(empresaId: string) {
    const data = await repository.findAll(empresaId);
    
    // Mapeamento para DTO (Ocultar metadados internos ou colunas raw)
    return data.map(p => ({
      id: p.id,
      empresaId: p.empresaId,
      clienteId: p.clienteId,
      nome: p.nome,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      valorTotal: p.valorTotal ? Number(p.valorTotal) : null
    }));
  }

  async criarProjeto(data: CreateProjetoData, empresaId: string, userId: string) {
    // Regras de negócio podem entrar aqui (ex: validar limite de projetos no plano SaaS)
    const projetoCriado = await repository.create(data, empresaId, userId);
    
    return {
      id: projetoCriado.id,
      nome: projetoCriado.nome,
      status: projetoCriado.status,
      createdAt: projetoCriado.createdAt.toISOString(),
    };
  }
}
