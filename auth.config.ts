import type { NextAuthConfig } from 'next-auth';

// O Edge runtime não suporta todos os adaptadores de banco, por isso separamos
// as configurações de rotas e providers básicos aqui.
export const authConfig = {
  pages: {
    signIn: '/auth/login', // Custom login page
    error: '/auth/login?error=auth', // Error code passed in query string as ?error=
    verifyRequest: '/auth/login?verifyRequest=true', // Used for check email message
  },
  callbacks: {
    // Middleware-level protection check
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
      const isPublicRoute = 
        nextUrl.pathname === '/auth/login' || 
        nextUrl.pathname === '/login' || 
        nextUrl.pathname === '/forgot-password' || 
        nextUrl.pathname === '/register';

      if (isApiAuthRoute) return true;

      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      if (isLoggedIn && isPublicRoute) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    // Customize JWT to include role and tenant
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.empresaId = (user as any).empresaId;
      }
      
      // Update session if it changes
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    // Propagate custom token claims to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).empresaId = token.empresaId as string;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
