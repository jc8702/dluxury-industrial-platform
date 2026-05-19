import { tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { projetos, ambientes, moveis, pecas, clientes, materiais } from '@/db/schema';
import { eq, and, ilike } from 'drizzle-orm';

/**
 * Cria a coleção de ferramentas de IA protegidas e restritas ao inquilino (tenant) logado.
 * Garante que a IA só acesse dados pertencentes à empresa correspondente ao empresaId.
 * 
 * @param empresaId ID do tenant ativo para segurança multi-tenant absoluta
 */
export function createAiTools(empresaId: string) {
  return {
    get_projeto: tool({
      description: 'Busca as informações detalhadas e metadados de um projeto da marcenaria pelo nome aproximado.',
      parameters: z.object({
        nome: z.string().describe('Nome ou termo aproximado do projeto a ser pesquisado'),
      }),
      execute: async ({ nome }) => {
        try {
          console.log(`[AI Tool] Buscando projeto por nome: "${nome}" para o tenant: ${empresaId}`);
          
          const results = await db
            .select({
              id: projetos.id,
              nome: projetos.nome,
              status: projetos.status,
              valorTotal: projetos.valorTotal,
              dataEntrega: projetos.dataEntrega,
              notas: projetos.notas,
              clienteNome: clientes.nome,
            })
            .from(projetos)
            .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
            .where(
              and(
                eq(projetos.empresaId, empresaId),
                ilike(projetos.nome, `%${nome}%`)
              )
            )
            .limit(3);

          if (results.length === 0) {
            return {
              success: false,
              message: `Nenhum projeto encontrado com o termo "${nome}" para a sua empresa.`
            };
          }

          return {
            success: true,
            projetos: results.map((p) => ({
              id: p.id,
              nome: p.nome,
              status: p.status === 'orcamento' ? 'Orçamento' : p.status === 'aprovado' ? 'Aprovado' : p.status === 'producao' ? 'Em Produção' : 'Finalizado',
              valorTotal: p.valorTotal ? `R$ ${Number(p.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não definido',
              dataEntrega: p.dataEntrega ? p.dataEntrega.toLocaleDateString('pt-BR') : 'Não agendada',
              notas: p.notas || 'Sem observações',
              cliente: p.clienteNome,
            }))
          };
        } catch (error: any) {
          console.error('[AI Tool] Erro na ferramenta get_projeto:', error);
          return { success: false, error: error.message || 'Erro ao buscar projetos.' };
        }
      }
    }),

    get_modulos: tool({
      description: 'Lista todos os módulos de móveis de um projeto específico organizados pelos ambientes.',
      parameters: z.object({
        projetoId: z.string().uuid().describe('ID único UUID do projeto'),
      }),
      execute: async ({ projetoId }) => {
        try {
          console.log(`[AI Tool] Buscando módulos do projeto: ${projetoId} no tenant: ${empresaId}`);

          // 1. Buscar ambientes do projeto
          const projetoAmbientes = await db
            .select({
              id: ambientes.id,
              nome: ambientes.nome,
            })
            .from(ambientes)
            .innerJoin(projetos, eq(ambientes.projetoId, projetos.id))
            .where(
              and(
                eq(projetos.empresaId, empresaId),
                eq(ambientes.projetoId, projetoId)
              )
            );

          if (projetoAmbientes.length === 0) {
            return {
              success: false,
              message: 'Nenhum ambiente ou módulo encontrado para este projeto.'
            };
          }

          const responseData = [];

          // 2. Buscar móveis de cada ambiente
          for (const amb of projetoAmbientes) {
            const moveisAmbiente = await db
              .select({
                id: moveis.id,
                nome: moveis.nome,
                tipo: moveis.tipo,
                largura: moveis.largura,
                altura: moveis.altura,
                profundidade: moveis.profundidade,
              })
              .from(moveis)
              .innerJoin(ambientes, eq(moveis.ambienteId, ambientes.id))
              .innerJoin(projetos, eq(ambientes.projetoId, projetos.id))
              .where(
                and(
                  eq(projetos.empresaId, empresaId),
                  eq(moveis.ambienteId, amb.id)
                )
              );

            responseData.push({
              ambiente: amb.nome,
              modulos: moveisAmbiente.map((m) => ({
                id: m.id,
                nome: m.nome,
                tipo: m.tipo || 'Padrão',
                dimensoes: `${Number(m.largura)}x${Number(m.altura)}x${Number(m.profundidade)} mm (LxAxP)`,
              }))
            });
          }

          return {
            success: true,
            ambientes: responseData
          };
        } catch (error: any) {
          console.error('[AI Tool] Erro na ferramenta get_modulos:', error);
          return { success: false, error: error.message || 'Erro ao buscar módulos.' };
        }
      }
    }),

    get_pecas: tool({
      description: 'Busca a lista de peças estruturais, dimensões exatas e materiais de um módulo/móvel específico.',
      parameters: z.object({
        moduloId: z.string().uuid().describe('ID único UUID do móvel/módulo'),
      }),
      execute: async ({ moduloId }) => {
        try {
          console.log(`[AI Tool] Buscando peças do módulo: ${moduloId} no tenant: ${empresaId}`);

          const results = await db
            .select({
              id: pecas.id,
              nome: pecas.nome,
              comprimento: pecas.comprimento,
              largura: pecas.largura,
              espessura: pecas.espessura,
              quantidade: pecas.quantidade,
              materialNome: materiais.nome,
            })
            .from(pecas)
            .innerJoin(materiais, eq(pecas.materialId, materiais.id))
            .innerJoin(moveis, eq(pecas.movelId, moveis.id))
            .innerJoin(ambientes, eq(moveis.ambienteId, ambientes.id))
            .innerJoin(projetos, eq(ambientes.projetoId, projetos.id))
            .where(
              and(
                eq(projetos.empresaId, empresaId),
                eq(pecas.movelId, moduloId)
              )
            );

          if (results.length === 0) {
            return {
              success: false,
              message: 'Nenhuma peça cadastrada para este módulo.'
            };
          }

          return {
            success: true,
            totalPecas: results.length,
            pecas: results.map((p) => ({
              id: p.id,
              nome: p.nome,
              quantidade: Number(p.quantidade),
              dimensoes: `${Number(p.comprimento)}x${Number(p.largura)}x${Number(p.espessura)} mm`,
              material: p.materialNome,
            }))
          };
        } catch (error: any) {
          console.error('[AI Tool] Erro na ferramenta get_pecas:', error);
          return { success: false, error: error.message || 'Erro ao listar peças.' };
        }
      }
    })
  };
}
