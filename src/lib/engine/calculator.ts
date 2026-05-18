import { db } from '@/db';
import { pecas } from '@/db/schema/pecas';
import { materiais } from '@/db/schema/materiais';
import { moveis } from '@/db/schema/moveis';
import { eq, and } from 'drizzle-orm';
import { ParsedModuleResult } from './parser';

export interface CalculatedPieceItem {
  nome: string;
  comprimento: number; // mm
  largura: number; // mm
  espessura: number; // mm
  quantidade: number;
  tipoPeca: 'lateral' | 'base' | 'tampo' | 'fundo' | 'prateleira' | 'outro';
  tipoMaterial: 'chapa' | 'fundo';
}

/**
 * Calcula todas as peças constituintes de um móvel a partir de suas dimensões paramétricas e do tipo do móvel.
 */
export function calculatePiecesForModule(parsed: ParsedModuleResult): CalculatedPieceItem[] {
  const { largura: L, altura: A, profundidade: P, tipo } = parsed;
  const items: CalculatedPieceItem[] = [];

  // Espessura padrão de 18mm para a estrutura e 6mm para o fundo
  const ESP_ESTRUTURA = 18;
  const ESP_FUNDO = 6;

  if (tipo === 'aereo') {
    // 1. Laterais (Esquerda e Direita)
    // As laterais costumam cobrir toda a altura e profundidade do armário
    items.push({
      nome: 'Lateral Esquerda',
      comprimento: A,
      largura: P - 2, // 2mm de folga para alinhamento e recuo do fundo
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'lateral',
      tipoMaterial: 'chapa',
    });
    items.push({
      nome: 'Lateral Direita',
      comprimento: A,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'lateral',
      tipoMaterial: 'chapa',
    });

    // 2. Tampo Superior e Base Inferior
    // Ficam embutidos entre as laterais esquerda e direita (descontando 2x espessura das laterais)
    const compEstrutural = L - (ESP_ESTRUTURA * 2);
    items.push({
      nome: 'Tampo Superior',
      comprimento: compEstrutural,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'tampo',
      tipoMaterial: 'chapa',
    });
    items.push({
      nome: 'Base Inferior',
      comprimento: compEstrutural,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'base',
      tipoMaterial: 'chapa',
    });

    // 3. Fundo do Armário (chapa de 6mm)
    // Encaixado em canais ou pregado/parafusado por trás
    items.push({
      nome: 'Fundo Aéreo',
      comprimento: L - 4, // Folga para canal de embutimento
      largura: A - 4,
      espessura: ESP_FUNDO,
      quantidade: 1,
      tipoPeca: 'fundo',
      tipoMaterial: 'fundo',
    });

    // 4. Prateleiras Internas (paramétricas de acordo com a altura)
    // Uma prateleira a cada 400mm de altura livre
    const qtdPrateleiras = Math.max(0, Math.floor(A / 400) - 1);
    if (qtdPrateleiras > 0) {
      items.push({
        nome: 'Prateleira Móvel',
        comprimento: L - (ESP_ESTRUTURA * 2) - 2, // 2mm de folga para pino e montagem suave
        largura: P - 20, // recuada da porta da frente
        espessura: ESP_ESTRUTURA,
        quantidade: qtdPrateleiras,
        tipoPeca: 'prateleira',
        tipoMaterial: 'chapa',
      });
    }

  } else if (tipo === 'balcao' || tipo === 'torre' || tipo === 'outro') {
    // Balcão / Torre / Outros
    // 1. Laterais (Esquerda e Direita)
    items.push({
      nome: 'Lateral Esquerda',
      comprimento: A,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'lateral',
      tipoMaterial: 'chapa',
    });
    items.push({
      nome: 'Lateral Direita',
      comprimento: A,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'lateral',
      tipoMaterial: 'chapa',
    });

    // 2. Tampo e Base
    const compEstrutural = L - (ESP_ESTRUTURA * 2);
    items.push({
      nome: 'Tampo Superior',
      comprimento: compEstrutural,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'tampo',
      tipoMaterial: 'chapa',
    });
    items.push({
      nome: 'Base Inferior',
      comprimento: compEstrutural,
      largura: P - 2,
      espessura: ESP_ESTRUTURA,
      quantidade: 1,
      tipoPeca: 'base',
      tipoMaterial: 'chapa',
    });

    // 3. Fundo
    items.push({
      nome: 'Fundo Móvel',
      comprimento: L - 4,
      largura: A - 4,
      espessura: ESP_FUNDO,
      quantidade: 1,
      tipoPeca: 'fundo',
      tipoMaterial: 'fundo',
    });

    // 4. Prateleiras
    const qtdPrateleiras = Math.max(0, Math.floor((A - 200) / 400));
    if (qtdPrateleiras > 0) {
      items.push({
        nome: 'Prateleira Móvel',
        comprimento: L - (ESP_ESTRUTURA * 2) - 2,
        largura: P - 20,
        espessura: ESP_ESTRUTURA,
        quantidade: qtdPrateleiras,
        tipoPeca: 'prateleira',
        tipoMaterial: 'chapa',
      });
    }
  }

  return items;
}

/**
 * Roda a engine paramétrica para um móvel específico, deleta as peças antigas
 * e persiste a nova lista de peças no banco Neon.
 */
export async function runEngineCalculationForModule(movelId: string, parsed: ParsedModuleResult): Promise<number> {
  const piecesToCreate = calculatePiecesForModule(parsed);

  // 1. Garantir que existam os materiais cadastrados no banco de dados para a empresaId do móvel
  let materialEstruturaId = '';
  let materialFundoId = '';

  const listMateriais = await db
    .select()
    .from(materiais)
    .where(eq(materiais.empresaId, parsed.empresaId));

  const materialEstrutura = listMateriais.find((m) => m.tipo === 'chapa' && Number(m.espessura) === 18);
  const materialFundo = listMateriais.find((m) => m.tipo === 'fundo' && Number(m.espessura) === 6);

  if (materialEstrutura) {
    materialEstruturaId = materialEstrutura.id;
  } else {
    // Criar material de estrutura de MDF 18mm caso não exista
    const inserted = await db
      .insert(materiais)
      .values({
        empresaId: parsed.empresaId,
        nome: 'MDF Branco TX 18mm',
        tipo: 'chapa',
        espessura: '18',
        precoM2: '85.00',
        temVeio: false,
      })
      .returning({ id: materiais.id });
    materialEstruturaId = inserted[0].id;
  }

  if (materialFundo) {
    materialFundoId = materialFundo.id;
  } else {
    // Criar material de fundo de MDF 6mm caso não exista
    const inserted = await db
      .insert(materiais)
      .values({
        empresaId: parsed.empresaId,
        nome: 'MDF Fundo Branco 6mm',
        tipo: 'fundo',
        espessura: '6',
        precoM2: '45.00',
        temVeio: false,
      })
      .returning({ id: materiais.id });
    materialFundoId = inserted[0].id;
  }

  // 2. Limpar todas as peças antigas deste móvel para reinserir
  await db.delete(pecas).where(eq(pecas.movelId, movelId));

  // 3. Persistir as novas peças paramétricas no banco de dados
  let count = 0;
  for (const item of piecesToCreate) {
    const matId = item.tipoMaterial === 'chapa' ? materialEstruturaId : materialFundoId;

    await db.insert(pecas).values({
      movelId: movelId,
      materialId: matId,
      nome: item.nome,
      comprimento: item.comprimento.toString(),
      largura: item.largura.toString(),
      espessura: item.espessura.toString(),
      quantidade: item.quantidade.toString(),
      orientacaoVeio: true,
    });
    count += item.quantidade;
  }

  return count;
}
