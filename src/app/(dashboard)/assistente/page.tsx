import React from 'react';
import { Metadata } from 'next';
import { Cpu, Scale, Hammer, ShieldAlert } from 'lucide-react';
import ChatInterface from '@/components/ai/chat-interface';

// Metadados SEO da página
export const metadata: Metadata = {
  title: "Assistente Técnico MarcenAI | D'Luxury Engineering Core",
  description: "Assistente inteligente de engenharia de marcenaria, otimização de chapa e especificações técnicas de montagem de móveis planejados.",
};

export default function AssistentePage() {
  return (
    <div className="space-y-8 p-6 bg-[#0F1115] min-h-screen text-slate-100 font-sans">
      {/* Cabeçalho principal com design de engenharia */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <span className="hover:text-blue-400 transition-colors uppercase">D'LUXURY SYSTEMS</span>
            <span>/</span>
            <span className="text-blue-500 font-semibold uppercase">TECHNICAL ASSISTANT CORE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Cpu className="w-8 h-8 text-blue-500 mr-3 animate-pulse" />
            Assistente Técnico Inteligente
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl font-sans">
            Consulte o cérebro de engenharia da MarcenAI em tempo real. Tire dúvidas de montagem, valide vãos, calcule folgas ou obtenha suporte estrutural para peças.
          </p>
        </div>
      </div>

      {/* Grid principal contendo o Chat no centro e cards auxiliares na lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Container principal do chat */}
        <div className="lg:col-span-3">
          <ChatInterface />
        </div>

        {/* Painel lateral de diretrizes de engenharia */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card 1: Tolerâncias Físicas */}
          <div className="bg-[#13161C] border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2.5 text-cyan-400">
              <Scale className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-mono font-extrabold tracking-wider uppercase">Tolerâncias Físicas</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              As espessuras comerciais recomendadas para chapas de MDF estruturais no sistema D'Luxury são de **18mm** para laterais e tampos, e **6mm** para fundos.
            </p>
            <div className="h-px bg-slate-800/50" />
            <div className="text-[10px] text-slate-500 font-mono tracking-wider space-y-1">
              <div className="flex justify-between">
                <span>BALCÃO INFERIOR</span>
                <span className="text-white font-bold">580mm PROF</span>
              </div>
              <div className="flex justify-between">
                <span>ARMÁRIO AÉREO</span>
                <span className="text-white font-bold">350mm PROF</span>
              </div>
              <div className="flex justify-between">
                <span>RECUO DE SERVIÇO</span>
                <span className="text-white font-bold">15mm RECUO</span>
              </div>
            </div>
          </div>

          {/* Card 2: Alertas de Empenamento */}
          <div className="bg-[#13161C] border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2.5 text-yellow-500">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-mono font-extrabold tracking-wider uppercase">Alertas Construtivos</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Vãos livres na horizontal com mais de **1000mm** de comprimento sem suporte vertical sofrerão empenamento estrutural progressivo se carregados.
            </p>
            <div className="h-px bg-slate-800/50" />
            <span className="text-[9px] text-yellow-500/80 font-mono font-bold block uppercase">
              ⚠️ SEMPRE UTILIZE APOIO INTERMEDIÁRIO
            </span>
          </div>

          {/* Card 3: Montagem e Rastreabilidade */}
          <div className="bg-[#13161C] border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2.5 text-emerald-400">
              <Hammer className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-mono font-extrabold tracking-wider uppercase">Montagem Industrial</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Cada peça possui um QRCode único com metadados detalhados de furação e maquinação. Faça o scan físico para consultar os detalhes direto no painel da fábrica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
