'use client';

import React, { useState } from 'react';
import { Cuboid, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulação rápida para propósitos de demonstração (ou redirecionamento se der sucesso)
      // Em produção, isso chama a API do NextAuth.ts:
      // const res = await signIn('credentials', { email, password, redirect: false });
      
      if (email === 'admin@marcenai.com' && password === 'admin123') {
        router.push('/dashboard');
      } else if (email && password) {
        // Aceita qualquer e-mail/senha mock para fins de sandbox do desenvolvedor, eliminando 404
        router.push('/dashboard');
      } else {
        setError('Por favor, preencha todos os campos corretamente.');
      }
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Top Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/25">
          <Cuboid className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Marcen<span className="text-blue-500">AI</span> Enterprise
        </h1>
        <p className="text-xs text-slate-400 mt-1 text-center">
          Faça login para gerenciar sua planta de móveis industriais e integradores.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center text-xs space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 mb-2">Endereço de E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              placeholder="seu.nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-400">Senha de Acesso</label>
            <a href="#" className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="password" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/15 group mt-2"
        >
          {loading ? 'Autenticando...' : (
            <>
              Entrar na Plataforma
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Ambiente industrial seguro SSL de ponta a ponta</span>
      </div>
    </div>
  );
}
