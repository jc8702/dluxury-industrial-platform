import { db } from '../db/drizzle';
import { users } from '../db/schema';
import { IUserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';
import { eq } from 'drizzle-orm';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
}
