import { db } from './src/db';
import { empresas } from './src/db/schema/empresas';
import { usuarios } from './src/db/schema/usuarios';

async function run() {
  console.log("=== EMPRESAS NO BANCO ===");
  try {
    const listEmpresas = await db.select().from(empresas);
    console.log(JSON.stringify(listEmpresas, null, 2));
  } catch (e: any) {
    console.error("Erro ao listar empresas:", e.message);
  }

  console.log("=== USUÁRIOS NO BANCO ===");
  try {
    const listUsuarios = await db.select().from(usuarios);
    console.log(JSON.stringify(listUsuarios, null, 2));
  } catch (e: any) {
    console.error("Erro ao listar usuários:", e.message);
  }
}

run();
