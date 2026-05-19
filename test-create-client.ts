import { db } from './src/db';
import { clientes } from './src/db/schema/clientes';

async function run() {
  console.log("=== TENTANDO INSERIR CLIENTE NO NEON ===");
  try {
    const res = await db.insert(clientes).values({
      empresaId: "d0000000-0000-0000-0000-000000000000",
      nome: "Cliente Teste Diagnóstico",
      documento: "123.456.789-00",
      email: "teste@diagnostico.com",
      telefone: "(11) 99999-9999",
      endereco: "Rua Teste, 123",
      criadoPor: "d1111111-1111-1111-1111-111111111111",
    }).returning();
    
    console.log("SUCESSO:", JSON.stringify(res, null, 2));
  } catch (error: any) {
    console.error("ERRO COMPLETO DO POSTGRES NEON:");
    console.error(error);
  }
}

run();
