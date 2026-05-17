import { SketchupModuleData, ExplodedPart, HardwareSpec, MachiningOp } from '../domain/types';
import { FormulaEvaluator } from '../domain/formula-evaluator';
import { HardwareCalculator } from '../domain/hardware-calculator';
import { StructuralValidator } from './validators/structural-validator';

export class ParametricProcessor {
  private partsBOM: ExplodedPart[] = [];
  private hardwareBOM: HardwareSpec[] = [];
  private machiningsBOM: MachiningOp[] = [];
  private errors: string[] = [];

  constructor(private payload: { modules: SketchupModuleData[] }) {}

  public process() {
    const validator = new StructuralValidator();

    for (const mod of this.payload.modules) {
      // 1. Validação Estrutural Inicial
      const structErrors = validator.validate(mod);
      if (structErrors.length > 0) {
        this.errors.push(...structErrors);
      }

      // 2. Explosão de Peças, Ferragens e Usinagem (Recursivo)
      this.explodeModule(mod);
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      bom: {
        parts: this.partsBOM,
        hardware: this.hardwareBOM,
        machinings: this.machiningsBOM
      }
    };
  }

  private explodeModule(mod: SketchupModuleData) {
    const evaluator = new FormulaEvaluator(mod);
    
    // Calcula peças via engine. (Base, Lateral, etc)
    // Para módulos, o SketchUp as vezes envia os 'children' já como peças explícitas (Painéis).
    // Se não tiver filhos explícitos, nós derivamos do volume e formulas:
    if (!mod.children || mod.children.length === 0) {
      this.partsBOM.push({
        nome: mod.name,
        comprimento: evaluator.evaluate('W'),
        largura: evaluator.evaluate('H'), // Orientação de Veio na Seccionadora dita W x H
        espessura: evaluator.evaluate('ESPESSURA_CHAPA') || 15,
        material: mod.material,
        quantidade: 1
      });
    }

    // Calcula Ferragens e Usinagem do Módulo/Peça atual
    const { hardware, machinings } = HardwareCalculator.calculate(mod, evaluator);
    this.hardwareBOM.push(...hardware);
    this.machiningsBOM.push(...machinings);

    // Recursividade para Gaveteiros, Aéreos, Portas aninhadas
    if (mod.children) {
      for (const child of mod.children) {
        this.explodeModule(child);
      }
    }
  }
}
