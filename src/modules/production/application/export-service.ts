import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { ExplodedPart } from '../../parametric-engine/domain/types';

export class ExportService {
  
  /**
   * Gera PDF de Etiquetas Industriais (100x50mm padrão Argox/Zebra)
   */
  public static async generateLabelsPDF(parts: ExplodedPart[], orderId: string): Promise<Buffer> {
    // Formato Zebra/Argox comum (aprox 100x50mm) em paisagem
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [100, 50]
    });

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i > 0) doc.addPage();

      // Desenhar Borda Fita
      doc.setLineWidth(0.5);
      doc.rect(2, 2, 96, 46);

      // Texto Principal
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`OP: ${orderId}`, 5, 8);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Peca: ${part.nome}`, 5, 14);
      doc.text(`Mat: ${part.material}`, 5, 20);
      doc.text(`Dim: ${part.comprimento} x ${part.largura} x ${part.espessura}mm`, 5, 26);

      // Geração de QRCode Traceability
      const qrPayload = `OP:${orderId}|PC:${part.nome}`;
      const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 0, width: 25 });
      
      // Injeta QR Code no lado direito da etiqueta
      doc.addImage(qrDataUrl, 'PNG', 70, 5, 25, 25);
    }

    // Convert to Buffer para Node.js environment
    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
  }

  /**
   * Exporta a lista de Corte para CSV compatível com CorteCerto ou Promob Cut
   */
  public static generateCuttingPlanCSV(parts: ExplodedPart[]): string {
    const headers = ['Material', 'Comprimento', 'Largura', 'Quantidade', 'Nome_Peca', 'Fita_Sup', 'Fita_Inf', 'Fita_Esq', 'Fita_Dir'];
    const rows = parts.map(p => 
      [p.material, p.comprimento, p.largura, p.quantidade, p.nome, '1', '1', '1', '1'].join(';')
    );
    
    return [headers.join(';'), ...rows].join('\n');
  }

  /**
   * Exporta a BOM Completa (Peças + Ferragens) para Excel para ERPs
   */
  public static async generateBOMExcel(parts: ExplodedPart[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('BOM - Explosão');

    sheet.columns = [
      { header: 'Peça', key: 'nome', width: 30 },
      { header: 'Material', key: 'material', width: 25 },
      { header: 'C(mm)', key: 'comprimento', width: 10 },
      { header: 'L(mm)', key: 'largura', width: 10 },
      { header: 'E(mm)', key: 'espessura', width: 10 },
      { header: 'Qtd', key: 'quantidade', width: 10 },
    ];

    parts.forEach(p => sheet.addRow(p));

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
