'use client';

import React, { useState } from 'react';
import { ChevronRight, Users, UserPlus, Heart, BookOpen, Star, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: 'CLI-001', nome: 'D\'Luxury Residences', tipo: 'Construtora', email: 'contato@dluxury.com', fone: '(11) 98765-4321', projetos: 4, status: 'Ativo' },
    { id: 'CLI-002', nome: 'Edson Arantes do Nascimento', tipo: 'Pessoa Física', email: 'edson.arantes@gmail.com', fone: '(11) 99999-1010', projetos: 2, status: 'Ativo' },
    { id: 'CLI-003', nome: 'Clara M. Nogueira', tipo: 'Arquiteto', email: 'clara@arquitetura.com', fone: '(19) 98822-4455', projetos: 1, status: 'Ativo' },
    { id: 'CLI-004', nome: 'Gafisa S.A. Corporate', tipo: 'Construtora', email: 'infra@gafisa.com.br', fone: '(11) 3003-4500', projetos: 3, status: 'Inativo' },
  ];

  const filteredClients = clients.filter(cli => 
    cli.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cli.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cli.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Clientes</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Clientes</h1>
          <p className="text-slate-400 mt-1">Gerencie a carteira de construtoras, arquitetos parceiros e clientes finais.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">
            <Filter className="w-4 h-4 mr-2" /> Segmentação
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15">
            <UserPlus className="w-4 h-4 mr-2" /> Adicionar Cliente
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Clientes Ativos</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">142</h2>
          <span className="text-xs text-emerald-400 mt-2 block">↑ 8 novos adicionados este mês</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Parceiros Estratégicos</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">28 Arquitetos</h2>
          <span className="text-xs text-slate-500 mt-2 block">Responsáveis por 65% das vendas</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Projetos por Cliente</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">2.4 <span className="text-sm font-medium text-slate-500">Projetos</span></h2>
          <span className="text-xs text-slate-500 mt-2 block">Taxa de recorrência de compras</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Média NPS</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">9.6 <span className="text-sm font-medium text-slate-500">/ 10</span></h2>
          <span className="text-xs text-emerald-400 mt-2 block">Zona de Excelência Industrial</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 px-6 py-4 gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, e-mail ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">Cód Cliente</th>
                <th className="pb-3 font-semibold">Nome / Razão Social</th>
                <th className="pb-3 font-semibold">Tipo</th>
                <th className="pb-3 font-semibold">E-mail</th>
                <th className="pb-3 font-semibold">Telefone</th>
                <th className="pb-3 font-semibold text-center">Projetos</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredClients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-800/20 transition-all duration-150">
                  <td className="py-4 font-mono text-xs text-blue-400">{cli.id}</td>
                  <td className="py-4 font-medium text-slate-200">{cli.nome}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      cli.tipo === 'Construtora' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      cli.tipo === 'Arquiteto' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {cli.tipo}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{cli.email}</td>
                  <td className="py-4 text-slate-400 font-mono text-xs">{cli.fone}</td>
                  <td className="py-4 text-center font-mono text-slate-300 font-semibold">{cli.projetos}</td>
                  <td className="py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      cli.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {cli.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
