'use client';

import React, { useState } from 'react';
import { QrCode, Printer, FileDown, Cog, CheckCircle2 } from 'lucide-react';
import { ProductionWorkflow, ProductionStatus } from '../domain/workflow';

// Tipagem mockada para a UI
interface ViewPart {
  id: string;
  nome: string;
  dimensoes: string;
  status: ProductionStatus;
}

export function ProductionDashboard() {
  const [pecas, setPecas] = useState<ViewPart[]>([
    { id: '101', nome: 'Lateral Direita', dimensoes: '720 x 550 x 15', status: 'corte' },
    { id: '102', nome: 'Base Inferior', dimensoes: '800 x 550 x 15', status: 'borda' },
    { id: '103', nome: 'Porta Frontal', dimensoes: '715 x 395 x 18', status: 'aguardando' },
  ]);

  const handleScan = (partId: string) => {
    // Simula a leitura de um Scanner de Código de Barras / QRCode na fábrica
    setPecas(current => 
      current.map(p => {
        if (p.id === partId) {
          const nextStatusMap: Record<ProductionStatus, ProductionStatus> = {
            'aguardando': 'corte',
            'corte': 'borda',
            'borda': 'furo',
            'furo': 'montagem',
            'montagem': 'expedicao',
            'expedicao': 'expedicao'
          };
          return { ...p, status: nextStatusMap[p.status] };
        }
        return p;
      })
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Chão de Fábrica (PCP)</h1>
          <p className="text-slate-400 mt-1">Gestão de rastreabilidade, impressão de etiquetas e controle CNC.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700">
            <FileDown className="w-4 h-4 mr-2 text-emerald-400" /> Baixar Plano Corte (CSV)
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700">
            <Cog className="w-4 h-4 mr-2 text-blue-400" /> Exportar GCODE
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors shadow-lg shadow-blue-900/20">
            <Printer className="w-4 h-4 mr-2" /> Imprimir Lote de Etiquetas
          </button>
        </div>
      </div>

      {/* Tabela Industrial */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#14161A] border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">ID (Barcode)</th>
              <th className="px-6 py-4 font-medium">Nome da Peça</th>
              <th className="px-6 py-4 font-medium">Dimensões (mm)</th>
              <th className="px-6 py-4 font-medium">Estágio de Produção</th>
              <th className="px-6 py-4 font-medium text-right">Ação Operador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {pecas.map((peca) => (
              <tr key={peca.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-400">{peca.id}</td>
                <td className="px-6 py-4 font-medium text-slate-200">{peca.nome}</td>
                <td className="px-6 py-4">{peca.dimensoes}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    peca.status === 'corte' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    peca.status === 'borda' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    peca.status === 'furo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    peca.status === 'montagem' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    {peca.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleScan(peca.id)}
                    className="inline-flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                    title="Simular Leitura Óptica"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
