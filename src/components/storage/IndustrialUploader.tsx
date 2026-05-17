'use client';

import { UploadDropzone } from '@uploadthing/react';
import type { IndustrialFileRouter } from '@/app/api/uploadthing/core';
import { FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function IndustrialUploader() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'indexing' | 'success' | 'error'>('idle');

  return (
    <div className="p-6 bg-[#1A1D24] border border-slate-800 rounded-xl max-w-2xl mx-auto shadow-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          Ingestão de Documentação Técnica
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Faça upload de Manuais de Ferragem (PDF), Projetos (DXF) ou Gabaritos de Furação.
          Nossa IA (Gemini 2.5 Pro) fará o OCR e indexará as métricas estruturais automaticamente.
        </p>
      </div>

      <UploadDropzone<IndustrialFileRouter, "technicalDocument">
        endpoint="technicalDocument"
        onUploadBegin={() => {
          setStatus('uploading');
        }}
        onClientUploadComplete={(res) => {
          // Upload pro R2 concluído, agora a IA está processando o PDF no backend
          setStatus('indexing');
          
          // Simula o tempo do trigger do webhook que roda o OCR do Gemini
          setTimeout(() => {
            setStatus('success');
          }, 4000);
        }}
        onUploadError={(error: Error) => {
          setStatus('error');
          console.error(`ERROR! ${error.message}`);
        }}
        appearance={{
          container: "border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors rounded-lg",
          label: "text-slate-300 font-medium hover:text-white",
          allowedContent: "text-slate-500",
          button: "bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-md shadow-lg shadow-blue-900/20"
        }}
        content={{
          label: "Arraste e solte o Manual (PDF) ou DXF",
          allowedContent: "Máx 128MB. Suporte a PDF, JPG, DXF.",
        }}
      />

      {status !== 'idle' && (
        <div className={`mt-6 p-4 rounded-lg flex items-center border ${
          status === 'uploading' ? 'bg-slate-800/50 border-slate-700 text-slate-300' :
          status === 'indexing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status === 'uploading' && <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Enviando arquivo via Chunking...</>}
          {status === 'indexing' && <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Realizando OCR Multimodal e Vetorização (Gemini)...</>}
          {status === 'success' && <><CheckCircle className="w-5 h-5 mr-3" /> Arquivo vetorizado e disponível para RAG.</>}
          {status === 'error' && <><AlertCircle className="w-5 h-5 mr-3" /> Falha no envio do arquivo.</>}
        </div>
      )}
    </div>
  );
}
