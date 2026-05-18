import React from 'react';
import { db } from '@/db';
import { projetos } from '@/db/schema/projetos';
import { ambientes } from '@/db/schema/ambientes';
import { moveis } from '@/db/schema/moveis';
import { pecas } from '@/db/schema/pecas';
import { materiais } from '@/db/schema/materiais';
import { eq, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { LayoutGrid, Cpu, Package, ArrowLeft, Layers, Compass, FileDown, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MovelCard from '@/components/modulos/movel-card';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjetoModulosPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Obter o Projeto
  const projetoResult = await db.select().from(projetos).where(eq(projetos.id, id)).limit(1);
  const projeto = projetoResult[0];

  if (!projeto) {
    notFound();
  }

  // 2. Obter Ambientes
  const listAmbientes = await db.select().from(ambientes).where(eq(ambientes.projetoId, id));
  const ambienteIds = listAmbientes.map((a) => a.id);

  let listMoveis: any[] = [];
  let listPecas: any[] = [];

  if (ambienteIds.length > 0) {
    // 3. Obter Móveis dos Ambientes
    listMoveis = await db.select().from(moveis).where(inArray(moveis.ambienteId, ambienteIds));
    const movelIds = listMoveis.map((m) => m.id);

    if (movelIds.length > 0) {
      // 4. Obter Peças e Materiais
      listPecas = await db
        .select({
          id: pecas.id,
          movelId: pecas.movelId,
          nome: pecas.nome,
          comprimento: pecas.comprimento,
          largura: pecas.largura,
          espessura: pecas.espessura,
          quantidade: pecas.quantidade,
          materialNome: materiais.nome,
        })
        .from(pecas)
        .leftJoin(materiais, eq(pecas.materialId, materiais.id))
        .where(inArray(pecas.movelId, movelIds));
    }
  }

  return (
    <div className="space-y-8 p-6 bg-[#0F1115] min-h-screen text-slate-100 font-sans">
      {/* Header com breadcrumbs de engenharia */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Link href="/projetos" className="hover:text-blue-400 transition-colors">PROJETOS</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-[150px] uppercase">{projeto.nome}</span>
            <span>/</span>
            <span className="text-blue-500 font-semibold">MÓDULOS E ENGENHARIA</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Cpu className="w-8 h-8 text-blue-500 mr-3" />
            Explosão Construtiva (BOM)
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Visualize os móveis e a engenharia detalhada explodida das peças de marcenaria de cada ambiente importado do SketchUp.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/projetos/${projeto.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold rounded-lg transition-all text-white border border-cyan-500/20 shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Exportar Lista BOM (PDF)
          </a>

          <a
            href={`/api/projetos/${projeto.id}/labels`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1E202B] hover:bg-[#282B3B] text-xs font-mono font-bold rounded-lg transition-all text-cyan-400 border border-cyan-500/15 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            Imprimir Etiquetas
          </a>

          <Link href="/sketchup">
            <Button className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-semibold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Importador
            </Button>
          </Link>
        </div>
      </div>

      {listAmbientes.length === 0 ? (
        <Card className="bg-[#1A1D24] border-slate-800 p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto py-16 shadow-2xl">
          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">
            <Compass className="w-6 h-6 text-slate-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Nenhum Ambiente Cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Este projeto não possui nenhum ambiente ou módulo importado. Efetue a importação do JSON do SketchUp.
            </p>
          </div>
          <Link href="/sketchup">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/15">
              Importar Módulos
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-10">
          {listAmbientes.map((amb) => {
            const moveisDoAmbiente = listMoveis.filter((m) => m.ambienteId === amb.id);
            
            return (
              <div key={amb.id} className="space-y-6">
                {/* Cabeçalho do Ambiente */}
                <div className="flex items-center space-x-3 bg-slate-900/50 border border-slate-800/80 px-4 py-3 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/15">
                    <LayoutGrid className="w-4.5 h-4.5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white uppercase tracking-wider">{amb.nome}</h2>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {amb.id}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-blue-500/5 border-blue-500/20 text-blue-400 font-mono text-[10px] font-semibold px-2 py-0.5">
                    {moveisDoAmbiente.length} Módulos
                  </Badge>
                </div>

                {moveisDoAmbiente.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pl-4">Nenhum móvel cadastrado neste ambiente.</p>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {moveisDoAmbiente.map((mov) => {
                      const pecasDoMovel = listPecas.filter((p) => p.movelId === mov.id);

                      return (
                        <MovelCard key={mov.id} movel={mov} pecasIniciais={pecasDoMovel} />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Botão Simples reutilizável
function Button({ children, className, onClick, ...props }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold flex items-center justify-center transition-all focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
