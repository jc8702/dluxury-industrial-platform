import React from 'react';
import { db } from "@/db";
import { empresas } from "@/db/schema";
import { desc } from "drizzle-orm";
import TenantsManager from '@/components/admin/tenants-manager';
import { Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminEmpresasPage() {
  // Puxar todos os tenants cadastrados no Neon Postgres de forma assíncrona
  const allTenants = await db.select().from(empresas).orderBy(desc(empresas.createdAt));

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-slate-900 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-500" />
          Gerenciar Tenants (Marcas Industriais)
        </h2>
        <p className="text-xs text-slate-500 font-semibold tracking-wider">
          CONTROLE DE ATIVAÇÃO, COTA DE LICENÇAS E PLANOS CORPORATIVOS
        </p>
      </div>

      {/* Componente interativo de controle tabular e ações administrativas */}
      <TenantsManager initialTenants={allTenants} />
    </div>
  );
}
