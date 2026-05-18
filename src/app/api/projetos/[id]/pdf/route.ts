import { NextRequest } from 'next/server';
import { db } from '@/db';
import { projetos } from '@/db/schema/projetos';
import { clientes } from '@/db/schema/clientes';
import { ambientes } from '@/db/schema/ambientes';
import { moveis } from '@/db/schema/moveis';
import { pecas } from '@/db/schema/pecas';
import { materiais } from '@/db/schema/materiais';
import { eq, and, inArray } from 'drizzle-orm';
import { auth } from '@/auth';
import { jsPDF } from 'jspdf';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar sessão/autenticação e obter tenant isolado
    const session = await auth();
    if (!session && process.env.NODE_ENV === 'production') {
      return new Response('Não autorizado. Faça login primeiro.', { status: 401 });
    }

    const { id: projetoId } = await params;
    const empresaId = session?.user?.empresaId || '00000000-0000-0000-0000-000000000000'; // Fallback local sandbox

    // 2. Buscar o Projeto com Join no Cliente
    const projetoQuery = await db
      .select({
        id: projetos.id,
        nome: projetos.nome,
        status: projetos.status,
        dataEntrega: projetos.dataEntrega,
        clienteNome: clientes.nome,
        clienteEmail: clientes.email,
        clienteTelefone: clientes.telefone,
      })
      .from(projetos)
      .leftJoin(clientes, eq(projetos.clienteId, clientes.id))
      .where(
        process.env.NODE_ENV === 'production'
          ? and(eq(projetos.id, projetoId), eq(projetos.empresaId, empresaId))
          : eq(projetos.id, projetoId)
      )
      .limit(1);

    const projeto = projetoQuery[0];
    if (!projeto) {
      return new Response('Projeto não encontrado ou acesso não autorizado.', { status: 404 });
    }

    // 3. Buscar todos os Ambientes do Projeto
    const listAmbientes = await db
      .select()
      .from(ambientes)
      .where(eq(ambientes.projetoId, projetoId));
    const ambienteIds = listAmbientes.map((a) => a.id);

    let pecasDetalhadas: any[] = [];
    if (ambienteIds.length > 0) {
      // 4. Buscar Móveis associados aos Ambientes
      const listMoveis = await db
        .select()
        .from(moveis)
        .where(inArray(moveis.ambienteId, ambienteIds));
      const movelIds = listMoveis.map((m) => m.id);

      if (movelIds.length > 0) {
        // 5. Buscar todas as peças constitutivas e seus respectivos materiais
        pecasDetalhadas = await db
          .select({
            id: pecas.id,
            nome: pecas.nome,
            comprimento: pecas.comprimento,
            largura: pecas.largura,
            espessura: pecas.espessura,
            quantidade: pecas.quantidade,
            movelNome: moveis.nome,
            ambienteNome: ambientes.nome,
            materialNome: materiais.nome,
          })
          .from(pecas)
          .innerJoin(moveis, eq(pecas.movelId, moveis.id))
          .innerJoin(ambientes, eq(moveis.ambienteId, ambientes.id))
          .leftJoin(materiais, eq(pecas.materialId, materiais.id))
          .where(inArray(pecas.movelId, movelIds));
      }
    }

    // 6. Ordenar peças: primeiro por ambiente, depois por móvel e tipo/nome
    pecasDetalhadas.sort((a, b) => {
      const ambComp = a.ambienteNome.localeCompare(b.ambienteNome);
      if (ambComp !== 0) return ambComp;
      const movComp = a.movelNome.localeCompare(b.movelNome);
      if (movComp !== 0) return movComp;
      return a.nome.localeCompare(b.nome);
    });

    // 7. Efetuar cálculos agregados de produção (BOM)
    const totalPecas = pecasDetalhadas.reduce((acc, p) => acc + Math.round(Number(p.quantidade)), 0);
    const areaTotalM2 = pecasDetalhadas.reduce((acc, p) => {
      const comp = Number(p.comprimento);
      const larg = Number(p.largura);
      const qtd = Math.round(Number(p.quantidade));
      return acc + (comp * larg * qtd) / 1000000;
    }, 0);

    // 8. Instanciar e desenhar o PDF usando jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Cores do tema industrial dark
    const primaryColor = { r: 15, g: 23, b: 42 }; // Slate 900
    const accentColor = { r: 14, g: 116, b: 144 }; // Cyan 700
    const textDark = { r: 30, g: 41, b: 59 }; // Slate 800
    const borderGray = { r: 226, g: 232, b: 240 }; // Gray 200

    const drawHeader = (pageNum: number) => {
      // Retângulo do cabeçalho corporativo
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.rect(0, 0, 210, 32, 'F');

      // Título D'Luxury
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text("D'LUXURY INDUSTRIAL PLATFORM", 12, 12);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(165, 180, 252);
      doc.text("SISTEMA DE EXPLOSÃO CONSTRUTIVA & BOM", 12, 17);

      // Metadados do Projeto
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.text(`PROJETO: ${projeto.nome.toUpperCase()}`, 12, 25);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(209, 213, 219);
      doc.text(`CLIENTE: ${projeto.clienteNome || 'Consumidor Final'}`, 120, 12);
      doc.text(`ENTREGA: ${projeto.dataEntrega ? new Date(projeto.dataEntrega).toLocaleDateString('pt-BR') : 'A definir'}`, 120, 17);
      doc.text(`EMISSÃO: ${new Date().toLocaleDateString('pt-BR')}`, 120, 22);
      doc.text(`PÁGINA: ${pageNum}`, 120, 27);
    };

    const drawTableHeaders = (yPos: number) => {
      doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
      doc.rect(10, yPos, 190, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('AMBIENTE / MÓVEL', 13, yPos + 5.5);
      doc.text('PEÇA', 65, yPos + 5.5);
      doc.text('COMP (mm)', 115, yPos + 5.5, { align: 'right' });
      doc.text('LARG (mm)', 138, yPos + 5.5, { align: 'right' });
      doc.text('ESP (mm)', 158, yPos + 5.5, { align: 'right' });
      doc.text('QTD', 172, yPos + 5.5, { align: 'right' });
      doc.text('MATERIAL', 178, yPos + 5.5);
    };

    // Desenhar a Primeira Página
    drawHeader(1);

    // Bloco de Métricas do Projeto (BOM Summary)
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(10, 36, 190, 18, 'F');
    doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
    doc.rect(10, 36, 190, 18, 'D');

    doc.setTextColor(textDark.r, textDark.g, textDark.b);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('RESUMO DE MATÉRIA-PRIMA & PRODUÇÃO (BOM)', 14, 41);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Total de Peças Físicas:`, 14, 46);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${totalPecas} un`, 50, 46);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Área Total de MDF Estimada:`, 95, 46);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${areaTotalM2.toFixed(3)} m²`, 138, 46);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Ambientes Cadastrados:`, 14, 51);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${listAmbientes.length} amb`, 50, 51);

    // Tabela de Peças
    let y = 60;
    drawTableHeaders(y);
    y += 8;

    let currentPage = 1;

    for (let i = 0; i < pecasDetalhadas.length; i++) {
      const peca = pecasDetalhadas[i];

      // Verificar quebra de página (A4 tem 297mm de altura, quebramos em 275mm)
      if (y > 275) {
        // Desenhar rodapé na página atual antes de mudar
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("D'Luxury Marcenaria Industrial - Relatório Confidencial de Produção", 10, 287);

        doc.addPage();
        currentPage++;
        drawHeader(currentPage);
        
        y = 36;
        drawTableHeaders(y);
        y += 8;
      }

      // Zebra stripes background
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(10, y, 190, 7.5, 'F');
      }

      // Linha separadora sutil
      doc.setDrawColor(241, 245, 249);
      doc.line(10, y + 7.5, 200, y + 7.5);

      // Dados da Peça
      doc.setTextColor(71, 85, 105);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);

      // Truncar textos compridos para caber nas colunas
      const localString = `${peca.ambienteNome.toUpperCase()} / ${peca.movelNome}`;
      const localTruncated = localString.length > 32 ? localString.substring(0, 29) + '...' : localString;
      doc.text(localTruncated, 13, y + 5);

      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      const pecaNomeTruncated = peca.nome.length > 28 ? peca.nome.substring(0, 25) + '...' : peca.nome;
      doc.text(pecaNomeTruncated, 65, y + 5);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(Math.round(Number(peca.comprimento)).toString(), 115, y + 5, { align: 'right' });
      doc.text(Math.round(Number(peca.largura)).toString(), 138, y + 5, { align: 'right' });
      doc.text(Math.round(Number(peca.espessura)).toString(), 158, y + 5, { align: 'right' });
      
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.text(Math.round(Number(peca.quantidade)).toString(), 172, y + 5, { align: 'right' });

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(14, 116, 144); // Cyan 700
      const materialName = peca.materialNome || 'MDF Branco 18mm';
      const materialTruncated = materialName.length > 18 ? materialName.substring(0, 15) + '...' : materialName;
      doc.text(materialTruncated, 178, y + 5);

      y += 7.5;
    }

    // Rodapé da última página
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("D'Luxury Marcenaria Industrial - Relatório Confidencial de Produção", 10, 287);

    // Gerar o array buffer
    const pdfOutput = doc.output('arraybuffer');

    // Retornar a response binária do PDF com cabeçalhos apropriados de download
    return new Response(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bom-${projeto.nome.toLowerCase().replace(/\s+/g, '-')}-${projetoId.substring(0, 6)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Erro ao gerar PDF da lista de peças:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
