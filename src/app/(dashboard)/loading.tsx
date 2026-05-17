import { Cuboid } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F1115]/50 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-600/20 rounded-xl animate-ping absolute inset-0"></div>
        <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center relative z-10 shadow-lg">
          <Cuboid className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
      </div>
      <h2 className="mt-6 text-lg font-medium text-white tracking-tight animate-pulse">Carregando Módulo...</h2>
      <p className="text-sm text-slate-400 mt-1">Sincronizando com a nuvem industrial</p>
    </div>
  );
}
