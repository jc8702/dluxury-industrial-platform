'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, UserPlus, Heart, BookOpen, Star, Search, Filter, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getClientes, createCliente } from '@/actions/clientes';

interface Cliente {
  id: string;
  nome: string;
  documento: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  // Carrega clientes do banco
  async function loadClientes() {
    setIsLoading(true);
    try {
      const data = await getClientes(searchTerm);
      setClients(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadClientes();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('O nome do cliente é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createCliente({
        nome,
        documento: documento || undefined,
        email: email || undefined,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
      });

      if (res.success) {
        setSuccessMsg('Cliente cadastrado com sucesso!');
        setNome('');
        setDocumento('');
        setEmail('');
        setTelefone('');
        setEndereco('');
        loadClientes(); // Recarrega lista
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Erro ao salvar cliente.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15"
          >
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
          <h2 className="text-3xl font-bold text-white tracking-tight">{clients.length}</h2>
          <span className="text-xs text-emerald-400 mt-2 block">↑ Sincronizados com banco Neon Postgres</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Parceiros Estratégicos</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Ativos</h2>
          <span className="text-xs text-slate-500 mt-2 block">Isolamento multi-tenant ativado</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Projetos por Cliente</h3>
            <div className="p-2 bg-slate-800/50 rounded-md">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Real-Time</h2>
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
              placeholder="Pesquisar por nome, e-mail ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p>Buscando clientes no Neon Postgres...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium text-slate-400">Nenhum cliente cadastrado</p>
              <p className="text-sm mt-1">Clique em "Adicionar Cliente" para registrar o primeiro cliente desta empresa.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Cód ID</th>
                  <th className="pb-3 font-semibold">Nome / Razão Social</th>
                  <th className="pb-3 font-semibold">Documento</th>
                  <th className="pb-3 font-semibold">E-mail</th>
                  <th className="pb-3 font-semibold">Telefone</th>
                  <th className="pb-3 font-semibold">Endereço</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {clients.map((cli) => (
                  <tr key={cli.id} className="hover:bg-slate-800/20 transition-all duration-150">
                    <td className="py-4 font-mono text-xs text-blue-400 max-w-[120px] truncate" title={cli.id}>{cli.id}</td>
                    <td className="py-4 font-medium text-slate-200">{cli.nome}</td>
                    <td className="py-4 font-mono text-xs text-slate-400">{cli.documento || '---'}</td>
                    <td className="py-4 text-slate-400">{cli.email || '---'}</td>
                    <td className="py-4 text-slate-400 font-mono text-xs">{cli.telefone || '---'}</td>
                    <td className="py-4 text-slate-400 max-w-[200px] truncate" title={cli.endereco || ''}>{cli.endereco || '---'}</td>
                    <td className="py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Modal Customizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Cadastrar Novo Cliente</h3>
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
                  Nome / Razão Social <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Edson Arantes do Nascimento"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Documento (CPF / CNPJ)
                </label>
                <input 
                  type="text" 
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="Ex: 000.000.000-00"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@email.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Telefone
                  </label>
                  <input 
                    type="text" 
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Endereço Completo
                </label>
                <textarea 
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
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
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                    </>
                  ) : (
                    'Salvar Cliente'
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
