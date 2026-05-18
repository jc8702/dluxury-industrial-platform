import React from 'react';
import Link from 'next/link';
import { Lock, AlertOctagon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#07090C] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decoração sutil de fundo com brilho avermelhado para indicar erro de segurança */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0D1016] border border-red-500/10 rounded-2xl p-8 shadow-2xl relative">
        {/* Detalhe estético neon no topo do card */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Ícone de Cadeado Brutalista com Alerta */}
          <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5 animate-pulse relative">
            <Lock className="w-8 h-8" />
            <AlertOctagon className="w-4 h-4 absolute -bottom-1 -right-1 text-red-400 bg-[#07090C] rounded-full" />
          </div>

          <div className="space-y-2">
            <h1 className="text-sm font-black tracking-widest text-red-500 uppercase font-mono">
              ACCESS DEVIATION REPORT
            </h1>
            <h2 className="text-xl font-extrabold text-white">Acesso Não Autorizado</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              A rota que você tentou acessar está restrita exclusivamente a usuários do nível **SuperAdmin** da MarcenAI. Suas credenciais atuais não possuem privilégios de controlador.
            </p>
          </div>

          {/* Logs simulados de segurança para visual de engenharia */}
          <div className="w-full bg-[#07090C] border border-slate-900 rounded-lg p-3 text-left font-mono text-[9px] text-slate-500 space-y-1">
            <p className="text-red-400 font-bold">[SECURITY_ALERT] INSUFFICIENT_ROLE_PRIVILEGES</p>
            <p>[TIMESTAMP] {new Date().toISOString()}</p>
            <p>[ACTION] REDIRECT_SAFE_ENVIRONMENT_TRIGGERED</p>
          </div>

          {/* Botão de retorno seguro */}
          <div className="w-full pt-2">
            <Link href="/dashboard" passHref className="w-full block">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Dashboard Seguro</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
