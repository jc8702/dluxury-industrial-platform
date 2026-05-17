import { SketchupModuleData, ExplodedPart } from './types';

/**
 * Motor de Avaliação Dinâmica (Sem hardcode).
 * Transforma formulas matemáticas escritas em JSON de regras ou atributos 
 * em valores reais computados.
 */
export class FormulaEvaluator {
  private context: Record<string, number>;

  constructor(moduleData: SketchupModuleData) {
    // Inicializa o contexto matemático com as dimensões brutas e atributos do SketchUp
    this.context = {
      W: moduleData.dimensions.width,
      H: moduleData.dimensions.height,
      D: moduleData.dimensions.depth,
      ...this.parseNumericAttributes(moduleData.dynamic_attributes)
    };
  }

  private parseNumericAttributes(attrs: Record<string, any>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(attrs)) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[key] = num;
    }
    return result;
  }

  /**
   * Avalia uma fórmula matemática simples ex: "W - (Espessura * 2)"
   */
  public evaluate(formula: string | number): number {
    if (typeof formula === 'number') return formula;

    let expr = formula.toUpperCase();
    
    // Substitui variáveis do contexto
    for (const [key, value] of Object.entries(this.context)) {
      const regex = new RegExp(`\\b${key.toUpperCase()}\\b`, 'g');
      expr = expr.replace(regex, value.toString());
    }

    try {
      // Uso controlado de Function para avaliação matemática isolada 
      // (Não usar eval puro por segurança, permitimos apenas math).
      // Regex garante que apenas caracteres matemáticos e numerais entraram
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        throw new Error(`Formula contains invalid characters: ${expr}`);
      }
      return Number(new Function(`return ${expr}`)());
    } catch (e) {
      console.error(`Erro ao avaliar fórmula [${formula}]:`, e);
      return 0; // Fallback seguro
    }
  }

  public getContext() {
    return this.context;
  }
}
