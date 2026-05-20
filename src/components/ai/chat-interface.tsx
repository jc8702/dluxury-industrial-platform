'use client';

import { useState, useEffect, useRef } from 'react';
import { Cpu, Send, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SUGGESTIONS = [
  { text: 'Qual profundidade recomendada para balcão inferior?', label: 'Profundidade Balcão' },
  { text: 'Por que prateleiras longas com mais de 1000mm empenam?', label: 'Reforço Estrutural' },
  { text: 'Qual a folga e desconto padrão recomendados para portas?', label: 'Folga de Portas' },
  { text: 'Como planejar o recuo de fundo de MDF para serviços?', label: 'Fundo & Serviços' },
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const history = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Erro HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream não disponível');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        }
      }

      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content.trim()) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Card className="bg-[#13161C] border-slate-800/80 flex flex-col h-[70vh] w-full shadow-2xl overflow-hidden rounded-xl border">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800/85 bg-[#171B24]/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
              MarcenAI Technical Assistant
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider font-mono">
              ENGINEERING ENGINE &amp; SPECS CORE
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            onClick={() => {
              const lastUser = [...messages].reverse().find(m => m.role === 'user');
              if (lastUser) {
                setMessages([]);
                sendMessage(lastUser.content);
              }
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto space-y-6 py-8">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">Pronto para a Engenharia de Produção</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Eu sou o cérebro auxiliar da MarcenAI. Pergunte sobre dimensões padrão, espessuras de chapa, limites físicos ou dúvidas de montagem construtiva.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pt-4">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(sug.text)}
                  className="flex flex-col items-start p-3 bg-[#1A1D24] hover:bg-[#222731] border border-slate-800/80 hover:border-cyan-500/20 text-left rounded-lg transition-all text-xs text-slate-400 hover:text-white"
                >
                  <span className="font-mono text-[9px] text-cyan-500 tracking-wider font-extrabold uppercase mb-1">{sug.label}</span>
                  <span className="line-clamp-2 leading-relaxed">{sug.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div key={message.id} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-xl px-4 py-3 text-xs leading-relaxed border ${isUser ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-[#181C25] border-slate-800/60 text-slate-300'}`}>
                  <div className="font-mono text-[9px] font-extrabold tracking-wider uppercase text-slate-500 mb-1">
                    {isUser ? 'OPERADOR' : 'MARCENAI ASSISTANT'}
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-slate-300">{message.content}</div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#181C25] border border-slate-800/60 rounded-xl px-4 py-3 text-xs text-slate-500 font-mono animate-pulse flex items-center gap-2">
              PROCESSANDO GEOMETRIA...
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-4 justify-center py-2">
            <div className="bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs max-w-md flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Falha de Comunicação com a IA</p>
                <p className="opacity-90 font-mono text-[10px]">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-slate-800/85 bg-[#171B24]/20">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isLoading ? 'Aguarde o processamento...' : 'Digite sua dúvida de montagem ou engenharia...'}
            disabled={isLoading}
            className="flex-1 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-600 focus:outline-none text-slate-100 placeholder-slate-600 rounded-lg px-4 py-3 text-sm transition-all disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-10 px-4 rounded-lg flex items-center justify-center shrink-0 transition-all shadow-md shadow-cyan-500/10 border border-cyan-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[9px] text-slate-600 font-mono font-bold">
          <span>GEMINI CORE INTEGRATION v2.0</span>
          <span>VALORES EM MM (MILÍMETROS)</span>
        </div>
      </div>
    </Card>
  );
}