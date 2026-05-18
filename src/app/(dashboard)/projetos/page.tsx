'use client';

import React, { useState } from 'react';
import { ChevronRight, FolderOpen, Layers, HardDrive, Layout, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    { id: 'PRJ-001', nome: 'Cozinha Gourmet Paramétrica', cliente: 'D\'Luxury Residences', data: '18 Mai 2026', pecas: 145, status: 'Pronto p/ CNC', color: 'from-blue-600 to-indigo-600' },
    { id: 'PRJ-002', nome: 'Closet Master Glass', cliente: 'Edson Arantes', data: '15 Mai 2026', pecas: 98, status: 'Em Modelagem', color: 'from-purple-600 to-pink-600' },
    { id: 'PRJ-003', nome: 'Home Office Integrado', cliente: 'Clara M. Nogueira', data: '12 Mai 2026', pecas: 45, status: 'Concluído', color: 'from-emerald-600 to-teal-600' },
    { id: 'PRJ-004', nome: 'Painel Ripado Recepção', cliente: 'Gafisa S.A.', data: '05 Mai 2026', pecas: 320, status: 'Aguardando Aprovação', color: 'from-orange-600 to-red-600' },
  ];

  const filteredProjects = projects.filter(prj => 
    prj.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prj.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prj.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Projetos</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Biblioteca de Projetos</h1>
          <p className="text-slate-400 mt-1">Gerencie e visualize projetos paramétricos e arquivos integrados com o plugin SketchUp.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">
            <Filter className="w-4 h-4 mr-2" /> Filtrar Status
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15">
            <Plus className="w-4 h-4 mr-2" /> Novo Projeto
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Projetos Ativos</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">12</h2>
          <span className="text-xs text-slate-500 mt-2 block">Em desenvolvimento ou produção</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Total de Peças Cadastradas</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">608 Peças</h2>
          <span className="text-xs text-slate-500 mt-2 block">Processadas pelo motor de cálculo</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Espaço R2 Utilizado</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <HardDrive className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">4.2 GB</h2>
          <span className="text-xs text-slate-500 mt-2 block">Arquivos 3D e G-Code salvos</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Taxa de Otimização</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Layout className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">94.8%</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Aproveitamento de chapas (Nest)</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-8 bg-[#1A1D24] p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Pesquisar projetos pelo ID, nome ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProjects.map((prj) => (
          <div key={prj.id} className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
            {/* Visual Header Placeholder */}
            <div className={`h-36 bg-gradient-to-tr ${prj.color} p-4 flex flex-col justify-between relative`}>
              <div className="absolute inset-0 bg-[#0F1115]/20 backdrop-blur-[1px]"></div>
              <span className="px-2 py-0.5 bg-black/40 border border-white/10 text-white rounded text-[10px] font-mono font-medium tracking-wide z-10 w-fit">
                {prj.id}
              </span>
              <div className="z-10 mt-auto">
                <h4 className="font-bold text-white text-base truncate drop-shadow-md">{prj.nome}</h4>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-500">Cliente</span>
                  <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">{prj.cliente}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-500">Qtd Peças</span>
                  <span className="text-xs font-mono font-semibold text-slate-300">{prj.pecas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Atualizado</span>
                  <span className="text-xs font-semibold text-slate-300">{prj.data}</span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  prj.status === 'Pronto p/ CNC' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  prj.status === 'Em Modelagem' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  prj.status === 'Concluído' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {prj.status}
                </span>
                <span className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Abrir Detalhes →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
