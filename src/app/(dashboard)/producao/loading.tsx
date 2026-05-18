import React from 'react';

export default function ProducaoLoading() {
  return (
    <div className="p-8 bg-[#0F1115] min-h-screen text-slate-200 font-sans animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="h-6 w-48 bg-slate-800/80 rounded-lg mb-6"></div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-64 bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-28 bg-slate-800/60 rounded-full"></div>
          </div>
          <div className="h-4 w-96 bg-slate-800/50 rounded-lg mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-lg"></div>
      </div>

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1A1D24] border border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
              <div className="w-9 h-9 bg-slate-800/50 rounded-md"></div>
            </div>
            <div className="h-8 w-24 bg-slate-800 rounded-md"></div>
            <div className="h-3 w-36 bg-slate-800/40 rounded-md mt-3"></div>
          </div>
        ))}
      </div>

      {/* Main Container Skeleton */}
      <div className="bg-[#1A1D24] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-800 px-6 py-5">
          <div className="flex space-x-6">
            <div className="h-5 w-40 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-40 bg-slate-800/60 rounded-md"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-800/40 pb-4">
              <div className="h-4 w-20 bg-slate-800 rounded-md"></div>
              <div className="h-4 w-48 bg-slate-800 rounded-md"></div>
              <div className="h-4 w-64 bg-slate-800 rounded-md"></div>
              <div className="h-4 w-12 bg-slate-800 rounded-md"></div>
              <div className="h-4 w-24 bg-slate-800 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
