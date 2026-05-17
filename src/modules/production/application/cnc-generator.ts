import { MachiningOp } from '../../parametric-engine/domain/types';

export class CncGenerator {
  
  /**
   * Converte a Matriz de Furos e Usinagens gerada pela Engine Paramétrica
   * para Código ISO/G-Code genérico de Router CNC.
   */
  public static generateGCode(machinings: MachiningOp[], toolSpindleRPM = 18000, feedRate = 2000): string {
    let gcode = `%; Gerado por MarcenAI Enterprise CAM Engine\n`;
    gcode += `G21 ; Unidades em Milímetros\n`;
    gcode += `G90 ; Posicionamento Absoluto\n`;
    gcode += `M3 S${toolSpindleRPM} ; Liga Spindle\n\n`;

    let currentTool = -1;

    for (const op of machinings) {
      if (op.tipo.includes('furo')) {
        const broca = op.diametroBroca || 5;
        // Simulação de troca de ferramenta baseada no diâmetro
        const toolNumber = broca === 35 ? 1 : 2; 

        if (currentTool !== toolNumber) {
          gcode += `M6 T${toolNumber} ; Troca de ferramenta para Broca ${broca}mm\n`;
          currentTool = toolNumber;
        }

        // Posiciona (Plano de segurança Z=20)
        gcode += `G0 Z20.00\n`;
        gcode += `G0 X${op.x.toFixed(2)} Y${op.y.toFixed(2)}\n`;
        
        // Fura (G1 = Avanço de usinagem)
        gcode += `G1 Z-${op.profundidade.toFixed(2)} F${feedRate / 2}\n`;
        
        // Retrai
        gcode += `G0 Z20.00\n\n`;
      }
    }

    gcode += `M5 ; Desliga Spindle\n`;
    gcode += `M30 ; Fim do Programa\n%`;

    return gcode;
  }
}
