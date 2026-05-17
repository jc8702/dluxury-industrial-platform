import { ModuleDefinition } from '../types';

/**
 * Definição Paramétrica do Balcão Inferior (2 Portas)
 * NENHUMA medida é hardcoded. Tudo é calculado com base nas fórmulas.
 */
export const BalcaoInferior: ModuleDefinition = {
  id: 'balcao_inferior_padrao',
  name: 'Balcão Inferior 2 Portas',
  type: 'balcao',
  parameters: [
    { id: 'L', type: 'number', defaultValue: 800, description: 'Largura Total' },
    { id: 'A', type: 'number', defaultValue: 700, description: 'Altura Total' },
    { id: 'P', type: 'number', defaultValue: 550, description: 'Profundidade Total' },
    { id: 'EspessuraCaixa', type: 'number', defaultValue: 18, description: 'Espessura MDF Caixa' },
    { id: 'EspessuraFundo', type: 'number', defaultValue: 6, description: 'Espessura MDF Fundo' },
    { id: 'RecuoFundo', type: 'number', defaultValue: 15, description: 'Recuo do Fundo' },
    { id: 'FolgaPorta', type: 'number', defaultValue: 3, description: 'Folga Frontal das Portas' }
  ],
  parts: [
    // Laterais
    {
      id: 'lateral_esq',
      name: 'Lateral Esquerda',
      materialIdFormula: '"mdf_caixa"',
      widthFormula: 'P',
      lengthFormula: 'A',
      thicknessFormula: 'EspessuraCaixa',
      quantityFormula: '1',
      orientationVeioFormula: 'true',
      posXFormula: '0',
      posYFormula: '0',
      posZFormula: '0'
    },
    {
      id: 'lateral_dir',
      name: 'Lateral Direita',
      materialIdFormula: '"mdf_caixa"',
      widthFormula: 'P',
      lengthFormula: 'A',
      thicknessFormula: 'EspessuraCaixa',
      quantityFormula: '1',
      orientationVeioFormula: 'true',
      posXFormula: 'L - EspessuraCaixa',
      posYFormula: '0',
      posZFormula: '0'
    },
    // Base Inferior (Entre Laterais)
    {
      id: 'base_inf',
      name: 'Base Inferior',
      materialIdFormula: '"mdf_caixa"',
      widthFormula: 'P',
      lengthFormula: 'L - (EspessuraCaixa * 2)',
      thicknessFormula: 'EspessuraCaixa',
      quantityFormula: '1',
      orientationVeioFormula: 'true',
      posXFormula: 'EspessuraCaixa',
      posYFormula: 'EspessuraCaixa', // Assume Y as height offset, so sitting on base plinth or bottom
      posZFormula: '0'
    },
    // Fundo
    {
      id: 'fundo',
      name: 'Fundo',
      materialIdFormula: '"mdf_fundo"',
      widthFormula: 'L - (EspessuraCaixa * 2) + 10', // Rasgo de 5mm cada lado
      lengthFormula: 'A - (EspessuraCaixa * 2) + 10',
      thicknessFormula: 'EspessuraFundo',
      quantityFormula: '1',
      orientationVeioFormula: 'true',
      posXFormula: 'EspessuraCaixa - 5',
      posYFormula: 'EspessuraCaixa - 5',
      posZFormula: 'P - RecuoFundo'
    }
  ],
  hardware: [
    {
      id: 'dobradica',
      hardwareIdFormula: '"dobradica_reta"',
      quantityFormula: '4' // 2 por porta
    },
    {
      id: 'parafuso_montagem',
      hardwareIdFormula: '"parafuso_4x50"',
      // Aproximação estrutural: 4 furos por união. Base + Travessas
      quantityFormula: '16' 
    }
  ],
  machining: [
    // Exemplo de furo CNC para Cavilha na Base Inferior Esquerda
    {
      id: 'furo_base_esq_1',
      partId: 'lateral_esq',
      operationType: 'drill',
      xFormula: 'EspessuraCaixa / 2',
      yFormula: 'EspessuraCaixa + 32',
      zFormula: '0',
      diameterFormula: '5',
      depthFormula: '12'
    }
  ],
  validations: [
    {
      id: 'limite_largura',
      conditionFormula: 'L > 1200',
      errorMessage: 'Largura máxima do balcão 2 portas excedida (Máx 1200mm)',
      type: 'structural'
    },
    {
      id: 'limite_profundidade',
      conditionFormula: 'P < 300',
      errorMessage: 'Profundidade mínima estrutural comprometida (Mín 300mm)',
      type: 'geometric'
    }
  ]
};
