import { db } from '@/db';
import { moveis } from '@/db/schema/moveis';
import { ambientes } from '@/db/schema/ambientes';
import { projetos } from '@/db/schema/projetos';
import { validacoes } from '@/db/schema/validacoes';
import { eq } from 'drizzle-orm';
import { validateDimensions, validateModuleTypeRatio, validateChapa } from './validators';
import { ModuleType, ValidationMessage } from './rules';

export interface ParsedModuleResult {
  movelId: string;
  projetoId: string;
  empresaId: string;
  nome: string;
  largura: number;
  altura: number;
  profundidade: number;
  tipo: ModuleType;
  validado: boolean;
  validations: ValidationMessage[];
}

/**
 * Carrega os dados de um móvel a partir do Neon PostgreSQL via Drizzle,
 * roda os motores de validação paramétrica e registra os erros/avisos na tabela 'validacoes'.
 */
export async function parseModule(movelId: string): Promise<ParsedModuleResult> {
  // 1. Buscar o móvel e seus relacionamentos (Ambiente e Projeto) em uma única query otimizada
  const result = await db
    .select({
      movel: moveis,
      ambiente: ambientes,
      projeto: projetos,
    })
    .from(moveis)
    .innerJoin(ambientes, eq(moveis.ambienteId, ambientes.id))
    .innerJoin(projetos, eq(ambientes.projetoId, projetos.id))
    .where(eq(moveis.id, movelId))
    .limit(1);

  if (result.length === 0) {
    throw new Error(`Móvel com ID ${movelId} não encontrado no banco de dados.`);
  }

  const { movel, projeto } = result[0];

  const largura = Number(movel.largura);
  const altura = Number(movel.altura);
  const profundidade = Number(movel.profundidade);
  const tipo = (movel.tipo?.toLowerCase() || 'outro') as ModuleType;

  // Inferir espessura padrão de 18mm, caso não conste nos parâmetros iniciais
  let espessura = 18;
  if (movel.parametrosIniciais && typeof movel.parametrosIniciais === 'object') {
    const params = movel.parametrosIniciais as Record<string, any>;
    if (typeof params.espessura === 'number') {
      espessura = params.espessura;
    }
  }

  // 2. Executar as validações geométricas e construtivas
  const validations: ValidationMessage[] = [];
  
  validations.push(...validateDimensions(largura, altura, profundidade));
  validations.push(...validateModuleTypeRatio(tipo, largura, altura, profundidade));
  validations.push(...validateChapa(espessura));

  // Um móvel só é considerado "validado" se NÃO houver nenhum erro impeditivo (level = 'error')
  const temErros = validations.some((v) => v.level === 'error');
  const statusValidacao = temErros ? 'falhou' : validations.length > 0 ? 'alerta' : 'passou';
  const validado = !temErros;

  // 3. Persistir as validações no banco de dados na tabela 'validacoes'
  // Deletar as validações existentes para este móvel antes de reinserir
  await db.delete(validacoes).where(eq(validacoes.movelId, movelId));

  // Se houver algum relatório (erros, avisos ou informações), insere o registro agregado
  if (validations.length > 0) {
    await db.insert(validacoes).values({
      projetoId: projeto.id,
      movelId: movelId,
      tipoValidacao: 'dimensional_estrutural',
      status: statusValidacao,
      detalhes: {
        validations,
        validado,
        metadata: {
          largura,
          altura,
          profundidade,
          tipo,
          espessura,
          verificadoEm: new Date().toISOString(),
        },
      },
    });
  }

  return {
    movelId,
    projetoId: projeto.id,
    empresaId: projeto.empresaId,
    nome: movel.nome,
    largura,
    altura,
    profundidade,
    tipo,
    validado,
    validations,
  };
}
