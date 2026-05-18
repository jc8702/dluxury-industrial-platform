import React from 'react';
import { db } from "@/db";
import { sql, desc } from "drizzle-orm";
import { empresas, projetos, pecas, documentosTecnicos, usuarios } from "@/db/schema";
import { Building2, Layers, ShieldCheck, FileSpreadsheet, PlusCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Forçar renderização dinâmica para sempre puxar as métricas reais atualizadas do Neon
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Executar as consultas agregadas de faturamento e volumetria do banco Neon de forma assíncrona
  const [
    tenantCountResult,
    projetoCountResult,
    pecaCountResult,
    docsCountResult,
    recentTenants,
    recentUsers
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(empresas),
    db.select({ count: sql<number>`count(*)` }).from(projetos),
    db.select({ count: sql<number>`count(*)` }).from(pecas),
    db.select({ count: sql<number>`count(*)` }).from(documentosTecnicos),
    db.select().from(empresas).orderBy(desc(empresas.createdAt)).limit(5),
    db.select().from(usuarios).orderBy(desc(usuarios.createdAt)).limit(5)
  ]);

  const totalTenants = tenantCountResult[0]?.count || 0;
  const totalProjetos = projetoCountResult[0]?.count || 0;
  const totalPecas = pecaCountResult[0]?.count || 0;
  const totalDocs = docsCountResult[0]?.count || 0;

  // Faturamento fictício recorrente (MRR) calculado: plano starter = R$299, pro = R$599, enterprise = R$1299
  const mrrEstimado = recentTenants.reduce((acc, t) => {
    if (t.plano === 'pro') return acc + 599;
    if (t.plano === 'enterprise') return acc + 1299;
    return acc + 299;
  }, 0) * (totalTenants / 5 || 1);

  return (
    <div className="space-y-8 font-mono">
      {/* Título de Seção e Mensagem de Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-500 animate-pulse" />
            Métricas Globais da Plataforma SaaS
          </h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wider">
            RELATÓRIO CONSOLIDADO DO BANCO NEON SERVERLESS
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#0D1016] border border-cyan-500/20 rounded-lg flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[10px] font-extrabold text-cyan-400">NEON DATABASE ONLINE</span>
        </div>
      </div>

      {/* Grid de Métricas Principais Brutalistas Dark Ciano */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR Estimado */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              MRR SaaS Geral
            </span>
            <Building2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-xl font-black text-white">
              R$ {mrrEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[8px] text-cyan-500/80 font-bold uppercase tracking-wider">
              Receita Recorrente Mensal
            </p>
          </div>
        </Card>

        {/* Total Tenants */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Inquilinos (Tenants)
            </span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-black text-white">
              {totalTenants}
            </div>
            <p className="text-[8px] text-cyan-500/80 font-bold uppercase tracking-wider">
              Marcas Industriais Ativas
            </p>
          </div>
        </Card>

        {/* Projetos Criados */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Projetos Totais
            </span>
            <FileSpreadsheet className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-black text-white">
              {totalProjetos}
            </div>
            <p className="text-[8px] text-cyan-500/80 font-bold uppercase tracking-wider">
              Explodidos por Marceneiros
            </p>
          </div>
        </Card>

        {/* Manuais RAG */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Manuais Vetorizados
            </span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-black text-white">
              {totalDocs}
            </div>
            <p className="text-[8px] text-cyan-500/80 font-bold uppercase tracking-wider">
              Disponíveis no RAG da IA
            </p>
          </div>
        </Card>
      </div>

      {/* Grid de Detalhamento Tabular e Listagens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabela de Empresas Ativas (Tenants) */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Novas Marcas de Marcenaria (Tenants)
            </h3>
            <span className="text-[9px] text-cyan-400 font-bold">ÚLTIMOS CADASTROS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="text-slate-500 font-extrabold uppercase border-b border-slate-900/60 pb-2">
                  <th className="py-2">Empresa</th>
                  <th>CNPJ</th>
                  <th>Plano</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40 text-slate-300 font-medium">
                {recentTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-900/25 transition-all">
                    <td className="py-3 font-bold text-white uppercase">{tenant.nome}</td>
                    <td className="font-mono">{tenant.cnpj}</td>
                    <td>
                      <span className="px-2 py-0.5 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 text-[8px] font-black rounded-md uppercase tracking-wider">
                        {tenant.plano}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        tenant.ativo 
                          ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-950/30 text-red-400 border border-red-500/20'
                      }`}>
                        {tenant.ativo ? 'ATIVO' : 'BLOQUEADO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tabela de Usuários Recentes cadastrados no SaaS */}
        <Card className="bg-[#0D1016] border-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Usuários Registrados na Plataforma
            </h3>
            <span className="text-[9px] text-cyan-400 font-bold">ÚLTIMOS OPERADORES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="text-slate-500 font-extrabold uppercase border-b border-slate-900/60 pb-2">
                  <th className="py-2">Operador</th>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th className="text-right">Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40 text-slate-300 font-medium">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/25 transition-all">
                    <td className="py-3 font-bold text-white uppercase">{user.nome}</td>
                    <td className="font-mono text-slate-400">{user.email}</td>
                    <td>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-[8px] font-bold rounded-md uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        user.ativo 
                          ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-950/30 text-red-400 border border-red-500/20'
                      }`}>
                        {user.ativo ? 'PERMITIDO' : 'BLOQUEADO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
