'use server';

import { ParametricComposer } from '@/lib/parametric/composer';
import { BalcaoInferior } from '@/lib/parametric/modules/balcao';
import { requirePermission } from '@/lib/auth/roles';
import { db } from '@/db';
import { moveis, pecas } from '@/db/schema/index';

// Dicionário de módulos para simular carregamento dinâmico do BD ou de arquivos JSON.
const ModuleRegistry: Record<string, any> = {
  balcao_inferior_padrao: BalcaoInferior,
  // aereo_padrao: AereoPadrao, etc...
};

export async function processParametricModule(
  moduleId: string, 
  userInputs: Record<string, any>,
  projetoId: string,
  ambienteId: string,
  userRole?: string
) {
  // 1. Controle de Acesso (Engenharia ou Comercial)
  requirePermission(userRole, 'projetos:write');

  // 2. Carregar o template do módulo (que não tem lógica hardcoded)
  const moduleDef = ModuleRegistry[moduleId];
  if (!moduleDef) {
    throw new Error(`Módulo paramétrico [${moduleId}] não encontrado no sistema.`);
  }

  // 3. Processar Motor Paramétrico (Composer + Evaluator + Validators)
  const composer = new ParametricComposer();
  const compositionResult = composer.compose(moduleDef, userInputs);

  if (compositionResult.validationErrors.length > 0) {
    return {
      success: false,
      errors: compositionResult.validationErrors,
      data: compositionResult
    };
  }

  // 4. (Opcional no fluxo real) Persistir os cálculos brutos no banco usando Drizzle
  try {
    // Insere Movel
    const [insertedMovel] = await db.insert(moveis).values({
      ambienteId,
      nome: moduleDef.name,
      tipo: 'parametrico',
      largura: compositionResult.parameters['L'],
      altura: compositionResult.parameters['A'],
      profundidade: compositionResult.parameters['P'],
      parametrosIniciais: compositionResult.parameters,
    }).returning();

    // Persiste a lista de Peças baseadas no cálculo em Batch
    if (compositionResult.parts.length > 0) {
      await db.insert(pecas).values(
        compositionResult.parts.map(p => ({
          movelId: insertedMovel.id,
          nome: p.name,
          comprimento: p.length.toString(),
          largura: p.width.toString(),
          espessura: p.thickness.toString(),
          quantidade: p.quantity.toString(),
          orientacaoVeio: p.orientationVeio,
          materialId: '00000000-0000-0000-0000-000000000000', // Fake UUID do Material resolvido
        }))
      );
    }
    
    return {
      success: true,
      message: 'Módulo processado, calculado e inserido no projeto com sucesso.',
      data: compositionResult
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: 'Erro crítico ao gravar as peças estruturais no banco.'
    };
  }
}
