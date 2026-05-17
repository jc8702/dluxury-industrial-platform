import { SketchupModuleData } from '../domain/types';

export class StructuralValidator {
  private errors: string[] = [];
  
  public validate(moduleData: SketchupModuleData): string[] {
    this.errors = [];
    this.checkStructuralLimits(moduleData);
    this.checkCollisions(moduleData);
    
    // Varredura recursiva nos filhos
    if (moduleData.children) {
      for (const child of moduleData.children) {
        this.errors.push(...new StructuralValidator().validate(child));
      }
    }

    return this.errors;
  }

  private checkStructuralLimits(moduleData: SketchupModuleData) {
    const { width, height } = moduleData.dimensions;
    const mat = moduleData.material.toLowerCase();

    // Limites de Chapa de MDF Padrão (2750 x 1830mm)
    if (width > 2700 || height > 2700) {
      this.errors.push(`[${moduleData.name}] Peça excede limite máximo de corte da chapa (2700mm).`);
    }

    // Alerta de vão livre para Flambagem (Exemplo de Engenharia Civil/Marcenaria)
    const isPrateleira = moduleData.name.toLowerCase().includes('prateleira');
    const espessura = moduleData.dynamic_attributes['espessura'] || 15;
    
    if (isPrateleira && width > 900 && espessura < 18) {
      this.errors.push(`[${moduleData.name}] Vão livre de ${width}mm requer espessura de 18mm ou superior para evitar empenamento (flambagem).`);
    }
  }

  private checkCollisions(moduleData: SketchupModuleData) {
    // Em um sistema full 3D, varreríamos a BoundingBox (AABB) de todos os irmãos.
    // Lógica simplificada de detecção
    if (moduleData.dynamic_attributes['conflito_geom'] === 'true') {
      this.errors.push(`[${moduleData.name}] Ocorrência de colisão detectada pela matriz X,Y,Z.`);
    }
  }
}
