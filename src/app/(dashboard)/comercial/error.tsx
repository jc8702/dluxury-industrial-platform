'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ComercialError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Comercial Error Boundary:', error);
  }, [error]);

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-[#1A1D24] border border-slate-800 p-8 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Erro no Módulo Comercial</h2>
        <p className="text-slate-400 text-sm mb-6">
          Houve um problema ao carregar o funil de CRM ou os relatórios de faturamento do Neon Postgres.
        </p>

        {error.message && (
          <div className="bg-[#0F1115] p-3 rounded-lg border border-slate-800 text-xs text-red-400 font-mono mb-6 text-left break-words overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-semibold shadow-md shadow-blue-600/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Tentar Novamente
          </button>
          <Link 
            href="/dashboard"
            className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg transition-all text-sm font-semibold"
          >
            <Home className="w-4 h-4 mr-2" /> Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
