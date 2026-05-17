'use client';

import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/actions/dashboard';
import { DashboardMetrics } from '@/lib/dashboard/metrics';
import { getPusherClient } from '@/lib/realtime/pusher-client';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Hammer, Factory, DollarSign, Calendar, Filter, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExecutiveDashboardProps {
  empresaId: string;
  userRole: string;
}

export function ExecutiveDashboard({ empresaId, userRole }: ExecutiveDashboardProps) {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async (force = false) => {
    try {
      setLoading(true);
      const metrics = await fetchDashboardData(empresaId, userRole, force);
      setData(metrics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();

    // Inscrição Realtime via WebSocket (Pusher)
    const pusher = getPusherClient();
    if (pusher) {
      const channel = pusher.subscribe(`empresa-${empresaId}`);
      channel.bind('production_update', () => {
        // Alerta não intrusivo ou Soft Refresh
        console.log('Realtime update recebido. Recarregando métricas operacionais...');
        // Força atualização bypassando o cache do Redis (apenas para este client para não onerar db globalmente, 
        // ou usa SWR/React Query no mundo real).
        loadMetrics(true);
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [empresaId, userRole]);

  if (loading && !data) return <div className="p-8 text-white">Carregando painel executivo...</div>;
  if (!data) return <div className="p-8 text-red-500">Erro ao carregar dados.</div>;

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel Industrial</h1>
          <p className="text-slate-400 mt-1">Visão geral executiva da marcenaria</p>
        </div>
        <button 
          onClick={() => loadMetrics(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700"
        >
          Sincronizar Agora
        </button>
      </div>

      {/* Action Bar (Filters) */}
      <div className="flex items-center space-x-4 mb-8 bg-[#1A1D24] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-slate-400 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Últimos 30 Dias</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>
        <div className="flex items-center space-x-2 text-slate-400 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
          <Factory className="w-4 h-4" />
          <span className="text-sm">Todas as Máquinas (CNC/Corte)</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>
        <div className="flex-1"></div>
        <button className="flex items-center px-3 py-2 text-slate-400 hover:text-white transition-colors">
          <Filter className="w-4 h-4 mr-2" /> Mais Filtros
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Faturamento" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.faturamento.total)}
          trend={data.faturamento.growth}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />
        <KpiCard 
          title="Produtividade (Peças/Dia)" 
          value={data.produtividade.pecasDia.toString()}
          trend={data.produtividade.growth}
          icon={<Factory className="w-5 h-5 text-blue-400" />}
        />
        <KpiCard 
          title="Taxa de Retrabalho" 
          value={`${data.qualidade.retrabalhoPercent}%`}
          trend={-1.2} // Retrabalho caindo é bom (inverted trend logic na ui)
          icon={<Hammer className="w-5 h-5 text-orange-400" />}
          invertTrendColor
        />
        <KpiCard 
          title="Alertas de Engenharia" 
          value={data.qualidade.erros.toString()}
          trend={0}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        />
      </div>

      {/* Gráficos em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Principal: Evolução de Receita */}
        <div className="lg:col-span-2 bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Evolução de Projetos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.graficoFaturamento}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D313A" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFaturamento)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Secundário: Motivos de Retrabalho */}
        <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Ofensores de Retrabalho</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.graficoRetrabalho} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D313A" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#2D313A' }}
                  contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Third Row: Gargalos de Produção */}
      <div className="mt-6 bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-6">Gargalos e Ocupação de Máquina</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Estágio / Máquina</th>
                <th className="pb-3 font-medium">Fila (Peças)</th>
                <th className="pb-3 font-medium">Tempo Médio</th>
                <th className="pb-3 font-medium">Eficiência OEE</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-medium text-slate-200">Seccionadora (Corte)</td>
                <td className="py-4 text-emerald-400">12 Peças</td>
                <td className="py-4">1m 12s / chapa</td>
                <td className="py-4">88%</td>
                <td className="py-4 text-right"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">Normal</span></td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-medium text-slate-200">Coladeira de Borda</td>
                <td className="py-4 text-orange-400">184 Peças</td>
                <td className="py-4">0m 45s / peça</td>
                <td className="py-4">62%</td>
                <td className="py-4 text-right"><span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs">Atenção (Gargalo)</span></td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-medium text-slate-200">Router CNC (Furo)</td>
                <td className="py-4 text-blue-400">45 Peças</td>
                <td className="py-4">2m 30s / peça</td>
                <td className="py-4">95%</td>
                <td className="py-4 text-right"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Otimizado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon, invertTrendColor = false }: { title: string, value: string, trend: number, icon: React.ReactNode, invertTrendColor?: boolean }) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  
  // Lógica de inversão de cor (Ex: Menos retrabalho é "positivo" visualmente, mas o trend é negativo)
  let trendColor = isPositive ? 'text-emerald-400' : 'text-red-400';
  if (invertTrendColor) {
    trendColor = isPositive ? 'text-red-400' : 'text-emerald-400';
  }
  if (isNeutral) trendColor = 'text-slate-400';

  return (
    <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-slate-800/50 rounded-md">
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        <div className="flex items-center mt-2">
          {!isNeutral && (
            isPositive ? <TrendingUp className={cn("w-4 h-4 mr-1", trendColor)} /> : <TrendingDown className={cn("w-4 h-4 mr-1", trendColor)} />
          )}
          <span className={cn("text-sm font-medium", trendColor)}>
            {isNeutral ? 'Estável' : `${Math.abs(trend)}% vs mês ant.`}
          </span>
        </div>
      </div>
    </div>
  );
}
