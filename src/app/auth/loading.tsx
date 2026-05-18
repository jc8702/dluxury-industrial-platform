import React from 'react';

export default function AuthLoading() {
  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-2xl p-8 shadow-2xl w-full max-w-md animate-pulse">
      {/* Brand Header Skeleton */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-slate-800 rounded-xl mb-4"></div>
        <div className="h-6 w-36 bg-slate-800 rounded-md"></div>
        <div className="h-3 w-48 bg-slate-800/60 rounded-md mt-2"></div>
      </div>

      {/* Form Fields Skeletons */}
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-800 rounded-md"></div>
          <div className="h-11 w-full bg-slate-800/40 rounded-xl"></div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
            <div className="h-3 w-24 bg-slate-800/50 rounded-md"></div>
          </div>
          <div className="h-11 w-full bg-slate-800/40 rounded-xl"></div>
        </div>

        <div className="h-11 w-full bg-slate-800 rounded-xl mt-6"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 pt-6 border-t border-slate-800/60 h-4 w-48 bg-slate-800/30 rounded-md mx-auto"></div>
    </div>
  );
}
