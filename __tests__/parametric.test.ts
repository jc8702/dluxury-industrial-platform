import { ParametricComposer } from '../src/lib/parametric/composer';
import { ParametricEvaluator } from '../src/lib/parametric/evaluator';
import { BalcaoInferior } from '../src/lib/parametric/modules/balcao';

describe('Parametric Engine - Evaluator', () => {
  it('deve avaliar fórmulas matemáticas complexas corretamente', () => {
    const evaluator = new ParametricEvaluator({
      L: 1000,
      Espessura: 18
    });
    
    expect(evaluator.evaluate('L - (Espessura * 2)')).toBe(964);
    expect(evaluator.evaluate('L > 900')).toBe(true);
  });

  it('deve resolver árvore de parâmetros dependentes', () => {
    const evaluator = new ParametricEvaluator();
    const params = [
      { id: 'Espessura', type: 'number' as const, defaultValue: 18 },
      { id: 'L_Interna', type: 'number' as const, formula: 'L - (Espessura * 2)' },
      { id: 'L', type: 'number' as const, defaultValue: 800 },
    ];
    
    const context = evaluator.resolveParameters(params, { L: 1000 });
    expect(context.L).toBe(1000);
    expect(context.Espessura).toBe(18);
    expect(context.L_Interna).toBe(964);
  });
});

describe('Parametric Engine - Composer & Validator', () => {
  it('deve compor um balcão com medidas alteradas via inputs', () => {
    const composer = new ParametricComposer();
    const result = composer.compose(BalcaoInferior, {
      L: 1000,
      A: 800,
      P: 600,
      EspessuraCaixa: 15 // Override MDF 18 para 15
    });

    expect(result.parameters.L).toBe(1000);
    expect(result.parts.find(p => p.id === 'base_inf')?.length).toBe(970); // 1000 - 30
    if (result.validationErrors.length > 0) {
      console.log('VALIDATION ERRORS:', result.validationErrors);
    }
    expect(result.validationErrors.length).toBe(0);
  });

  it('deve falhar a validação estrutural se a largura for excessiva', () => {
    const composer = new ParametricComposer();
    const result = composer.compose(BalcaoInferior, {
      L: 1500, // Acima de 1200
      A: 800,
      P: 600
    });

    expect(result.validationErrors).toContain('[STRUCTURAL] Largura máxima do balcão 2 portas excedida (Máx 1200mm)');
  });

  it('deve reportar colisão se forçar posição errada em mock', () => {
    const composer = new ParametricComposer();
    // Forçando colisão criando um clone com medidas colidindo
    const MockModule = JSON.parse(JSON.stringify(BalcaoInferior));
    MockModule.parts.push({
      id: 'peca_fantasma_colisao',
      name: 'Peça Fantasma',
      materialIdFormula: '"mdf"',
      widthFormula: '100',
      lengthFormula: '100',
      thicknessFormula: '18',
      quantityFormula: '1',
      orientationVeioFormula: 'true',
      posXFormula: '0',  // Vai colidir com a lateral_esq que está em 0,0,0
      posYFormula: '0',
      posZFormula: '0'
    });

    const result = composer.compose(MockModule, { L: 800, A: 700, P: 550 });
    const collisionError = result.validationErrors.find(e => e.includes('COLLISION'));
    expect(collisionError).toBeDefined();
  });
});
