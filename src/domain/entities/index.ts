export type Role = 'owner' | 'admin' | 'engineer' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  image: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  document: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  createdAt: Date;
}
