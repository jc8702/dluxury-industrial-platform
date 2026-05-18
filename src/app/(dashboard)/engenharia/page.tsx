'use client';

import React, { useState } from 'react';
import { ChevronRight, FileSpreadsheet, Plus, Search, Hammer, Layers, Settings, FileCheck2 } from 'lucide-react';
import Link from 'next/link';

export default function EngenhariaPage() {
  const [activeTab, setActiveTab] = useState<'bom' | 'materiais'>('bom');
  const [searchTerm, setSearchTerm] = useState('');

  const bomItems = [
    { id: '1', sku: 'MDF-BR-18', nome: 'MDF Branco Diamante 18mm', categoria: 'Chapas', qtd: '12', un: 'un', custo: 245.50 },
    { id: '2', sku: 'MDF-TX-06', nome: 'MDF Texturizado Grafite 6mm', categoria: 'Chapas', qtd: '4', un: 'un', custo: 185.00 },
    { id: '3', sku: 'FIT-AL-22', nome: 'Fita de Borda Alumínio 22x1mm', categoria: 'Fitas', qtd: '150', un: 'm', custo: 2.80 },
    { id: '4', sku: 'COR-OC-45', nome: 'Corrediça Oculta 45cm Slow', categoria: 'Ferragens', qtd: '24', un: 'par', custo: 68.90 },
    { id: '5', sku: 'DOB-CL-110', nome: 'Dobradiça Click 110º C/ Amortecedor', categoria: 'Ferragens', qtd: '96', un: 'un', custo: 12.40 },
  ];

  const filteredBom = bomItems.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Engenharia & BOM</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Engenharia & BOM</h1>
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20">
              V3.5 Paramétrico
            </span>
          </div>
          <p className="text-slate-400 mt-1">Gerencie a estrutura de produtos, Bill of Materials (BOM) e insumos industriais.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" /> Exportar CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15">
            <Plus className="w-4 h-4 mr-2" /> Novo Insumo
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Total de Componentes</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">1.240</h2>
          <span className="text-xs text-slate-500 mt-2 block">Peças ativas no banco de dados</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Custo Médio BOM</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <span className="text-emerald-400 font-semibold text-sm">R$</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">R$ 1.845,90</h2>
          <span className="text-xs text-emerald-400 mt-2 block">↓ -4.2% em relação ao trimestre anterior</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Fórmulas Paramétricas</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">84</h2>
          <span className="text-xs text-slate-500 mt-2 block">Variáveis dinâmicas ativas</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Taxa de Confiabilidade</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">99.8%</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Consistência com motor SketchUp</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 px-6 py-4 gap-4">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('bom')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'bom' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
              Lista de Insumos (BOM)
              {activeTab === 'bom' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('materiais')}
              className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'materiais' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
            >
              Variáveis Paramétricas
              {activeTab === 'materiais' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por SKU ou insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'bom' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Insumo</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold text-right">Qtd Disponível</th>
                    <th className="pb-3 font-semibold text-right">Custo Unitário</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredBom.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-all duration-150">
                      <td className="py-4 font-mono text-xs text-blue-400">{item.sku}</td>
                      <td className="py-4 font-medium text-slate-200">{item.nome}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-md text-xs">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium">{item.qtd} {item.un}</td>
                      <td className="py-4 text-right text-emerald-400 font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custo)}
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-slate-400 hover:text-white transition-colors text-xs font-semibold">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0F1115] border border-slate-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Hammer className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Chapa Base MDF 18mm</h4>
                    <p className="text-xs text-slate-400">Variáveis globais de espessura de corte</p>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">ALTURA_MAX</span>
                    <span className="text-blue-400">2750 mm</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">LARGURA_MAX</span>
                    <span className="text-blue-400">1840 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ESPESSURA_REAL</span>
                    <span className="text-blue-400">18.2 mm</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F1115] border border-slate-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <Settings className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Cálculo de Folga de Gaveta</h4>
                    <p className="text-xs text-slate-400">Regras de recuo para corrediças ocultas</p>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">FOLGA_LATERAL</span>
                    <span className="text-purple-400">13.0 mm</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">RECUO_TRASEIRA</span>
                    <span className="text-purple-400">10.0 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DESCONTO_PROFUNDIDADE</span>
                    <span className="text-purple-400">10.0 mm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
