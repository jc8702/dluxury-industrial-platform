'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Play, RefreshCw, Layers } from 'lucide-react';
import { SectionHeader } from '@/components/industrial/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SketchupImportPage() {
  const router = useRouter();
  const [jsonContent, setJsonContent] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'ready' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [importResult, setImportResult] = useState<any>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setStatus('error');
      setErrorMessage('Por favor, selecione apenas arquivos JSON exportados do SketchUp.');
      return;
    }

    setFileName(file.name);
    setStatus('validating');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Validação estrutural básica da Fase 5.2
        if (!json.projeto_codigo || !json.ambiente_nome || !Array.isArray(json.modulos)) {
          throw new Error('Estrutura de arquivo inválida. Certifique-se de que o arquivo contém "projeto_codigo", "ambiente_nome" e a lista de "modulos".');
        }

        setJsonContent(json);
        setStatus('ready');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Erro ao parsear arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const triggerImport = async () => {
    if (!jsonContent) return;

    setStatus('uploading');
    try {
      const res = await fetch('/api/sketchup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonContent),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setImportResult(data);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Erro desconhecido durante a importação.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Falha ao se conectar com o servidor.');
    }
  };

  const resetUploader = () => {
    setJsonContent(null);
    setFileName('');
    setStatus('idle');
    setErrorMessage('');
    setImportResult(null);
  };

  return (
    <div className="space-y-8 p-6 bg-[#0F1115] min-h-screen text-slate-100 font-sans">
      <SectionHeader 
        title="Integração SketchUp" 
        description="Faça upload dos arquivos JSON gerados pelo plugin Ruby SketchUp e efetue a explosão imediata de peças de engenharia."
      />

      {status === 'success' ? (
        <Card className="bg-[#1A1D24] border-emerald-500/30 p-8 flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 animate-pulse">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Importação Realizada com Sucesso!</h2>
            <p className="text-sm text-slate-400">
              O ambiente <strong className="text-blue-400">{jsonContent?.ambiente_nome}</strong> e seus módulos foram perfeitamente processados e armazenados.
            </p>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Projeto Vinculado:</span>
              <span className="text-white font-semibold">{jsonContent?.projeto_codigo}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Módulos Importados:</span>
              <span className="text-emerald-400 font-bold">{importResult?.modulosImportados?.length}</span>
            </div>
            <div className="space-y-1 pt-1">
              <span className="text-slate-500 block mb-1">Módulos:</span>
              {importResult?.modulosImportados?.map((m: any, idx: number) => (
                <div key={idx} className="flex justify-between text-slate-300">
                  <span>- {m.nome}</span>
                  <span className="text-slate-500">{m.dimensoes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 w-full">
            <Button 
              variant="outline" 
              className="flex-1 border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-white"
              onClick={resetUploader}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Importar Outro
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25"
              onClick={() => router.push(`/projetos/${importResult?.projetoId}/modulos`)}
            >
              <Layers className="w-4 h-4 mr-2" />
              Ver Módulos
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Uploader Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1A1D24] border-slate-800 p-6 flex flex-col justify-between min-h-[350px] shadow-xl relative overflow-hidden">
              <div 
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all ${
                  status === 'ready' 
                    ? 'border-blue-500/40 bg-blue-500/5' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="json-file-input"
                  accept=".json"
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="json-file-input"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                    <Upload className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-slate-200">
                      Arrastar e soltar arquivo ou <span className="text-blue-500 hover:text-blue-400">procurar</span>
                    </p>
                    <p className="text-xs text-slate-500">Apenas arquivos .json exportados do SketchUp</p>
                  </div>
                </label>
              </div>

              {fileName && (
                <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">{fileName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Pronto para processamento</p>
                    </div>
                  </div>
                  {status === 'ready' && (
                    <Button 
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 shadow-md shadow-blue-600/10"
                      onClick={triggerImport}
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Importar
                    </Button>
                  )}
                </div>
              )}

              {status === 'uploading' && (
                <div className="absolute inset-0 bg-[#1A1D24]/85 flex flex-col items-center justify-center space-y-4 backdrop-blur-sm">
                  <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-slate-300">Processando e gerando peças no banco de dados...</p>
                </div>
              )}
            </Card>

            {status === 'error' && (
              <Card className="bg-red-500/5 border-red-500/20 p-4 flex items-start space-x-3 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-300">Falha na validação ou importação:</h4>
                  <p className="mt-1 text-slate-400">{errorMessage}</p>
                  <Button 
                    variant="outline" 
                    className="mt-3 text-[10px] h-7 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={resetUploader}
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Guidelines and Documentation */}
          <div className="space-y-6">
            <Card className="bg-[#1A1D24] border-slate-800 p-6 space-y-5 shadow-xl">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center uppercase text-slate-400">
                <Layers className="w-4 h-4 mr-2 text-blue-500" />
                Instruções de Integração
              </h3>
              
              <div className="space-y-4 text-xs text-slate-400">
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-200">1. Obter o Plugin Ruby</h4>
                  <p>Copie o plugin localizado no diretório <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-blue-400 text-[10px]">/plugins</code> do seu sistema para a pasta de extensões oficial do seu SketchUp.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-200">2. Exportar o JSON</h4>
                  <p>Abra seu projeto no SketchUp, selecione os módulos dinâmicos que deseja integrar e acesse <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-slate-300 text-[10px]">Extensions &gt; D'Luxury &gt; Exportar Módulos</code> para salvar o JSON.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-200">3. Fazer o Upload</h4>
                  <p>Arraste o arquivo JSON gerado no box ao lado e clique em importar para processar e gerar a lista de peças construtivas industriais no Neon.</p>
                </div>
              </div>
            </Card>

            {/* Preview Card */}
            {jsonContent && (
              <Card className="bg-[#1A1D24] border-slate-800 p-6 space-y-4 shadow-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  Preview dos Módulos do JSON
                </h4>
                <div className="max-h-[220px] overflow-y-auto bg-slate-900 border border-slate-800/80 rounded-xl p-3 font-mono text-[10px] text-slate-400 space-y-2">
                  <p className="text-slate-300 font-semibold">Ambiente: {jsonContent.ambiente_nome}</p>
                  <p className="text-slate-500">Módulos a serem importados:</p>
                  {jsonContent.modulos?.map((m: any, idx: number) => (
                    <div key={idx} className="border-l border-blue-500/30 pl-2 py-0.5 space-y-0.5">
                      <p className="text-slate-200 font-semibold">{m.nome}</p>
                      <p className="text-slate-500">{m.largura}x{m.altura}x{m.profundidade}mm - {m.material || 'Sem material'}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
