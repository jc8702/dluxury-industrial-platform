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
import QRCode from 'qrcode';

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
    const empresaId = session?.user?.empresaId || '00000000-0000-0000-0000-000000000000'; // Fallback sandbox

    // 2. Buscar o Projeto
    const projetoQuery = await db
      .select()
      .from(projetos)
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
      // 4. Buscar Móveis associados
      const listMoveis = await db
        .select()
        .from(moveis)
        .where(inArray(moveis.ambienteId, ambienteIds));
      const movelIds = listMoveis.map((m) => m.id);

      if (movelIds.length > 0) {
        // 5. Buscar Peças e Materiais
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

    if (pecasDetalhadas.length === 0) {
      return new Response('Nenhuma peça encontrada para gerar etiquetas.', { status: 400 });
    }

    // 6. Explodir a lista de peças considerando a QUANTIDADE física (cada peça ganha sua etiqueta individual!)
    const etiquetasPecas: any[] = [];
    let sequencial = 1;

    for (const p of pecasDetalhadas) {
      const qtd = Math.round(Number(p.quantidade));
      for (let q = 1; q <= qtd; q++) {
        // Formato do código da etiqueta (ex: LAT-01-A, LAT-01-B ou LAT-01 [1/2])
        const sufixoEtiqueta = qtd > 1 ? `[${q}/${qtd}]` : '';
        const codigoPeca = `${p.nome.substring(0, 3).toUpperCase()}-${sequencial.toString().padStart(2, '0')}${sufixoEtiqueta}`;
        
        etiquetasPecas.push({
          ...p,
          codigoGerado: codigoPeca,
          indiceCopia: q,
          totalCopias: qtd,
        });
        sequencial++;
      }
    }

    // 7. Instanciar jsPDF em formato A4
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Dimensões e parâmetros do Grid (2x5 etiquetas por página)
    const etiquetaLargura = 90;
    const etiquetaAltura = 50;
    const margemX = 15;
    const margemY = 23.5;
    const espacoX = 0; // coladas lado a lado para guias de corte perfeitas
    const espacoY = 0;

    const totalPorPagina = 10;
    const numPaginas = Math.ceil(etiquetasPecas.length / totalPorPagina);

    for (let pIdx = 0; pIdx < numPaginas; pIdx++) {
      if (pIdx > 0) {
        doc.addPage();
      }

      const startIndex = pIdx * totalPorPagina;
      const endIndex = Math.min(startIndex + totalPorPagina, etiquetasPecas.length);
      const chunkPecas = etiquetasPecas.slice(startIndex, endIndex);

      for (let i = 0; i < chunkPecas.length; i++) {
        const peca = chunkPecas[i];
        
        // Calcular posição X, Y da célula no grid 2x5
        const col = i % 2;
        const row = Math.floor(i / 2);
        
        const x = margemX + col * (etiquetaLargura + espacoX);
        const y = margemY + row * (etiquetaAltura + espacoY);

        // 1. Desenhar Borda da etiqueta pontilhada para corte
        doc.setDrawColor(203, 213, 225); // Slate 300
        doc.setLineDashPattern([2, 2], 0);
        doc.rect(x, y, etiquetaLargura, etiquetaAltura, 'D');
        doc.setLineDashPattern([], 0); // Resetar linha sólida

        // 2. Gerar QRCode Data URL assíncrono para a peça
        // Conteúdo: PROJETO_ID/AMBIENTE/MOVEL/PECA/COPIA
        const qrContent = `${projeto.nome.substring(0, 10).toUpperCase()}/${peca.ambienteNome.toUpperCase()}/${peca.movelNome}/${peca.nome}/${peca.indiceCopia}`;
        const qrDataURL = await QRCode.toDataURL(qrContent, {
          width: 120,
          margin: 1,
        });

        // 3. Adicionar QRCode na Etiqueta
        doc.addImage(qrDataURL, 'PNG', x + 3, y + 6, 25, 25);

        // 4. Desenhar Textos e Layout da Etiqueta
        // Logo de Engenharia D'Luxury no topo da etiqueta
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(x, y, etiquetaLargura, 5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text("D'LUXURY INDUSTRIAL - ETIQUETA RASTREÁVEL", x + 3, y + 3.5);

        // Código do Projeto / Lote
        doc.setTextColor(71, 85, 105);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(`PROJ: ${projeto.nome.toUpperCase()}`, x + 32, y + 10);

        // Código Sequencial Único da Peça
        doc.setTextColor(14, 116, 144); // Cyan 700
        doc.setFontSize(10);
        doc.text(peca.codigoGerado, x + 32, y + 15);

        // Nome da Peça
        doc.setTextColor(15, 23, 42);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        const nomeTruncated = peca.nome.length > 25 ? peca.nome.substring(0, 22) + '...' : peca.nome;
        doc.text(nomeTruncated, x + 32, y + 21);

        // Dimensões (LxAxE)
        doc.setTextColor(71, 85, 105);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        const dimString = `${Math.round(Number(peca.comprimento))} x ${Math.round(Number(peca.largura))} x ${Math.round(Number(peca.espessura))} mm`;
        doc.text(dimString, x + 32, y + 26);

        // Nome do Móvel e Ambiente
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        const moduloString = `MÓDULO: ${peca.movelNome.toUpperCase()}`;
        const moduloTruncated = moduloString.length > 36 ? moduloString.substring(0, 33) + '...' : moduloString;
        doc.text(moduloTruncated, x + 32, y + 31);
        doc.text(`AMBIENTE: ${peca.ambienteNome.toUpperCase()}`, x + 32, y + 35);

        // MDF/Material
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(14, 116, 144);
        const materialName = peca.materialNome || 'MDF Branco 18mm';
        const materialTruncated = materialName.length > 34 ? materialName.substring(0, 31) + '...' : materialName;
        doc.text(materialTruncated, x + 32, y + 41);

        // Indicação de Furação/Corte
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text(`LOTE: ${new Date().toLocaleDateString('pt-BR')}`, x + 3, y + 46);
        doc.text(`CÓPIA: ${peca.indiceCopia}/${peca.totalCopias}`, x + 32, y + 46);
        doc.text("CNC PRONTO", x + 72, y + 46);
      }
    }

    // Gerar o array buffer
    const pdfOutput = doc.output('arraybuffer');

    // Retornar a response binária do PDF com cabeçalhos apropriados de download
    return new Response(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="etiquetas-${projeto.nome.toLowerCase().replace(/\s+/g, '-')}-${projetoId.substring(0, 6)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Erro ao gerar PDF de etiquetas:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
