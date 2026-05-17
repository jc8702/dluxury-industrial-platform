import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';

export interface ReportPart {
  codigo: string;
  nome: string;
  dimensoes: string;
  fitaBorda: string;
}

export class ProductionExport {
  
  /**
   * Gera etiquetas industriais em PDF (ex: padrão Zebra 10x5cm) com QRCode
   */
  static async generateLabelsPDF(parts: { codigo: string; qrCodeBase64: string; nome: string; dimensoes: string }[]): Promise<Buffer> {
    // PDF com 100x50 mm (Tamanho etiqueta padrão)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [100, 50] });

    parts.forEach((part, index) => {
      if (index > 0) doc.addPage();
      
      doc.setFontSize(14);
      doc.text(part.nome, 5, 10);
      
      doc.setFontSize(10);
      doc.text(`Cód: ${part.codigo}`, 5, 20);
      doc.text(`Dim: ${part.dimensoes}`, 5, 30);

      // Renderiza QRCode injetado
      doc.addImage(part.qrCodeBase64, 'PNG', 65, 5, 30, 30);
    });

    // Retorna Buffer puro para ser baixado ou anexado via API
    return Buffer.from(doc.output('arraybuffer'));
  }

  /**
   * Exporta a lista de peças e ferragens para Excel (.xlsx) (BOM Completo)
   */
  static async generateExcelBOM(parts: ReportPart[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Lista de Corte');

    sheet.columns = [
      { header: 'Código', key: 'codigo', width: 20 },
      { header: 'Peça', key: 'nome', width: 30 },
      { header: 'Dimensões (mm)', key: 'dimensoes', width: 25 },
      { header: 'Fita de Borda', key: 'fitaBorda', width: 20 },
    ];

    sheet.addRows(parts);

    // Styling
    sheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Gera arquivo CSV básico para importação direta em otimizadores de corte simples (Ex: CorteCerto)
   */
  static generateCutPlanCSV(parts: { material: string, comprimento: number, largura: number, quantidade: number, nome: string }[]): string {
    let csv = 'Material,Comprimento,Largura,Quantidade,Identificacao\n';
    
    parts.forEach(p => {
      csv += `${p.material},${p.comprimento},${p.largura},${p.quantidade},${p.nome}\n`;
    });

    return csv;
  }
}
