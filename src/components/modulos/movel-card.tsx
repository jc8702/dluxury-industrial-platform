'use client';

import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Layers, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ValidationPanel from './validation-panel';
import { useRouter } from 'next/navigation';

interface PecasProps {
  id: string;
  nome: string;
  comprimento: string | number;
  largura: string | number;
  espessura: string | number;
  quantidade: string | number;
  materialNome: string | null;
}

interface MovelCardProps {
  movel: {
    id: string;
    nome: string;
    tipo: string | null;
    largura: string;
    altura: string;
    profundidade: string;
  };
  pecasIniciais: PecasProps[];
}

export default function MovelCard({ movel, pecasIniciais }: MovelCardProps) {
  const router = useRouter();
  const [showEnginePanel, setShowEnginePanel] = useState(false);
  const [pecas, setPecas] = useState<PecasProps[]>(pecasIniciais);

  // Quando o cálculo for efetuado com sucesso, damos um refresh no Server Component
  // para sincronizar o banco Neon com a tela em background de forma transparente.
  const handleCalculationSuccess = (pecasCalculadas: number) => {
    router.refresh();
  };

  return (
    <Card className="bg-[#1A1D24] border-slate-800 p-5 space-y-4 shadow-lg hover:border-slate-700/50 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center">
              <Package className="w-4 h-4 text-cyan-500 mr-2" />
              {movel.nome}
            </h3>
            <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-2">
              <span>TIPO: {movel.tipo || 'Módulo'}</span>
              <span>•</span>
              <span>MEDIDAS: {movel.largura}x{movel.altura}x{movel.profundidade}mm</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEnginePanel(!showEnginePanel)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold font-mono rounded-lg border transition-all ${
                showEnginePanel 
                  ? 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {showEnginePanel ? 'FECHAR DIAGNÓSTICO' : 'VER DIAGNÓSTICO'}
            </button>
            
            <Badge className="bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] font-semibold px-2 py-0.5">
              {pecasIniciais.length} PEÇAS
            </Badge>
          </div>
        </div>

        {/* Tabela Construtiva de Peças (BOM) */}
        {pecasIniciais.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-slate-850 bg-slate-900/10 rounded-xl">
            <p className="text-[11px] text-slate-500 font-mono italic">
              Nenhuma peça gerada. Use o Diagnóstico para recalcular o móvel.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-850 bg-slate-900/40">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-850 text-slate-500 font-mono font-bold">
                  <th className="py-2 px-3">PEÇA</th>
                  <th className="py-2 px-2 text-right">COMP (mm)</th>
                  <th className="py-2 px-2 text-right">LARG (mm)</th>
                  <th className="py-2 px-2 text-right">ESP (mm)</th>
                  <th className="py-2 px-2 text-right">QTD</th>
                  <th className="py-2 px-3">MATERIAL</th>
                </tr>
              </thead>
              <tbody>
                {pecasIniciais.map((peca) => (
                  <tr key={peca.id} className="border-b border-slate-850 hover:bg-slate-900/60 text-slate-300 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{peca.nome}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-400">{Math.round(Number(peca.comprimento))}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-400">{Math.round(Number(peca.largura))}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-400">{Math.round(Number(peca.espessura))}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-200 font-bold">{Math.round(Number(peca.quantidade))}</td>
                    <td className="py-2.5 px-3 truncate max-w-[120px] text-cyan-400/90 font-medium" title={peca.materialNome || ''}>
                      {peca.materialNome || 'MDF Padrão'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Painel do Engine expandido */}
      {showEnginePanel && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <ValidationPanel 
            movelId={movel.id} 
            nomeMovel={movel.nome} 
            onCalculationSuccess={handleCalculationSuccess}
          />
        </div>
      )}

      <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span>Sincronizado via SketchUp GUID</span>
        <span className="text-cyan-500 font-bold">Engenharia Construtiva</span>
      </div>
    </Card>
  );
}
