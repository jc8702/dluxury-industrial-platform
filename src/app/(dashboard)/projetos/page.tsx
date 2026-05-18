'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, FolderOpen, Layers, HardDrive, Layout, Plus, Search, Filter, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getProjetos, createProjeto } from '@/actions/projetos';
import { getClientes } from '@/actions/clientes';

interface Projeto {
  id: string;
  nome: string;
  clienteId: string;
  clienteNome: string;
  status: string;
  valorTotal: string | null;
  dataEntrega: Date | null;
  notas: string | null;
  criadoEm: Date | null;
}

interface Cliente {
  id: string;
  nome: string;
}

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [status, setStatus] = useState('orcamento');
  const [valorTotal, setValorTotal] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [notas, setNotas] = useState('');

  // Carrega projetos e clientes
  async function loadData() {
    setIsLoading(true);
    try {
      const dataProjetos = await getProjetos(searchTerm);
      setProjects(dataProjetos || []);
      
      const dataClientes = await getClientes();
      setClients(dataClientes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !clienteId) {
      setErrorMsg('O nome do projeto e o cliente são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createProjeto({
        nome,
        clienteId,
        status,
        valorTotal: valorTotal ? parseFloat(valorTotal) : undefined,
        dataEntrega: dataEntrega ? new Date(dataEntrega) : undefined,
        notas: notas || undefined,
      });

      if (res.success) {
        setSuccessMsg('Projeto criado com sucesso!');
        setNome('');
        setClienteId('');
        setStatus('orcamento');
        setValorTotal('');
        setDataEntrega('');
        setNotas('');
        loadData(); // Recarrega lista
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Erro ao criar projeto.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'orcamento': return 'Orçamento';
      case 'aprovado': return 'Aprovado';
      case 'producao': return 'Pronto p/ CNC';
      case 'finalizado': return 'Concluído';
      default: return st;
    }
  };

  const getGradientColor = (index: number) => {
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-orange-600 to-red-600'
    ];
    return colors[index % colors.length];
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15"
          >
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
          <h2 className="text-3xl font-bold text-white tracking-tight">{projects.length}</h2>
          <span className="text-xs text-slate-500 mt-2 block">Sincronizados com o banco Neon Postgres</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Clientes Vinculados</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{clients.length} Clientes</h2>
          <span className="text-xs text-slate-500 mt-2 block">Carteira ativa do Tenant</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Espaço R2 Utilizado</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <HardDrive className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Real-Time</h2>
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

      {/* Projects Container */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p>Carregando projetos do Neon Postgres...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium text-slate-400">Nenhum projeto cadastrado</p>
          <p className="text-sm mt-1">Crie um novo projeto ou sincronize através do plugin SketchUp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((prj, index) => (
            <div key={prj.id} className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
              {/* Visual Header Placeholder */}
              <div className={`h-36 bg-gradient-to-tr ${getGradientColor(index)} p-4 flex flex-col justify-between relative`}>
                <div className="absolute inset-0 bg-[#0F1115]/20 backdrop-blur-[1px]"></div>
                <span className="px-2 py-0.5 bg-black/40 border border-white/10 text-white rounded text-[10px] font-mono font-medium tracking-wide z-10 w-fit">
                  PROJETO
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
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">{prj.clienteNome}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs text-slate-500">Valor Estimado</span>
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {prj.valorTotal ? `R$ ${parseFloat(prj.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob orçamento'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Criado em</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {prj.criadoEm ? new Date(prj.criadoEm).toLocaleDateString('pt-BR') : '---'}
                    </span>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    prj.status === 'producao' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    prj.status === 'orcamento' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    prj.status === 'finalizado' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {getStatusLabel(prj.status)}
                  </span>
                  <Link href={`/projetos/${prj.id}`} className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Abrir Detalhes →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Customizado de Projetos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Criar Novo Projeto</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Cozinha Planejada Gourmet"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cliente <span className="text-red-500">*</span>
                </label>
                {clients.length === 0 ? (
                  <div className="p-2 border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs">
                    Nenhum cliente cadastrado no Neon Postgres! Cadastre um cliente primeiro no módulo "Clientes" antes de registrar um projeto.
                  </div>
                ) : (
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">-- Selecione o Cliente --</option>
                    {clients.map((cli) => (
                      <option key={cli.id} value={cli.id}>{cli.nome}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Status Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="orcamento">Orçamento</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="producao">Pronto p/ CNC</option>
                    <option value="finalizado">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Valor Estimado (R$)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={valorTotal}
                    onChange={(e) => setValorTotal(e.target.value)}
                    placeholder="Ex: 15400.00"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Data Limite de Entrega
                </label>
                <input 
                  type="date" 
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Notas Construtivas / Observações
                </label>
                <textarea 
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalhamento paramétrico e acabamentos solicitados pelo cliente..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || clients.length === 0}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                    </>
                  ) : (
                    'Criar Projeto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
