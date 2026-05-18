import React from 'react';

export default function ConfiguracoesLoading() {
  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="h-6 w-48 bg-slate-800/80 rounded-lg mb-6"></div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-64 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-800/50 rounded-lg mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Layout Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar Skeleton */}
        <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-4 space-y-3 h-fit">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 w-full bg-slate-800 rounded-lg"></div>
          ))}
        </div>

        {/* Configurations Form Skeleton */}
        <div className="lg:col-span-3 bg-[#1A1D24] border border-slate-800 rounded-xl p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-800 rounded-md"></div>
            <div className="h-4 w-72 bg-slate-800/60 rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/60">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="h-4 w-28 bg-slate-800 rounded-md"></div>
                <div className="h-10 w-full bg-slate-800/40 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
