'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, DollarSign, TrendingUp, Users, FileText, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getProjetosPorStatus, getResumoComercial } from '@/actions/comercial';

interface ProjetoComercial {
  id: string;
  nome: string;
  clienteNome: string;
  status: string;
  valorTotal: string | null;
  criadoEm: Date | null;
}

export default function ComercialPage() {
  const [activeTab, setActiveTab] = useState<'funil' | 'orcamentos'>('funil');
  const [projetos, setProjetos] = useState<ProjetoComercial[]>([]);
  const [resumo, setResumo] = useState({ totalProjetos: 0, valorTotal: 0, ticketMedio: 0 });
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const [dataProjetos, dataResumo] = await Promise.all([
        getProjetosPorStatus(),
        getResumoComercial(),
      ]);
      setProjetos(dataProjetos || []);
      setResumo(dataResumo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'orcamento': return 'Proposta Enviada';
      case 'aprovado': return 'Aprovado';
      case 'producao': return 'Em Produção';
      case 'finalizado': return 'Concluído';
      default: return st;
    }
  };

  const funilEstagios = ['orcamento', 'aprovado', 'producao', 'finalizado'];
  const funilLabels: Record<string, string> = {
    orcamento: 'Proposta Enviada',
    aprovado: 'Aprovado',
    producao: 'Em Produção',
    finalizado: 'Concluído',
  };

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Comercial & Vendas</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Comercial & Vendas</h1>
          <p className="text-slate-400 mt-1">Gerencie orçamentos industriais, leads de projetos de alto padrão e comissões.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Valor Total Pipeline</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(resumo.valorTotal)}</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Soma de todos os projetos ativos</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Total de Projetos</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{resumo.totalProjetos}</h2>
          <span className="text-xs text-slate-500 mt-2 block">No pipeline comercial</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Conversão</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><Users className="w-5 h-5 text-purple-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {resumo.totalProjetos > 0
              ? `${Math.round((projetos.filter(p => p.status === 'aprovado' || p.status === 'producao' || p.status === 'finalizado').length / resumo.totalProjetos) * 100)}%`
              : '---'}
          </h2>
          <span className="text-xs text-slate-500 mt-2 block">Projetos aprovados / total</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Ticket Médio</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><FileText className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{resumo.ticketMedio > 0 ? formatCurrency(resumo.ticketMedio) : '---'}</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Valor médio por projeto</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-800 px-6 py-4">
          <div className="flex space-x-6">
            <button onClick={() => setActiveTab('funil')} className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'funil' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              Funil de Vendas (CRM)
              {activeTab === 'funil' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('orcamentos')} className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'orcamentos' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              Propostas e Orçamentos
              {activeTab === 'orcamentos' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p>Carregando dados comerciais...</p>
            </div>
          ) : activeTab === 'funil' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {funilEstagios.map((estagio) => {
                const estagioLeads = projetos.filter(p => p.status === estagio);
                return (
                  <div key={estagio} className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <span className="text-sm font-semibold text-white">{funilLabels[estagio]}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{estagioLeads.length}</span>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {estagioLeads.map(lead => (
                        <div key={lead.id} className="bg-[#1A1D24] border border-slate-800 hover:border-slate-700 p-3 rounded-lg transition-colors cursor-pointer">
                          <h4 className="text-xs font-semibold text-white truncate">{lead.nome}</h4>
                          <span className="text-[10px] text-slate-500 block mt-1">{lead.clienteNome}</span>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {lead.criadoEm ? new Date(lead.criadoEm).toLocaleDateString('pt-BR') : '---'}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              {lead.valorTotal ? formatCurrency(parseFloat(lead.valorTotal)) : 'Sob orçamento'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {estagioLeads.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-lg p-6">
                          Nenhum projeto neste estágio
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            projetos.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-slate-400">Nenhum orçamento encontrado</p>
                <p className="text-sm mt-1">Crie projetos no módulo Projetos para vê-los aqui no pipeline comercial.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="pb-3 font-semibold">Projeto</th>
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Data</th>
                      <th className="pb-3 font-semibold text-right">Valor Total</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {projetos.map((orc) => (
                      <tr key={orc.id} className="hover:bg-slate-800/20 transition-all duration-150">
                        <td className="py-4 font-medium text-slate-200">{orc.nome}</td>
                        <td className="py-4 text-slate-400">{orc.clienteNome}</td>
                        <td className="py-4 text-slate-400 font-mono text-xs">
                          {orc.criadoEm ? new Date(orc.criadoEm).toLocaleDateString('pt-BR') : '---'}
                        </td>
                        <td className="py-4 text-right text-emerald-400 font-bold">
                          {orc.valorTotal ? formatCurrency(parseFloat(orc.valorTotal)) : 'Sob orçamento'}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            orc.status === 'aprovado' || orc.status === 'finalizado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            orc.status === 'producao' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {getStatusLabel(orc.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
