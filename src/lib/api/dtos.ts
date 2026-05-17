import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateProjetoDto = z.object({
  clienteId: z.string().uuid().openapi({ description: 'ID do cliente', example: '123e4567-e89b-12d3-a456-426614174000' }),
  nome: z.string().min(3).max(255).openapi({ description: 'Nome do Projeto', example: 'Cozinha Planejada Apartamento 44' }),
  valorTotal: z.number().positive().optional().openapi({ description: 'Valor estimado', example: 15500.50 }),
  notas: z.string().optional().openapi({ description: 'Observações de engenharia' }),
}).openapi('CreateProjetoRequest');

export const ProjetoResponseDto = z.object({
  id: z.string().uuid(),
  empresaId: z.string().uuid(),
  clienteId: z.string().uuid(),
  nome: z.string(),
  status: z.string(),
  createdAt: z.string(),
}).openapi('ProjetoResponse');

export type CreateProjetoData = z.infer<typeof CreateProjetoDto>;
