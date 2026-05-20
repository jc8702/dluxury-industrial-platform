import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';
import { withAxiom } from 'next-axiom';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Resolve o warning "Next.js inferred your workspace root" causado por múltiplos package-lock.json
  outputFileTracingRoot: require('path').join(__dirname),
};

// 1. Envelopa NextConfig com Axiom (Logs estruturados)
const axiomConfig = withAxiom(nextConfig);

// 2. Envelopa NextConfig com Sentry (Error Tracking & V8 Profiling)
export default withSentryConfig(axiomConfig, {
  silent: true, // Suprime logs do webpack do sentry no terminal
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  disableLogger: true,
});
