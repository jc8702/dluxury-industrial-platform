'use client';

import React, { useState, useTransition } from 'react';
import { toggleTenantStatus, updateTenantPlan } from '@/actions/admin';
import { Building2, Search, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TenantData {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  ativo: boolean;
  plano: string;
}

export default function TenantsManager({ initialTenants }: { initialTenants: TenantData[] }) {
  const [tenants, setTenants] = useState<TenantData[]>(initialTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtragem local baseada na caixa de busca
  const filteredTenants = tenants.filter(t => 
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cnpj.includes(searchTerm)
  );

  // Ação para inverter o status ativo da empresa inquilina
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    
    startTransition(async () => {
      const res = await toggleTenantStatus(id, currentStatus);
      if (res.success) {
        setTenants(prev => prev.map(t => t.id === id ? { ...t, ativo: !currentStatus } : t));
        setSuccessMessage(`Status da marca atualizado com sucesso!`);
      } else {
        setErrorMessage(res.error || 'Erro desconhecido ao alterar status.');
      }
    });
  };

  // Ação para alterar o plano corporativo do Tenant
  const handlePlanChange = (id: string, newPlan: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await updateTenantPlan(id, newPlan);
      if (res.success) {
        setTenants(prev => prev.map(t => t.id === id ? { ...t, plano: newPlan } : t));
        setSuccessMessage(`Plano corporativo atualizado para ${newPlan.toUpperCase()}!`);
      } else {
        setErrorMessage(res.error || 'Erro desconhecido ao alterar plano.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Feedbacks de Sucesso ou Erro na parte superior */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Barra de Ações com Filtro de Busca */}
      <div className="flex items-center gap-4 bg-[#0D1016] border border-slate-900 rounded-xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar marcas industriais por nome ou CNPJ..."
            className="w-full bg-[#07090C] border border-slate-900 hover:border-slate-800 focus:border-cyan-600 focus:outline-none text-slate-200 placeholder-slate-600 rounded-lg pl-10 pr-4 py-2 text-xs transition-all"
          />
        </div>

        {isPending && (
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10px] uppercase tracking-wider animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>SINCRONIZANDO NEON...</span>
          </div>
        )}
      </div>

      {/* Grid de Listagem Brutalista das Marcas */}
      {filteredTenants.length === 0 ? (
        <Card className="bg-[#0D1016] border-slate-900 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-8 h-8 text-slate-700 animate-bounce" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Nenhum Tenant Encontrado</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-relaxed">
              Nenhuma empresa inquilina corresponde ao filtro informado na barra superior.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTenants.map((tenant) => (
            <Card
              key={tenant.id}
              className={`bg-[#0D1016] p-6 hover:border-cyan-500/10 transition-all border relative flex flex-col justify-between ${
                tenant.ativo ? 'border-slate-900' : 'border-red-500/20'
              }`}
            >
              {!tenant.ativo && (
                <div className="absolute top-3 right-3 text-red-500 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 bg-red-950/20 border border-red-500/20 rounded-md">
                  SUSPENSO
                </div>
              )}

              {/* Informações da Empresa */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                      {tenant.nome}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-semibold font-mono tracking-wider">
                      {tenant.razaoSocial}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-[9px] text-slate-400 font-semibold">
                  <p>CNPJ: <span className="text-slate-300 font-mono">{tenant.cnpj}</span></p>
                  <p>ID INTERNO: <span className="text-slate-500 font-mono text-[8px]">{tenant.id}</span></p>
                </div>
              </div>

              {/* Controles de Status e Plano */}
              <div className="mt-6 border-t border-slate-900/60 pt-4 space-y-4">
                {/* Seleção de Plano Brutalista */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Plano Ativo
                  </span>
                  <div className="flex bg-[#07090C] border border-slate-900 rounded-lg p-0.5">
                    {['starter', 'pro', 'enterprise'].map((plan) => (
                      <button
                        key={plan}
                        onClick={() => handlePlanChange(tenant.id, plan)}
                        disabled={isPending}
                        className={`px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                          tenant.plano === plan
                            ? 'bg-cyan-950/20 border border-cyan-500/20 text-cyan-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleToggleStatus(tenant.id, tenant.ativo)}
                    disabled={isPending}
                    className={`w-full text-[9px] font-black uppercase tracking-wider py-2 rounded-lg cursor-pointer transition-all border ${
                      tenant.ativo
                        ? 'bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/30'
                        : 'bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-400 hover:text-emerald-300 border-emerald-500/20 hover:border-emerald-500/30'
                    }`}
                  >
                    {tenant.ativo ? 'SUSPENDER INQUILINO' : 'REATIVAR INQUILINO'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
