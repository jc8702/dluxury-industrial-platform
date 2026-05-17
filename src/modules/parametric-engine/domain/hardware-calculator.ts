import { SketchupModuleData, HardwareSpec, MachiningOp } from './types';
import { FormulaEvaluator } from './formula-evaluator';

/**
 * Calculador Dinâmico de Ferragens baseado em peso/área e regras sistêmicas.
 */
export class HardwareCalculator {
  
  /**
   * Identifica quantidade de dobradiças, minifix, cavilhas dinamicamente 
   * sem switch/cases rígidos.
   */
  public static calculate(moduleData: SketchupModuleData, evaluator: FormulaEvaluator): { hardware: HardwareSpec[], machinings: MachiningOp[] } {
    const hardware: HardwareSpec[] = [];
    const machinings: MachiningOp[] = [];
    
    const context = evaluator.getContext();
    const altura = context['H'] || 0;

    // Regras Genéricas parametrizadas (Isso viria do Banco de Dados no SaaS real, injetado aqui)
    // Para simplificação de implementação, usaremos constante injetável
    const regrasDobradicas = {
      pesoMaxPorDobradica: 5,
      distanciaBase: 100,
    };

    if (moduleData.name.toLowerCase().includes('porta') || moduleData.dynamic_attributes['tipo'] === 'porta') {
      // Calcula volume e peso estimado (Densidade média MDF = 700kg/m3)
      const volumeM3 = (context['W'] * context['H'] * context['ESPESSURA_CHAPA'] || 15) / 1000000000;
      const pesoKg = volumeM3 * 700;
      
      // Cálculo de quantidade de dobradiças via física
      const qtdDobradicas = Math.max(2, Math.ceil(pesoKg / regrasDobradicas.pesoMaxPorDobradica));
      hardware.push({ codigo: 'DOB-35MM-RETA', quantidade: qtdDobradicas });

      // Geração de Usinagens Dinâmicas baseada na quantidade
      const espacoUtil = altura - (regrasDobradicas.distanciaBase * 2);
      const intervalo = qtdDobradicas > 2 ? espacoUtil / (qtdDobradicas - 1) : espacoUtil;

      for (let i = 0; i < qtdDobradicas; i++) {
        machinings.push({
          tipo: 'furo_dobradica',
          face: 'fundo',
          x: 22.5, // Padrão Caneco
          y: regrasDobradicas.distanciaBase + (i * intervalo),
          z: 0,
          profundidade: 12.5,
          diametroBroca: 35
        });
      }
    }

    // Regra Dinâmica para Gavetas
    const gavetasAttr = context['NUM_GAVETAS'];
    if (gavetasAttr && gavetasAttr > 0) {
      hardware.push({ codigo: 'CORREDICA-TELESCOPICA-500', quantidade: gavetasAttr });
    }

    return { hardware, machinings };
  }
}
