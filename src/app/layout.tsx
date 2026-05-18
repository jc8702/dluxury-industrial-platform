import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { AxiomWebVitals } from 'next-axiom';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MarcenAI - Enterprise SaaS',
  description: 'Sistema Industrial Paramétrico integrado ao SketchUp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0F1115] text-slate-200 min-h-screen`}>
        <Providers>
          <AxiomWebVitals />
          {children}
        </Providers>
      </body>
    </html>
  );
}

