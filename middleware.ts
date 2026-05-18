import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Edge-compatible sem dependência de next-auth.
 * Verifica a presença do cookie de sessão para proteger rotas.
 */
export function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('__Secure-authjs.session-token');

  const { pathname } = request.nextUrl;

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/auth/login', '/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  const isApiRoute = pathname.startsWith('/api/');

  // Permite rotas de API de autenticação sem bloqueio
  if (isApiAuthRoute) return NextResponse.next();

  // APIs protegidas retornam 401 se não autenticado
  if (isApiRoute && !sessionToken) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Redireciona de /login antigo para /auth/login para evitar 404
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redireciona não autenticado para login
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redireciona autenticado para dashboard se tentar acessar rota pública
  if (sessionToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Pula rotas estáticas, imagens e favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
