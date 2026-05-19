import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { embeddingsIa } from '@/db/schema';
import { gerarEmbedding } from '@/lib/ai/embeddings';

// Base de conhecimento corporativa e industrial da marcenaria D'Luxury
const MANUALS_DATA = [
  {
    titulo: 'Manual de Corrediças Telescópicas e Ocultas (D\'Luxury Spec)',
    categoria: 'manual',
    conteudo: `Manual Técnico de Corrediças D'Luxury:
1. Corrediças Telescópicas de Extração Total:
   - Requerem folga lateral rígida de exatos 13.0mm de cada lado entre a lateral externa da gaveta e o montante/lateral do móvel. O desconto total na largura da gaveta deve ser de 26.0mm.
   - Profundidade padrão de instalação na marcenaria comercial é de 500mm, necessitando de um balcão com profundidade útil mínima de 550mm (para incluir o espaço do recuo de fundo de 6mm e folga traseira de 44mm).
2. Corrediças Ocultas com Amortecedor (Soft Close):
   - Requerem rebaixo na base da gaveta e folga lateral de 5.5mm.
   - Proporcionam fechamento suave amortecido e suportam cargas estáticas de até 35kg.`,
  },
  {
    titulo: 'Manual de Dobradiças de Copo 35mm (Instalação e Folgas)',
    categoria: 'manual',
    conteudo: `Manual Técnico de Dobradiças D'Luxury (Copo de 35mm):
1. Dobradiça Reta (Cobertura Total):
   - Utilizada nas laterais externas do móvel. Cobre totalmente o topo da lateral de 18mm, deixando apenas 1.5mm de folga estética externa.
2. Dobradiça Curva (Cobertura Parcial):
   - Utilizada em montantes centrais e divisórias onde duas portas abrem para lados opostos no mesmo montante de 18mm. Cobre exatos 9.0mm de espessura de chapa.
3. Dobradiça Super Curva (Embutida):
   - Utilizada para portas que fecham embutidas dentro do vão livre do móvel. Cobre 0.0mm do topo da lateral e exige recesso total na instalação da dobradiça de 20mm.
4. Furação de Dobradiça:
   - Copo de diâmetro 35mm com profundidade de furação de 11.5mm.
   - Distância de furação (K) da borda da porta até o início do copo de furação deve ser de 4.0mm a 5.0mm.`,
  },
  {
    titulo: 'Manual de Fixadores Construtivos e Junção Estrutural',
    categoria: 'engenharia',
    conteudo: `Norma de Fixadores e Conexões D'Luxury:
1. VB54 / Rafix (Fixador Rápido Metálico):
   - Fixador estrutural recomendado para prateleiras internas e tampos móveis. Exige furação de diâmetro 20mm a 9.5mm de profundidade na face da prateleira e pino na lateral.
2. Parafusos Soberbos (4.0x50mm):
   - Recomendados para fixação estrutural de caixarias de MDF 15mm ou 18mm. Exigem pré-furo com broca de 3.0mm para evitar rachaduras e garantir torque máximo de 15Nm.
3. Cavilhas de Madeira (8x30mm):
   - Usadas em conjunto com parafusos ou minifix para garantir alinhamento geométrico perfeito das peças com tolerância zero de folgas.`,
  },
  {
    titulo: 'Norma Técnica de Deflexão e Empenamento de Prateleiras',
    categoria: 'engenharia',
    conteudo: `Norma Técnica contra Empenamento D'Luxury (MDF 18mm):
1. Limites de Vão Livre Horizontal:
   - O vão livre máximo horizontal recomendado para prateleiras de MDF de 18mm sem apoio central é de 900mm.
   - Vãos de 900mm a 1200mm sofrerão deflexão estética e física acima de 2mm se submetidos a cargas constantes maiores que 15kg/m².
2. Soluções e Reforços Obrigatórios:
   - Para vãos horizontais acima de 900mm, é obrigatória a instalação de uma divisória central vertical (montante), ou a inclusão de um perfil de alumínio estrutural de reforço frontal, ou fixação traseira rígida de 18mm contínua.`,
  }
];

export async function POST(req: Request) {
  try {
    // 1. Validar autenticação do usuário
    const session = await auth();
    if (!session?.user?.empresaId) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    const { empresaId } = session.user;
    console.log(`Iniciando indexação/seed de RAG para o tenant: ${empresaId}`);

    let indexadosCount = 0;

    // 2. Loop de processamento de embeddings e inserção no Neon Postgres
    for (const manual of MANUALS_DATA) {
      // a. Gerar o embedding vetorial do conteúdo do manual
      console.log(`Gerando embedding para: ${manual.titulo}`);
      const embedding = await gerarEmbedding(manual.conteudo);

      // b. Inserir os chunks/vetores na tabela embeddingsIa associados ao empresaId do tenant logado
      await db.insert(embeddingsIa).values({
        empresaId: empresaId,
        entidadeTipo: manual.categoria, // 'manual', 'engenharia'
        entidadeId: crypto.randomUUID(), // ID randômico para a entidade documento simulada
        conteudoTexto: manual.conteudo,
        embedding: embedding,
        createdBy: session.user.id || 'system',
        updatedBy: session.user.id || 'system'
      });

      indexadosCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Base de conhecimento do RAG indexada com sucesso!`,
      data: {
        totalDocumentosIndexados: indexadosCount,
        tenantId: empresaId,
      }
    });
  } catch (error: any) {
    console.error('Erro no provisionamento de RAG:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor ao indexar documentos.' },
      { status: 500 }
    );
  }
}
