'use client';

import React, { useState } from 'react';
import { ChevronRight, DollarSign, TrendingUp, TrendingDown, Users, FileText, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ComercialPage() {
  const [activeTab, setActiveTab] = useState<'funil' | 'orcamentos'>('funil');

  const funilLeads = [
    { id: '1', nome: 'Residencial Alphaville (Edson)', estagio: 'Proposta Enviada', valor: 85000, empresa: 'Pessoa Física' },
    { id: '2', nome: 'Retrofit Escritório Comercial', estagio: 'Negociação', valor: 142000, empresa: 'D\'Luxury Corporate' },
    { id: '3', nome: 'Armários Cozinha C/ Iluminação', estagio: 'Visita Técnica', valor: 35400, empresa: 'Clara M. Nogueira' },
    { id: '4', nome: 'Móveis Corporativos Construtora', estagio: 'Lead Qualificado', valor: 420000, empresa: 'Gafisa S.A.' },
  ];

  const orcamentosRecentes = [
    { id: 'ORC-2026-004', cliente: 'Edson Arantes', data: '15 Mai 2026', total: 85000, status: 'Aprovado' },
    { id: 'ORC-2026-003', cliente: 'Clara M. Nogueira', data: '12 Mai 2026', total: 35400, status: 'Aprovado' },
    { id: 'ORC-2026-002', cliente: 'D\'Luxury Corporate', data: '10 Mai 2026', total: 142000, status: 'Em Negociação' },
    { id: 'ORC-2026-001', cliente: 'Gafisa S.A.', data: '05 Mai 2026', total: 420000, status: 'Aguardando' },
  ];

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Comercial & Vendas</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Comercial & Vendas</h1>
          <p className="text-slate-400 mt-1">Gerencie orçamentos industriais, leads de projetos de alto padrão e comissões.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15">
            <Plus className="w-4 h-4 mr-2" /> Novo Orçamento
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Valor em Negociação</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">R$ 682,4k</h2>
          <div className="flex items-center mt-2 text-emerald-400 font-medium text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>↑ 12% vs mês ant.</span>
          </div>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Faturamento Efetuado</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">R$ 120,4k</h2>
          <span className="text-xs text-slate-500 mt-2 block">Referente a OPs faturadas</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Conversão de Leads</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">34.2%</h2>
          <div className="flex items-center mt-2 text-red-400 font-medium text-xs">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span>↓ -1.5% vs mês ant.</span>
          </div>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Ticket Médio</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">R$ 54,2k</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Projetos residenciais e comerciais</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-800 px-6 py-4">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('funil')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'funil' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              Funil de Vendas (CRM)
              {activeTab === 'funil' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('orcamentos')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'orcamentos' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              Propostas e Orçamentos Recentes
              {activeTab === 'orcamentos' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'funil' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Lead Qualificado', 'Visita Técnica', 'Proposta Enviada', 'Negociação'].map((estagio) => {
                const estagioLeads = funilLeads.filter(lead => lead.estagio === estagio);
                return (
                  <div key={estagio} className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <span className="text-sm font-semibold text-white">{estagio}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {estagioLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {estagioLeads.map(lead => (
                        <div key={lead.id} className="bg-[#1A1D24] border border-slate-800 hover:border-slate-700 p-3 rounded-lg transition-colors cursor-pointer">
                          <h4 className="text-xs font-semibold text-white truncate">{lead.nome}</h4>
                          <span className="text-[10px] text-slate-500 block mt-1">{lead.empresa}</span>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400 font-mono">ID: {lead.id}</span>
                            <span className="text-xs font-bold text-emerald-400">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.valor)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {estagioLeads.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-lg p-6">
                          Nenhum lead aqui
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="pb-3 font-semibold">Código</th>
                    <th className="pb-3 font-semibold">Cliente</th>
                    <th className="pb-3 font-semibold">Data Envio</th>
                    <th className="pb-3 font-semibold text-right">Valor Total</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {orcamentosRecentes.map((orc) => (
                    <tr key={orc.id} className="hover:bg-slate-800/20 transition-all duration-150">
                      <td className="py-4 font-mono text-xs text-blue-400">{orc.id}</td>
                      <td className="py-4 font-medium text-slate-200">{orc.cliente}</td>
                      <td className="py-4 text-slate-400">{orc.data}</td>
                      <td className="py-4 text-right text-emerald-400 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.total)}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          orc.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          orc.status === 'Em Negociação' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {orc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
