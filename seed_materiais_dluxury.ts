import { db } from './src/db';
import { materiais, ferragens } from './src/db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const EMPRESA_ID = 'd0000000-0000-0000-0000-000000000000';
const AREA_CHAPA = 2.75 * 1.85; // 5.0875 m2

const materiaisData = [
  // Chapas 15mm
  { nome: 'MDF 15MM BRANCO TX', tipo: 'chapa', espessura: '15', precoM2: (210.00 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM CARVALHO BATHUR', tipo: 'chapa', espessura: '15', precoM2: (318.12 / AREA_CHAPA).toFixed(2), temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM PALHA TRAMA', tipo: 'chapa', espessura: '15', precoM2: (243.54 / AREA_CHAPA).toFixed(2), temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM CINZA COBALTO', tipo: 'chapa', espessura: '15', precoM2: (291.81 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM MINT ESSENCIAL', tipo: 'chapa', espessura: '15', precoM2: (318.12 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM CINZA CRISTAL', tipo: 'chapa', espessura: '15', precoM2: (267.96 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 15MM CINZA GRAFITE', tipo: 'chapa', espessura: '15', precoM2: (333.70 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  
  // Chapas 6mm (Fundos)
  { nome: 'MDF 6MM BRANCO TX', tipo: 'fundo', espessura: '6', precoM2: (160.00 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM PALHA TRAMA', tipo: 'fundo', espessura: '6', precoM2: (170.28 / AREA_CHAPA).toFixed(2), temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM CARVALHO BATHUR', tipo: 'fundo', espessura: '6', precoM2: (221.76 / AREA_CHAPA).toFixed(2), temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM CINZA COBALTO', tipo: 'fundo', espessura: '6', precoM2: (205.19 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM MINT ESSENCIAL', tipo: 'fundo', espessura: '6', precoM2: (221.76 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM CINZA CRISTAL', tipo: 'fundo', espessura: '6', precoM2: (186.78 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'MDF 6MM CINZA GRAFITE', tipo: 'fundo', espessura: '6', precoM2: (241.40 / AREA_CHAPA).toFixed(2), temVeio: false, empresaId: EMPRESA_ID },

  // Fitas de Borda
  { nome: 'FITA DE BORDA PVC BRANCO TX 22MM', tipo: 'fita', espessura: '0.45', precoM2: '1.50', temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC PALHA TRAMA 22MM', tipo: 'fita', espessura: '0.45', precoM2: '1.60', temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC CINZA COBALTO 22MM', tipo: 'fita', espessura: '0.45', precoM2: '1.60', temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC PALHA TRAMA 45MM', tipo: 'fita', espessura: '1.0', precoM2: '3.44', temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC MINT ESSENCIAL 45MM', tipo: 'fita', espessura: '1.0', precoM2: '6.88', temVeio: false, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC CARVALHO BATUR 100MM', tipo: 'fita', espessura: '1.0', precoM2: '6.88', temVeio: true, empresaId: EMPRESA_ID },
  { nome: 'FITA DE BORDA PVC CINZA COBALTO 100MM', tipo: 'fita', espessura: '1.0', precoM2: '6.88', temVeio: false, empresaId: EMPRESA_ID },
];

const ferragensData = [
  { nome: 'DOBRADIÇA RETA C/ AMORTECIMENTO (FGVT/HARDT)', tipo: 'articulacao', precoUnidade: '7.32', codigoFabricante: 'DOB-RET-AM-01', empresaId: EMPRESA_ID },
  { nome: 'CORREDIÇA INVISÍVEL C/ AMORTECIMENTO 50 CM (HAFELE)', tipo: 'deslizamento', precoUnidade: '115.22', codigoFabricante: 'COR-INV-50-HF', empresaId: EMPRESA_ID },
  { nome: 'CABIDEIRO EM ALUMÍNIO (METRO)', tipo: 'acessorio', precoUnidade: '14.55', codigoFabricante: 'CAB-ALU-MT', empresaId: EMPRESA_ID },
  { nome: 'FITA LED 3000K COB C/ 5MTRS', tipo: 'acessorio', precoUnidade: '52.17', codigoFabricante: 'LED-COB-3K', empresaId: EMPRESA_ID },
  { nome: 'DRIVE FITA DE LED (SAVE ENERGY)', tipo: 'acessorio', precoUnidade: '35.69', codigoFabricante: 'DRV-LED-SE', empresaId: EMPRESA_ID },
  { nome: 'CAPA DIFUSORA LED C/ 3MTRS', tipo: 'acessorio', precoUnidade: '22.79', codigoFabricante: 'CAP-DIF-3M', empresaId: EMPRESA_ID },
  { nome: 'REFORÇO PRATELEIRAS METALON 15MM X 15MM (METRO)', tipo: 'acessorio', precoUnidade: '50.00', codigoFabricante: 'REF-MET-15', empresaId: EMPRESA_ID },
  { nome: 'TOMADAS 10A COR BRANCA (LUMITEK)', tipo: 'acessorio', precoUnidade: '14.19', codigoFabricante: 'TOM-10A-BR', empresaId: EMPRESA_ID },
  { nome: 'INTERRUPTOR (LUMITEK)', tipo: 'acessorio', precoUnidade: '19.22', codigoFabricante: 'INT-SIM-BR', empresaId: EMPRESA_ID },
  { nome: 'PUXADOR CITZEN 45º (ZEN DESIGN)', tipo: 'acessorio', precoUnidade: '140.00', codigoFabricante: 'PUX-CTZ-45', empresaId: EMPRESA_ID },
  { nome: 'KIT TRILHO CORREDIÇA PORTA DE CORRER (DUCASSE)', tipo: 'acessorio', precoUnidade: '300.00', codigoFabricante: 'KIT-TR-DUC', empresaId: EMPRESA_ID },
  { nome: 'RODINHAS GIRATÓRIAS (METALNOX)', tipo: 'acessorio', precoUnidade: '5.16', codigoFabricante: 'ROD-GIR-MT', empresaId: EMPRESA_ID },
  // Componentes vitais de produção na engenharia
  { nome: 'TAMBOR MINIFIX 15MM', tipo: 'fixacao', precoUnidade: '0.45', codigoFabricante: 'MFX-TAM-15', empresaId: EMPRESA_ID },
  { nome: 'PINO MINIFIX DUPLO', tipo: 'fixacao', precoUnidade: '0.65', codigoFabricante: 'MFX-PIN-DP', empresaId: EMPRESA_ID },
  { nome: 'CAVILHA MADEIRA 8X30MM', tipo: 'fixacao', precoUnidade: '0.05', codigoFabricante: 'CAV-8X30', empresaId: EMPRESA_ID },
];

async function seed() {
  console.log('Seeding materiais e ferragens REAIS da DLuxury...');
  
  // Limpar os antigos para garantir que a tabela tenha apenas os reais da planilha
  await db.delete(materiais).where(eq(materiais.empresaId, EMPRESA_ID));
  await db.delete(ferragens).where(eq(ferragens.empresaId, EMPRESA_ID));
  console.log('Dados antigos limpos.');

  for (const m of materiaisData) {
    await db.insert(materiais).values(m);
  }
  console.log(`✅ Inseridos ${materiaisData.length} materiais com preços por m² exatos da DLuxury.`);
  
  for (const f of ferragensData) {
    await db.insert(ferragens).values(f);
  }
  console.log(`✅ Inseridas ${ferragensData.length} ferragens com preços unitários exatos da DLuxury.`);
  
  console.log('Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
