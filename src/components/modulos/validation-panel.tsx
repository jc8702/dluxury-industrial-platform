'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Settings, 
  Cpu, 
  Hammer,
  RefreshCw
} from 'lucide-react';

export interface ValidationMessage {
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

interface ValidationPanelProps {
  movelId: string;
  nomeMovel: string;
  onCalculationSuccess?: (pecasCalculadas: number) => void;
}

export default function ValidationPanel({ movelId, nomeMovel, onCalculationSuccess }: ValidationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [calculating, setCalculating] = useState(false);
  
  const [validations, setValidations] = useState<ValidationMessage[]>([]);
  const [validado, setValidado] = useState<boolean>(true);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  
  const [dimensions, setDimensions] = useState<{ L: number; A: number; P: number; tipo: string } | null>(null);
  const [pecasCalculadasCount, setPecasCalculadasCount] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rodar validação inicial
  useEffect(() => {
    handleValidate();
  }, [movelId]);

  const handleValidate = async () => {
    if (validating) return;
    setValidating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const res = await fetch(`/api/modulos/${movelId}/validate`, {
        method: 'POST',
      });
      
      const json = await res.json();
      if (json.success && json.data) {
        setValidations(json.data.validations || []);
        setValidado(json.data.validado);
        setCheckedAt(new Date().toLocaleTimeString());
        
        setDimensions({
          L: json.data.largura,
          A: json.data.altura,
          P: json.data.profundidade,
          tipo: json.data.tipo,
        });
      } else {
        setErrorMessage(json.error || 'Falha ao executar validação geométrica.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de rede na validação.');
    } finally {
      setValidating(false);
    }
  };

  const handleCalculate = async () => {
    if (calculating) return;
    setCalculating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/modulos/${movelId}/calculate`, {
        method: 'POST',
      });
      
      const json = await res.json();
      if (json.success && json.data) {
        setPecasCalculadasCount(json.data.pecasCalculadas);
        setSuccessMessage(`Engine paramétrica executada! ${json.data.pecasCalculadas} peças geradas e explodidas no banco de dados.`);
        
        if (onCalculationSuccess) {
          onCalculationSuccess(json.data.pecasCalculadas);
        }
      } else {
        setErrorMessage(json.error || 'Falha no cálculo paramétrico.');
        if (json.validations) {
          setValidations(json.validations);
          setValidado(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de rede na engine paramétrica.');
    } finally {
      setCalculating(false);
    }
  };

  const numErrors = validations.filter(v => v.level === 'error').length;
  const numWarnings = validations.filter(v => v.level === 'warning').length;

  return (
    <div className="w-full bg-[#0d0e12] border border-[#2a2d3a] rounded-xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Detalhe estético de background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2a2d3a]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Engine Paramétrica de Validação
            </h3>
          </div>
          <p className="text-xs text-[#8a8f9f] mt-1">
            Análise geométrica estrutural para o módulo: <span className="text-cyan-300 font-semibold">{nomeMovel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleValidate}
            disabled={validating || calculating}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1c24] hover:bg-[#252834] border border-[#34384a] disabled:opacity-50 text-xs font-mono font-semibold rounded-lg transition-all text-[#d1d5db]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin text-cyan-400' : 'text-gray-400'}`} />
            Revalidar Geometria
          </button>
          
          <button
            onClick={handleCalculate}
            disabled={!validado || validating || calculating}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-[#1d202b] disabled:to-[#1d202b] disabled:border-[#2b2f3e] disabled:text-[#4d5162] disabled:cursor-not-allowed border border-cyan-500/20 text-xs font-mono font-bold rounded-lg transition-all text-white shadow-lg shadow-cyan-500/10"
          >
            <Hammer className="w-3.5 h-3.5" />
            Explodir Paramétrico
          </button>
        </div>
      </div>

      {/* Preview das Dimensões do Módulo */}
      {dimensions && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 bg-[#14161f] border border-[#21232e] rounded-xl my-5 font-mono text-xs text-[#9ca3af]">
          <div>
            <span className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Tipo Mapeado</span>
            <span className="text-white font-bold capitalize text-sm">{dimensions.tipo}</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Largura (L)</span>
            <span className="text-cyan-400 font-bold text-sm">{dimensions.L} mm</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Altura (A)</span>
            <span className="text-cyan-400 font-bold text-sm">{dimensions.A} mm</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Profundidade (P)</span>
            <span className="text-cyan-400 font-bold text-sm">{dimensions.P} mm</span>
          </div>
        </div>
      )}

      {/* Mensagens de Sucesso / Erros de Processamento */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl my-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cálculo Efetuado com Sucesso</p>
            <p className="mt-1 text-emerald-500/80">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs rounded-xl my-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro de Processamento</p>
            <p className="mt-1 text-rose-500/80">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Painel do Status de Validação */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider font-mono text-[#6b7280]">
            Diagnóstico Estrutural
          </span>
          {checkedAt && (
            <span className="text-[10px] font-mono text-[#6b7280]">
              Última validação: {checkedAt}
            </span>
          )}
        </div>

        {validations.length === 0 ? (
          <div className="p-6 bg-[#10121a] border border-[#1e202b] rounded-xl flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <span className="text-xs font-mono font-bold text-emerald-400">100% VALIDADO</span>
            <p className="text-[11px] text-[#8a8f9f] mt-1">
              O móvel atende perfeitamente a todos os padrões construtivos e tolerâncias físicas da fábrica.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {validations.map((v, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs transition-all ${
                  v.level === 'error' 
                    ? 'bg-rose-950/20 border-rose-500/20 text-rose-300' 
                    : v.level === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                    : 'bg-[#161822] border-[#252838] text-slate-300'
                }`}
              >
                {v.level === 'error' ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : v.level === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-60">
                      [{v.code}]
                    </span>
                    {v.field && (
                      <span className="bg-[#1a1c27] px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase text-cyan-400">
                        campo: {v.field}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed">{v.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé informativo */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[#1a1c25] text-[10px] font-mono text-[#4d5162]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{numErrors} Erros impeditivos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{numWarnings} Alertas de qualidade</span>
        </div>
        <div className="ml-auto">
          {validado ? (
            <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Aprovado para CNC
            </span>
          ) : (
            <span className="text-rose-400 font-bold uppercase flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Bloqueado para Fabricação
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
