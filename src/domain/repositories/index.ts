import { Tenant, User, TenantUser } from '../entities';

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant>;
  update(id: string, data: Partial<Tenant>): Promise<Tenant>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}

export interface ITenantUserRepository {
  findByUserId(userId: string): Promise<(TenantUser & { tenant: Tenant })[]>;
  addUserToTenant(tenantId: string, userId: string, role: string): Promise<TenantUser>;
}
