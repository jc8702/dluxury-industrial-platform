import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projetos } from "@/db/schema/projetos";
import { ambientes } from "@/db/schema/ambientes";
import { modulosSketchup } from "@/db/schema/sketchup";
import { moveis } from "@/db/schema/moveis";
import { pecas } from "@/db/schema/pecas";
import { materiais } from "@/db/schema/materiais";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const ModuloSchema = z.object({
  sketchup_guid: z.string().min(1),
  nome: z.string().min(1),
  largura: z.number().positive(),
  altura: z.number().positive(),
  profundidade: z.number().positive(),
  material: z.string().optional(),
  tipo: z.string().optional().default("outro"),
});

const SketchupImportSchema = z.object({
  projeto_codigo: z.string().min(1),
  ambiente_nome: z.string().min(1),
  modulos: z.array(ModuloSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SketchupImportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "JSON inválido de acordo com o Schema.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { projeto_codigo, ambiente_nome, modulos: inputModulos } = parsed.data;

    // 1. Localizar ou criar o projeto demo (para sandbox fluida)
    let projeto = await db
      .select()
      .from(projetos)
      .limit(1);

    let projetoId: string;
    let empresaId = "00000000-0000-0000-0000-000000000000"; // Empresa padrão

    if (projeto.length > 0) {
      projetoId = projeto[0].id;
      empresaId = projeto[0].empresaId;
    } else {
      // Cria um projeto sandbox caso o banco esteja vazio
      const novoProjeto = await db
        .insert(projetos)
        .values({
          nome: `Projeto Importado ${projeto_codigo}`,
          status: "orcamento",
          empresaId,
          clienteId: "00000000-0000-0000-0000-000000000000", // Fallback sandbox
          valorTotal: "0.00",
        })
        .returning();
      projetoId = novoProjeto[0].id;
    }

    // 2. Localizar ou criar o ambiente
    let ambiente = await db
      .select()
      .from(ambientes)
      .where(and(eq(ambientes.projetoId, projetoId), eq(ambientes.nome, ambiente_nome)))
      .limit(1);

    let ambienteId: string;
    if (ambiente.length > 0) {
      ambienteId = ambiente[0].id;
    } else {
      const novoAmbiente = await db
        .insert(ambientes)
        .values({
          projetoId,
          nome: ambiente_nome,
          tipo: "cozinha",
          empresaId,
        })
        .returning();
      ambienteId = novoAmbiente[0].id;
    }

    // 3. Garantir a existência de um material padrão no banco para fks de peças
    let material = await db
      .select()
      .from(materiais)
      .limit(1);

    let materialId: string;
    if (material.length > 0) {
      materialId = material[0].id;
    } else {
      const novoMaterial = await db
        .insert(materiais)
        .values({
          nome: "MDF Branco TX 18mm",
          tipo: "chapa",
          precoM2: "85.00",
          espessura: "18.00",
          empresaId,
        })
        .returning();
      materialId = novoMaterial[0].id;
    }

    const modulosImportados = [];

    // 4. Cadastrar os módulos e peças
    for (const mod of inputModulos) {
      // Inserir na tabela de módulos do SketchUp (dados brutos)
      const novoModuloSketchup = await db
        .insert(modulosSketchup)
        .values({
          empresaId,
          projetoId,
          ambienteId,
          guidSketchup: mod.sketchup_guid,
          nomeComponente: mod.nome,
          dimensoesRaw: { largura: mod.largura, altura: mod.altura, profundidade: mod.profundidade },
          hashImportacao: `hash_${Date.now()}`,
        })
        .onConflictDoUpdate({
          target: [modulosSketchup.projetoId, modulosSketchup.guidSketchup],
          set: {
            nomeComponente: mod.nome,
            dimensoesRaw: { largura: mod.largura, altura: mod.altura, profundidade: mod.profundidade },
          },
        })
        .returning();

      // Inserir ou obter o móvel associado
      const novoMovel = await db
        .insert(moveis)
        .values({
          ambienteId,
          nome: mod.nome,
          tipo: "Modulo",
          largura: mod.largura.toString(),
          altura: mod.altura.toString(),
          profundidade: mod.profundidade.toString(),
          empresaId,
        })
        .returning();

      const movelId = novoMovel[0].id;

      // Deletar peças anteriores se existirem para evitar duplicidade de re-importação
      await db.delete(pecas).where(eq(pecas.movelId, movelId));

      // Gerar peças construtivas base (Explosão paramétrica preliminar)
      const pecasBase = [
        { nome: "Lateral Esquerda", comprimento: mod.altura, largura: mod.profundidade },
        { nome: "Lateral Direita", comprimento: mod.altura, largura: mod.profundidade },
        { nome: "Base Construtiva", comprimento: mod.largura - 36, largura: mod.profundidade },
        { nome: "Tampo Construtivo", comprimento: mod.largura - 36, largura: mod.profundidade },
        { nome: "Fundo Traseiro", comprimento: mod.altura - 6, largura: mod.largura - 6 },
      ];

      for (const p of pecasBase) {
        await db.insert(pecas).values({
          movelId,
          materialId,
          nome: p.nome,
          comprimento: p.comprimento.toString(),
          largura: p.largura.toString(),
          espessura: "18.00",
          quantidade: "1",
          empresaId,
        });
      }

      modulosImportados.push({
        guid: mod.sketchup_guid,
        nome: mod.nome,
        dimensoes: `${mod.largura}x${mod.altura}x${mod.profundidade}mm`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${modulosImportados.length} módulos importados e explodidos em peças com sucesso no banco de dados.`,
      projetoId,
      ambienteId,
      modulosImportados,
    });
  } catch (error: any) {
    console.error("Erro no import do SketchUp:", error);
    return NextResponse.json(
      { success: false, error: "Erro de processamento no servidor.", details: error.message },
      { status: 500 }
    );
  }
}
