import { ModuleDefinition, CompositionResult, ResolvedPart, ValidationRule, EvaluationContext } from './types';
import { ParametricEvaluator } from './evaluator';

export class ParametricComposer {
  /**
   * Compõe um módulo final a partir de definições abstratas e medidas inseridas pelo usuário
   */
  compose(moduleDef: ModuleDefinition, inputs: Record<string, any>): CompositionResult {
    const evaluator = new ParametricEvaluator();

    // 1. Resolver Heranças e Parâmetros Base (L, H, P, Espessuras)
    const context = evaluator.resolveParameters(moduleDef.parameters, inputs);

    // 2. Avaliar Peças
    const resolvedParts: ResolvedPart[] = moduleDef.parts.map(part => {
      const width = Number(evaluator.evaluate(part.widthFormula));
      const length = Number(evaluator.evaluate(part.lengthFormula));
      const thickness = Number(evaluator.evaluate(part.thicknessFormula));
      const quantity = Number(evaluator.evaluate(part.quantityFormula));
      
      const x = Number(evaluator.evaluate(part.posXFormula));
      const y = Number(evaluator.evaluate(part.posYFormula));
      const z = Number(evaluator.evaluate(part.posZFormula));

      return {
        id: part.id,
        name: part.name,
        materialId: evaluator.evaluate(part.materialIdFormula),
        width,
        length,
        thickness,
        quantity,
        orientationVeio: Boolean(evaluator.evaluate(part.orientationVeioFormula)),
        boundingBox: { x, y, z, w: width, h: length, d: thickness } // w, h, d genéricos locais
      };
    }).filter(p => p.quantity > 0);

    // 3. Avaliar Ferragens
    const resolvedHardware = moduleDef.hardware.map(hw => ({
      id: hw.id,
      hardwareId: evaluator.evaluate(hw.hardwareIdFormula),
      quantity: Number(evaluator.evaluate(hw.quantityFormula))
    })).filter(h => h.quantity > 0);

    // 4. Avaliar Usinagens (CNC)
    const resolvedMachining = moduleDef.machining.map(mac => ({
      id: mac.id,
      partId: mac.partId,
      operationType: mac.operationType,
      x: Number(evaluator.evaluate(mac.xFormula)),
      y: Number(evaluator.evaluate(mac.yFormula)),
      z: Number(evaluator.evaluate(mac.zFormula)),
      diameter: mac.diameterFormula ? Number(evaluator.evaluate(mac.diameterFormula)) : undefined,
      depth: mac.depthFormula ? Number(evaluator.evaluate(mac.depthFormula)) : undefined,
    }));

    // 5. Avaliar Regras de Validação Estruturais e Limites
    const validationErrors: string[] = [];
    
    // Testes de fórmula de limites e estrutura
    for (const rule of moduleDef.validations) {
      if (rule.type === 'structural' || rule.type === 'geometric') {
        const hasError = evaluator.evaluate(rule.conditionFormula);
        if (hasError) {
          validationErrors.push(`[${rule.type.toUpperCase()}] ${rule.errorMessage}`);
        }
      }
    }

    // Validador Geométrico Nativo (Colisões)
    const collisions = this.detectCollisions(resolvedParts);
    if (collisions.length > 0) {
      validationErrors.push(...collisions);
    }

    return {
      moduleId: moduleDef.id,
      parameters: context,
      parts: resolvedParts,
      hardware: resolvedHardware,
      machining: resolvedMachining,
      validationErrors
    };
  }

  /**
   * O(n^2) Simple AABB Collision Detection para alertar de peças sobrepostas
   */
  private detectCollisions(parts: ResolvedPart[]): string[] {
    const errors: string[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const p1 = parts[i].boundingBox;
        const p2 = parts[j].boundingBox;

        const intersectX = p1.x < p2.x + p2.w && p1.x + p1.w > p2.x;
        const intersectY = p1.y < p2.y + p2.h && p1.y + p1.h > p2.y;
        const intersectZ = p1.z < p2.z + p2.d && p1.z + p1.d > p2.z;

        if (intersectX && intersectY && intersectZ) {
          errors.push(`[COLLISION] Conflito geométrico detectado entre a peça "${parts[i].name}" e "${parts[j].name}".`);
        }
      }
    }
    
    return errors;
  }
}
