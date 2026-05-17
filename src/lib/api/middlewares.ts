import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { apiRatelimit } from './rate-limit';
import { hasPermission } from '@/lib/auth/roles';
import { UserRole } from '@/lib/auth/roles';
import { v4 as uuidv4 } from 'uuid';
import { logSecurityEvent } from '@/lib/auth/security-logs';

type HandlerFunction = (req: NextRequest, ctx: { params?: any }, session: any) => Promise<NextResponse>;

/**
 * Enterprise Route Handler Middleware.
 * 1. Tracing ID (x-request-id)
 * 2. Autenticação JWT / Session
 * 3. Controle de Acesso (RBAC)
 * 4. Rate Limiting (Redis)
 * 5. Tratamento Global de Exceções
 * 6. Audit Logging
 */
export function withEnterpriseMiddleware(
  requiredPermission: string,
  handler: HandlerFunction
) {
  return async (req: NextRequest, ctx: { params?: any }) => {
    const requestId = req.headers.get('x-request-id') || uuidv4();
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    try {
      // 1. Rate Limit
      const { success, limit, reset, remaining } = await apiRatelimit.limit(`ratelimit_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }

      // 2. Autenticação (NextAuth) ou validação de API Key (ex: ERP Integration)
      // Aqui simplificado para usar o auth() do painel, mas numa API pública
      // avaliaríamos um Bearer Token nativo.
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // 3. RBAC
      if (!hasPermission(session.user.role as UserRole, requiredPermission)) {
        await logSecurityEvent({
          tabela: 'api_gateway',
          acao: 'forbidden_access_attempt',
          usuarioId: session.user.id,
          dadosNovos: { endpoint: req.nextUrl.pathname, ip }
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Executa o Handler
      const response = await handler(req, ctx, session);

      // Injeta cabeçalhos de observabilidade
      response.headers.set('X-Request-Id', requestId);
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      
      return response;

    } catch (error: any) {
      console.error(`[API Error][${requestId}]`, error);

      // Registra erro severo em logs
      await logSecurityEvent({
        tabela: 'api_gateway',
        acao: 'server_error',
        dadosNovos: { endpoint: req.nextUrl.pathname, error: error.message, requestId }
      });

      return NextResponse.json(
        { error: 'Internal Server Error', requestId }, 
        { status: 500 }
      );
    }
  };
}
