'use client';

import React, { useState } from 'react';
import { ChevronRight, Wrench, Play, CheckCircle2, AlertCircle, Clock, Percent, Cpu, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ProducaoPage() {
  const [activeTab, setActiveTab] = useState<'ops' | 'maquinas'>('ops');

  const orders = [
    { id: 'OP-2026-081', cliente: 'D\'Luxury Residences', moveis: 'Cozinha Planejada + Closet', pecas: 240, progresso: 65, status: 'Em Produção' },
    { id: 'OP-2026-082', cliente: 'Marcenaria Central', moveis: 'Painel Home Theater', pecas: 45, progresso: 100, status: 'Concluído' },
    { id: 'OP-2026-083', cliente: 'Ronaldo V. Santos', moveis: 'Dormitório Casal MDF Grafite', pecas: 112, progresso: 15, status: 'Corte Inicial' },
    { id: 'OP-2026-084', cliente: 'Construtora Sollus', moveis: 'Portas Internas Paramétricas', pecas: 320, progresso: 0, status: 'Aguardando Insumo' },
  ];

  const maquinas = [
    { nome: 'Seccionadora Vertical Giben', status: 'Operando', oee: 88, temperatura: '38°C', pecasHora: 42 },
    { nome: 'Coladeira de Bordas Homag', status: 'Manutenção', oee: 54, temperatura: '185°C (Cola)', pecasHora: 0 },
    { nome: 'Router CNC de Furação nesting', status: 'Operando', oee: 92, temperatura: '42°C', pecasHora: 65 },
  ];

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Produção & CNC</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Produção & CNC</h1>
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/20 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Fábrica Conectada
            </span>
          </div>
          <p className="text-slate-400 mt-1">Monitore ordens de produção, arquivos G-Code para CNC e a eficiência das máquinas em tempo real.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">
            <RefreshCw className="w-4 h-4 mr-2" /> Recarregar OEE
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">OEE Médio Fabril</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Percent className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">78.4%</h2>
          <span className="text-xs text-emerald-400 mt-2 block">↑ +2.1% em relação a ontem</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Peças Cortadas Hoje</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Wrench className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">642 <span className="text-sm font-medium text-slate-500">/ 800</span></h2>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Maquinário Ativo</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">2 <span className="text-sm font-medium text-slate-500">de 3</span></h2>
          <span className="text-xs text-orange-400 mt-2 block">Giben Homag em manutenção</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Atraso de Cronograma</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">0m 0s</h2>
          <span className="text-xs text-emerald-400 mt-2 block">100% dos lotes no prazo</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Toggle navigation tabs */}
        <div className="flex border-b border-slate-800 px-6 py-4">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('ops')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'ops' ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}
            >
              Ordens de Produção (OP)
              {activeTab === 'ops' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('maquinas')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'maquinas' ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}
            >
              Maquinário e Integrações CNC
              {activeTab === 'maquinas' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
            </button>
          </div>
        </div>

        {/* Tab content wrapper */}
        <div className="p-6">
          {activeTab === 'ops' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="pb-3 font-semibold">Cód OP</th>
                    <th className="pb-3 font-semibold">Cliente</th>
                    <th className="pb-3 font-semibold">Descrição do Mobiliário</th>
                    <th className="pb-3 font-semibold text-right">Lote Peças</th>
                    <th className="pb-3 font-semibold text-center">Progresso</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/20 transition-all duration-150">
                      <td className="py-4 font-mono text-xs text-orange-400">{order.id}</td>
                      <td className="py-4 font-medium text-slate-200">{order.cliente}</td>
                      <td className="py-4 text-slate-400">{order.moveis}</td>
                      <td className="py-4 text-right font-medium">{order.pecas} peças</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center space-x-2 max-w-[120px] mx-auto">
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${order.progresso}%` }}></div>
                          </div>
                          <span className="text-xs font-mono font-medium">{order.progresso}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          order.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          order.status === 'Em Produção' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          order.status === 'Corte Inicial' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {maquinas.map((maquina) => (
                <div key={maquina.nome} className="bg-[#0F1115] border border-slate-800 p-6 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-semibold text-white text-base">{maquina.nome}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${maquina.status === 'Operando' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                        <span className="text-xs text-slate-400">{maquina.status}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 font-mono text-slate-300">
                      OEE: {maquina.oee}%
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                    <div className="flex justify-between">
                      <span>Temperatura</span>
                      <span className="text-slate-200">{maquina.temperatura}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendimento Atual</span>
                      <span className="text-orange-400">{maquina.pecasHora} peças / hora</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                      <Play className="w-3.5 h-3.5 mr-1.5 text-orange-400" /> Iniciar Lote
                    </button>
                    {maquina.status === 'Manutenção' ? (
                      <button className="px-3 flex items-center justify-center py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold rounded-lg border border-red-500/20 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="px-3 flex items-center justify-center py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold rounded-lg border border-emerald-500/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
