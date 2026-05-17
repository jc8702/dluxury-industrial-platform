import { ParamDefinition, EvaluationContext } from './types';

/**
 * Avaliador paramétrico de expressões baseado no Function Constructor seguro
 * Transforma fórmulas em texto ("L - (E * 2)") em código Javascript com escopo controlado.
 */
export class ParametricEvaluator {
  private context: EvaluationContext;

  constructor(initialContext: EvaluationContext = {}) {
    this.context = { ...initialContext };
  }

  setParam(key: string, value: any) {
    this.context[key] = value;
  }

  getContext() {
    return this.context;
  }

  /**
   * Avalia uma string matemática ou lógica baseado no contexto.
   */
  evaluate(formula: string): any {
    if (!formula) return null;
    
    // Substitui chaves diretas para facilitar ex: {LARGURA} -> LARGURA
    // Para um sistema Enterprise real, utiliza-se AST com Math.js ou Chevrotain
    // Para nossa engine, vamos injetar as variáveis como escopo no Function
    const keys = Object.keys(this.context);
    const values = Object.values(this.context);

    try {
      const func = new Function(...keys, `return (${formula});`);
      return func(...values);
    } catch (err) {
      throw new Error(`Erro ao avaliar fórmula: "${formula}". Variáveis contextuais ausentes ou sintaxe incorreta. Detalhe: ${(err as Error).message}`);
    }
  }

  /**
   * Resolve uma árvore de parâmetros ordenando por dependência,
   * permitindo que parâmetros sejam calculados baseados em outros.
   */
  resolveParameters(params: ParamDefinition[], inputs: Record<string, any>): Record<string, any> {
    const resolved: Record<string, boolean> = {};
    const pending = [...params];
    
    // Injeta inputs definidos pelo usuário (override)
    for (const [key, val] of Object.entries(inputs)) {
      this.setParam(key, val);
      resolved[key] = true;
    }

    let iterations = 0;
    while (pending.length > 0 && iterations < 100) {
      let madeProgress = false;

      for (let i = pending.length - 1; i >= 0; i--) {
        const p = pending[i];
        
        // Se já foi sobrescrito pelo input, ignora
        if (resolved[p.id]) {
          pending.splice(i, 1);
          madeProgress = true;
          continue;
        }

        // Tenta avaliar se tiver fórmula
        if (p.formula) {
          try {
            const val = this.evaluate(p.formula);
            this.setParam(p.id, val);
            resolved[p.id] = true;
            pending.splice(i, 1);
            madeProgress = true;
          } catch (e) {
            // Pode estar falhando por dependência não resolvida, continua tentando no próximo ciclo
          }
        } else {
          // Sem fórmula, usa defaultValue
          this.setParam(p.id, p.defaultValue);
          resolved[p.id] = true;
          pending.splice(i, 1);
          madeProgress = true;
        }
      }

      if (!madeProgress) {
        throw new Error('Ciclo de dependência detectado ou variável faltando nos parâmetros.');
      }
      iterations++;
    }

    return this.getContext();
  }
}
