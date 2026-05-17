import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { CreateProjetoDto, ProjetoResponseDto } from './dtos';

export const registry = new OpenAPIRegistry();

// Autenticação Global (Bearer Token / Cookie)
const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/projetos',
  summary: 'Cria um novo projeto',
  description: 'Endpoint REST para criar um projeto a partir do ERP externo. Requer permissão projetos:write.',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateProjetoDto },
      },
    },
  },
  responses: {
    201: {
      description: 'Projeto criado com sucesso',
      content: {
        'application/json': { schema: ProjetoResponseDto },
      },
    },
    400: { description: 'Erro de validação nos dados enviados' },
    401: { description: 'Não autorizado' },
    403: { description: 'Sem permissão (RBAC)' },
    429: { description: 'Rate limit excedido' }
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/projetos',
  summary: 'Lista projetos da Empresa',
  description: 'Retorna os últimos 50 projetos do Tenant ativo.',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Lista de Projetos',
      // No mundo real, englobaria num Zod Array do ProjetoResponseDto
    },
  },
});

export function generateOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MarcenAI Enterprise API',
      description: 'API Pública Integrável para ERPs e Máquinas CNC. Permite criar projetos, consultar status de fabricação e sincronizar listas de corte remotamente.',
    },
    servers: [{ url: '/api/v1' }],
  });
}
