import React from 'react';
import { db } from "@/db";
import { auditoria } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Terminal, Database, ShieldAlert, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminAuditoriaPage() {
  // Puxar logs de auditoria do Neon Postgres
  const logs = await db.select().from(auditoria).orderBy(desc(auditoria.data)).limit(40);

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-slate-900 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-500" />
            Logs Globais de Auditoria
          </h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wider">
            MONITORAMENTO DE INTEGRIDADE, LOGINS E ALTERAÇÕES ESTRUTURAIS
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#0D1016] border border-cyan-500/20 rounded-lg text-cyan-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Database className="w-3.5 h-3.5 animate-pulse" />
          <span>Sincronizado com Neon Logs</span>
        </div>
      </div>

      {/* Relação de Logs */}
      {logs.length === 0 ? (
        <Card className="bg-[#0D1016] border-slate-900 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <ShieldAlert className="w-8 h-8 text-slate-700 animate-bounce" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Nenhum Log Registrado</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-relaxed">
              O banco de dados do Neon não reportou nenhuma operação de auditoria pendente.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="bg-[#0D1016] border-slate-900 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] text-slate-300">
              <thead>
                <tr className="text-slate-500 font-extrabold uppercase border-b border-slate-900 pb-3">
                  <th className="py-2">Data/Hora</th>
                  <th>Operação</th>
                  <th>Tabela</th>
                  <th>Registro ID</th>
                  <th>IP Address</th>
                  <th className="text-right">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40 text-slate-300 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20 transition-all font-mono">
                    <td className="py-3 text-slate-400">
                      {new Date(log.data).toLocaleString('pt-BR')}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        log.acao === 'insert' 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10'
                          : log.acao === 'update'
                            ? 'bg-blue-950/20 text-blue-400 border border-blue-500/10'
                            : 'bg-red-950/20 text-red-400 border border-red-500/10'
                      }`}>
                        {log.acao}
                      </span>
                    </td>
                    <td className="font-bold text-white uppercase">{log.tabela}</td>
                    <td className="text-slate-500 text-[8px] font-mono">{log.registroId}</td>
                    <td className="text-slate-400 font-mono">{log.ipAddress || 'localhost'}</td>
                    <td className="text-right text-slate-500 truncate max-w-xs font-mono text-[9px]">
                      {log.userAgent || 'Desconhecido'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
