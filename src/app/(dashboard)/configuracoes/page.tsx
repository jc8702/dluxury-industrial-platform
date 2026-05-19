'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Settings, ShieldAlert, KeyRound, HardDrive, Factory, Building, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getEmpresaConfig, updateEmpresaConfig } from '@/actions/configuracoes';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'geral' | 'fabrica' | 'r2'>('geral');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const empresa = await getEmpresaConfig();
        if (empresa) {
          setRazaoSocial(empresa.razaoSocial || '');
          setCnpj(empresa.cnpj || '');
          setTenantId(empresa.id || '');
        }
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (activeTab !== 'geral') {
      setSuccessMsg('Configurações salvas localmente (mock).');
      setTimeout(() => setSuccessMsg(''), 2000);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateEmpresaConfig({ razaoSocial, cnpj });
      if (res.success) {
        setSuccessMsg('Conta da empresa atualizada com sucesso!');
        setTimeout(() => setSuccessMsg(''), 2500);
      } else {
        setErrorMsg(res.error || 'Erro ao salvar configurações.');
      }
    } catch (err) {
      setErrorMsg('Erro inesperado. Tente novamente.');
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
        <span className="text-slate-300 font-medium">Configurações</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
          <p className="text-slate-400 mt-1">Gerencie chaves R2, margens operacionais de fábrica, controle de acesso e tokens.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading || isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-semibold shadow-md shadow-blue-600/15 disabled:opacity-50"
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
        </button>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{errorMsg}</div>}
      {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg">{successMsg}</div>}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-4 space-y-1 h-fit">
          <button 
            onClick={() => setActiveTab('geral')}
            className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'geral' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
            }`}
          >
            <Building className="w-4 h-4 mr-3" /> Conta da Empresa
          </button>
          <button 
            onClick={() => setActiveTab('fabrica')}
            className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'fabrica' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
            }`}
          >
            <Factory className="w-4 h-4 mr-3" /> Parâmetros da Fábrica
          </button>
          <button 
            onClick={() => setActiveTab('r2')}
            className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'r2' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
            }`}
          >
            <HardDrive className="w-4 h-4 mr-3" /> Cloudflare R2 Cloud
          </button>
        </div>

        {/* Configurations Form Panel */}
        <div className="lg:col-span-3 bg-[#1A1D24] border border-slate-800 rounded-xl p-8 shadow-sm">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-12 text-slate-400">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
               <p>Carregando configurações...</p>
             </div>
          ) : activeTab === 'geral' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Informações do Tenant</h3>
                <p className="text-xs text-slate-400">Dados da empresa e identificador multitenancy exclusivo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Razão Social</label>
                  <input 
                    type="text" 
                    value={razaoSocial} 
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">CNPJ</label>
                  <input 
                    type="text" 
                    value={cnpj} 
                    onChange={(e) => setCnpj(e.target.value)}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Tenant ID (Global Unique Key)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly 
                      value={tenantId} 
                      className="w-full pl-4 pr-12 py-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-500 select-all focus:outline-none" 
                    />
                    <KeyRound className="w-4 h-4 text-slate-600 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fabrica' && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Calibração do Chão de Fábrica</h3>
                <p className="text-xs text-slate-400">Ajuste perdas de material, margens OEE e cálculos de corte paramétricos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Espessura do Disco da Serra (Kerf)</label>
                  <input type="text" defaultValue="4.2 mm" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Margem de Lucro Padrão (Orçamentos)</label>
                  <input type="text" defaultValue="35 %" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Tolerância de Esquadro</label>
                  <input type="text" defaultValue="15.0 mm" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Temperatura Homag Alerta OOE</label>
                  <input type="text" defaultValue="195 °C" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'r2' && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Armazenamento Cloudflare R2</h3>
                <p className="text-xs text-slate-400">Configure as chaves e buckets S3-compatíveis para hospedar chapas otimizadas e G-Codes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 mb-2">R2 Endpoint URL</label>
                  <input type="text" defaultValue="https://7e7811d7.r2.cloudflarestorage.com" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">R2 Bucket Name</label>
                  <input type="text" defaultValue="marcenai-production-files" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2">R2 Access Key ID</label>
                  <input type="password" placeholder="••••••••••••••••••••••••" className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono" />
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-start space-x-3 mt-8">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Atenção:</strong> Nunca exponha a R2 Secret Access Key no código frontend. O sistema MarcenAI utiliza chamadas seguras assinadas via Server Actions com validação de criptografia de ponta a ponta.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
