import { FormulaEvaluator } from '../domain/formula-evaluator';
import { ParametricProcessor } from '../application/sketchup-processor';
import { SketchupModuleData } from '../domain/types';

describe('Parametric Engine - Formula Evaluator', () => {
  it('should evaluate numeric parameters correctly', () => {
    const mockModule: SketchupModuleData = {
      guid: '123',
      parent_guid: null,
      name: 'Balcão',
      material: 'MDF Branco',
      dimensions: { width: 800, height: 720, depth: 550 },
      position: { x: 0, y: 0, z: 0 },
      dynamic_attributes: {
        'ESPESSURA_CHAPA': '15',
        'FOLGA': '2'
      }
    };

    const evaluator = new FormulaEvaluator(mockModule);
    
    // Testing exact mapping
    expect(evaluator.evaluate('W')).toBe(800);
    // Testing dynamic math parsing
    expect(evaluator.evaluate('W - (ESPESSURA_CHAPA * 2)')).toBe(770);
    expect(evaluator.evaluate('(H / 2) - FOLGA')).toBe(358);
  });
});

describe('Parametric Engine - Structural Validator', () => {
  it('should detect buckling risk on long shelves', () => {
    const mockModule: SketchupModuleData = {
      guid: '456',
      parent_guid: null,
      name: 'Prateleira Interna',
      material: 'MDF Branco',
      dimensions: { width: 1000, height: 500, depth: 500 },
      position: { x: 0, y: 0, z: 0 },
      dynamic_attributes: { 'espessura': '15' }
    };

    const processor = new ParametricProcessor({ modules: [mockModule] });
    const result = processor.process();

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('Vão livre de 1000mm requer espessura de 18mm ou superior');
  });
});
