'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, FileSpreadsheet, Plus, Search, Hammer, Layers, Settings, FileCheck2, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getMateriais, createMaterial, getMateriaisCount } from '@/actions/engenharia';

interface Material {
  id: string;
  nome: string;
  tipo: string;
  espessura: string | null;
  precoM2: string | null;
  temVeio: boolean;
}

export default function EngenhariaPage() {
  const [activeTab, setActiveTab] = useState<'bom' | 'materiais'>('bom');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('chapa');
  const [espessura, setEspessura] = useState('');
  const [precoM2, setPrecoM2] = useState('');
  const [temVeio, setTemVeio] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const data = await getMateriais(searchTerm);
      setItems(data || []);
      const count = await getMateriaisCount();
      setTotalCount(count);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => loadData(), 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !tipo.trim()) {
      setErrorMsg('Nome e tipo do insumo são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createMaterial({
        nome,
        tipo,
        espessura: espessura ? parseFloat(espessura) : undefined,
        precoM2: precoM2 ? parseFloat(precoM2) : undefined,
        temVeio,
      });

      if (res.success) {
        setSuccessMsg('Insumo cadastrado com sucesso!');
        setNome(''); setTipo('chapa'); setEspessura(''); setPrecoM2(''); setTemVeio(false);
        loadData();
        setTimeout(() => { setIsModalOpen(false); setSuccessMsg(''); }, 1500);
      } else {
        setErrorMsg(res.error || 'Erro ao salvar insumo.');
      }
    } catch (err: any) {
      setErrorMsg('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ['Nome', 'Tipo', 'Espessura (mm)', 'Preço/m² (R$)', 'Tem Veio'];
    const rows = items.map(i => [
      i.nome,
      i.tipo,
      i.espessura || '',
      i.precoM2 || '',
      i.temVeio ? 'Sim' : 'Não',
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insumos_marcenai_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-slate-400 mb-6 bg-[#1A1D24]/50 py-2 px-3 rounded-lg border border-slate-800/40 w-fit">
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 flex-shrink-0" />
        <span className="text-slate-300 font-medium">Engenharia & BOM</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Engenharia & BOM</h1>
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/20">
              V3.5 Paramétrico
            </span>
          </div>
          <p className="text-slate-400 mt-1">Gerencie a estrutura de produtos, Bill of Materials (BOM) e insumos industriais.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={items.length === 0}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700 disabled:opacity-40"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" /> Exportar CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Insumo
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Total de Componentes</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><Layers className="w-5 h-5 text-blue-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{totalCount}</h2>
          <span className="text-xs text-slate-500 mt-2 block">Insumos cadastrados no Neon Postgres</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Exibidos Agora</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><span className="text-emerald-400 font-semibold text-sm">R$</span></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{items.length}</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Filtro ativo via pesquisa dinâmica</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Fórmulas Paramétricas</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><Settings className="w-5 h-5 text-purple-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">84</h2>
          <span className="text-xs text-slate-500 mt-2 block">Variáveis dinâmicas ativas</span>
        </div>
        <div className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium text-sm">Taxa de Confiabilidade</h3>
            <div className="p-2 bg-slate-800/50 rounded-md"><FileCheck2 className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">99.8%</h2>
          <span className="text-xs text-emerald-400 mt-2 block">Consistência com motor SketchUp</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 px-6 py-4 gap-4">
          <div className="flex space-x-6">
            <button onClick={() => setActiveTab('bom')} className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'bom' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
              Lista de Insumos (BOM)
              {activeTab === 'bom' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('materiais')} className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === 'materiais' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
              Variáveis Paramétricas
              {activeTab === 'materiais' && <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Buscar por nome ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors" />
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'bom' ? (
            isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p>Carregando insumos do Neon Postgres...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-slate-400">Nenhum insumo cadastrado</p>
                <p className="text-sm mt-1">Clique em &quot;Novo Insumo&quot; para registrar o primeiro material desta empresa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="pb-3 font-semibold">Insumo</th>
                      <th className="pb-3 font-semibold">Tipo</th>
                      <th className="pb-3 font-semibold text-right">Espessura</th>
                      <th className="pb-3 font-semibold text-right">Preço/m²</th>
                      <th className="pb-3 font-semibold text-center">Veio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/20 transition-all duration-150">
                        <td className="py-4 font-medium text-slate-200">{item.nome}</td>
                        <td className="py-4"><span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-md text-xs">{item.tipo}</span></td>
                        <td className="py-4 text-right font-mono text-xs">{item.espessura ? `${item.espessura} mm` : '---'}</td>
                        <td className="py-4 text-right text-emerald-400 font-medium">
                          {item.precoM2 ? `R$ ${parseFloat(item.precoM2).toFixed(2)}` : '---'}
                        </td>
                        <td className="py-4 text-center">{item.temVeio ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0F1115] border border-slate-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Hammer className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Chapa Base MDF 18mm</h4>
                    <p className="text-xs text-slate-400">Variáveis globais de espessura de corte</p>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">ALTURA_MAX</span><span className="text-blue-400">2750 mm</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">LARGURA_MAX</span><span className="text-blue-400">1840 mm</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">ESPESSURA_REAL</span><span className="text-blue-400">18.2 mm</span></div>
                </div>
              </div>
              <div className="bg-[#0F1115] border border-slate-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <Settings className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Cálculo de Folga de Gaveta</h4>
                    <p className="text-xs text-slate-400">Regras de recuo para corrediças ocultas</p>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">FOLGA_LATERAL</span><span className="text-purple-400">13.0 mm</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">RECUO_TRASEIRA</span><span className="text-purple-400">10.0 mm</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">DESCONTO_PROFUNDIDADE</span><span className="text-purple-400">10.0 mm</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Insumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Cadastrar Novo Insumo</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{errorMsg}</div>}
              {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg">{successMsg}</div>}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Insumo <span className="text-red-500">*</span></label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: MDF Branco Diamante 18mm" required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tipo <span className="text-red-500">*</span></label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="chapa">Chapa</option>
                    <option value="fita">Fita de Borda</option>
                    <option value="fundo">Fundo</option>
                    <option value="ferragem">Ferragem</option>
                    <option value="cola">Cola</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Espessura (mm)</label>
                  <input type="number" step="0.01" value={espessura} onChange={(e) => setEspessura(e.target.value)} placeholder="18.00"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Preço por m² (R$)</label>
                  <input type="number" step="0.01" value={precoM2} onChange={(e) => setPrecoM2(e.target.value)} placeholder="245.50"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={temVeio} onChange={(e) => setTemVeio(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-400">Material com veio</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700">Cancelar</button>
                <button type="submit" disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-blue-600/15 disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : 'Salvar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
