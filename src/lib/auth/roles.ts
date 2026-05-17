/**
 * RBAC - Role-Based Access Control
 * Perfis mapeados para o sistema MarcenAI
 */

export type UserRole = 'admin' | 'engenharia' | 'producao' | 'comercial' | 'cliente';

export const RolePermissions: Record<UserRole, string[]> = {
  admin: ['*'], // Acesso total
  engenharia: [
    'projetos:read', 'projetos:write',
    'ambientes:read', 'ambientes:write',
    'moveis:read', 'moveis:write',
    'pecas:read', 'pecas:write',
    'validacoes:read', 'validacoes:write',
    'producao:read',
    'catalogo:read',
  ],
  producao: [
    'projetos:read',
    'producao:read', 'producao:write',
    'pecas:read',
    'moveis:read',
  ],
  comercial: [
    'projetos:read', 'projetos:write',
    'clientes:read', 'clientes:write',
    'orcamentos:read', 'orcamentos:write',
    'catalogo:read',
  ],
  cliente: [
    'projetos:read_own',
    'orcamentos:read_own',
  ],
};

/**
 * Verifica se a role possui a permissão requerida.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === 'admin') return true;
  
  const permissions = RolePermissions[role] || [];
  return permissions.includes(permission) || permissions.includes('*');
}

/**
 * Validação para Server Actions e API Routes.
 */
export function requirePermission(role: string | undefined, permission: string) {
  if (!role) throw new Error('Unauthorized: No role provided');
  
  if (!hasPermission(role as UserRole, permission)) {
    throw new Error(`Forbidden: Role ${role} missing permission ${permission}`);
  }
}
