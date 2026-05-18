import { MARGINS, ModuleType, ValidationMessage, VALID_THICKNESSES } from './rules';

/**
 * Valida se as dimensões básicas do móvel atendem aos limites físicos operacionais da fábrica.
 */
export function validateDimensions(largura: number, altura: number, profundidade: number): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  // Largura
  if (largura < MARGINS.MIN_WIDTH) {
    messages.push({
      level: 'error',
      code: 'DIM_MIN_WIDTH',
      message: `Largura de ${largura}mm está abaixo do mínimo industrial permitido (${MARGINS.MIN_WIDTH}mm).`,
      field: 'largura',
    });
  } else if (largura > MARGINS.MAX_WIDTH) {
    messages.push({
      level: 'error',
      code: 'DIM_MAX_WIDTH',
      message: `Largura de ${largura}mm excede o tamanho máximo de chapa da fábrica (${MARGINS.MAX_WIDTH}mm).`,
      field: 'largura',
    });
  }

  // Altura
  if (altura < MARGINS.MIN_HEIGHT) {
    messages.push({
      level: 'error',
      code: 'DIM_MIN_HEIGHT',
      message: `Altura de ${altura}mm está abaixo do mínimo operacional (${MARGINS.MIN_HEIGHT}mm).`,
      field: 'altura',
    });
  } else if (altura > MARGINS.MAX_HEIGHT) {
    messages.push({
      level: 'error',
      code: 'DIM_MAX_HEIGHT',
      message: `Altura de ${altura}mm excede o máximo empilhável com segurança (${MARGINS.MAX_HEIGHT}mm).`,
      field: 'altura',
    });
  }

  // Profundidade
  if (profundidade < MARGINS.MIN_DEPTH) {
    messages.push({
      level: 'error',
      code: 'DIM_MIN_DEPTH',
      message: `Profundidade de ${profundidade}mm é muito rasa para fixação estrutural segura (mínimo ${MARGINS.MIN_DEPTH}mm).`,
      field: 'profundidade',
    });
  } else if (profundidade > MARGINS.MAX_DEPTH) {
    messages.push({
      level: 'error',
      code: 'DIM_MAX_DEPTH',
      message: `Profundidade de ${profundidade}mm excede o limite ergonômico de braço e corrediças padrão (${MARGINS.MAX_DEPTH}mm).`,
      field: 'profundidade',
    });
  }

  // Validação de vão livre sem prumo/suporte estrutural
  if (largura > MARGINS.MAX_UNSUPPORTED_SPAN) {
    messages.push({
      level: 'error',
      code: 'STRUCT_UNSUPPORTED_SPAN',
      message: `Vão horizontal livre de ${largura}mm ultrapassa o limite seguro de ${MARGINS.MAX_UNSUPPORTED_SPAN}mm. Risco crítico de empenamento da base ou do tampo sem divisória de sustentação vertical.`,
      field: 'largura',
    });
  }

  return messages;
}

/**
 * Valida se as dimensões do móvel fazem sentido com a tipologia declarada (Aéreo, Balcão, Torre).
 */
export function validateModuleTypeRatio(tipo: ModuleType, largura: number, altura: number, profundidade: number): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  switch (tipo) {
    case 'aereo':
      // Aéreos costumam ser mais rasos (profundidade de 300mm a 400mm) para não bater a cabeça
      if (profundidade > 450) {
        messages.push({
          level: 'warning',
          code: 'RATIO_AE_DEPTH',
          message: `Móvel Aéreo com profundidade de ${profundidade}mm é muito profundo. O ideal para evitar acidentes de uso é até 400mm.`,
          field: 'profundidade',
        });
      }
      // Relação de proporção altura vs largura
      if (altura > largura * 1.5) {
        messages.push({
          level: 'warning',
          code: 'RATIO_AE_HEIGHT_WIDTH',
          message: `Aéreo muito alto em relação à largura. Pode haver problemas de instabilidade na fixação aérea e empenamento de portas altas.`,
          field: 'altura',
        });
      }
      break;

    case 'balcao':
      // Balcões residenciais/comerciais padrão possuem altura ergonômica entre 700mm e 950mm (com tampo)
      if (altura < 600 || altura > 1050) {
        messages.push({
          level: 'warning',
          code: 'RATIO_BA_HEIGHT',
          message: `Altura do Balcão (${altura}mm) foge do padrão ergonômico ideal de trabalho de cozinha/escritório (700mm - 950mm).`,
          field: 'altura',
        });
      }
      if (profundidade < 400) {
        messages.push({
          level: 'warning',
          code: 'RATIO_BA_DEPTH',
          message: `Profundidade de ${profundidade}mm é rasa para um Balcão padrão (ideal a partir de 500mm para embutir cubas, pias ou gavetas).`,
          field: 'profundidade',
        });
      }
      break;

    case 'torre':
      // Torres (paneleiros, armários de serviço altos) devem ter altura pelo menos o dobro da largura para justificar a estabilidade de fixação vertical
      if (altura < largura * 2) {
        messages.push({
          level: 'warning',
          code: 'RATIO_TO_HEIGHT_WIDTH',
          message: `Móvel tipo Torre com altura menor que o dobro da largura (${altura}mm de altura para ${largura}mm de largura). Avalie se não se enquadra melhor como Balcão.`,
          field: 'altura',
        });
      }
      break;
  }

  return messages;
}

/**
 * Valida a chapa de MDF/MDP selecionada para o móvel
 */
export function validateChapa(espessura: number): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  if (!VALID_THICKNESSES.includes(espessura)) {
    messages.push({
      level: 'error',
      code: 'MAT_INVALID_THICKNESS',
      message: `Espessura de chapa de ${espessura}mm é inexistente no estoque industrial. Use espessuras padrão: ${VALID_THICKNESSES.join(', ')}mm.`,
      field: 'espessura',
    });
  }

  // Chapas de sustentação estrutural vertical (laterais, divisórias, etc) não devem ter menos de 15mm
  if (espessura < 15) {
    messages.push({
      level: 'warning',
      code: 'MAT_THIN_STRUCTURE',
      message: `Chapa de espessura de ${espessura}mm é muito fina para sustentação de módulos estruturais. Risco de fragilidade na ancoragem de ferragens (dobradiças/corrediças). Recomenda-se no mínimo 15mm ou 18mm.`,
      field: 'espessura',
    });
  }

  return messages;
}
