import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { IUserRepository } from "../../domain/repositories";
import { User } from "../../domain/entities";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    const dbUser = result[0];
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      name: dbUser.nome,
      email: dbUser.email,
      passwordHash: dbUser.senhaHash,
      image: dbUser.image || null,
      active: dbUser.ativo,
      role: dbUser.role,
      empresaId: dbUser.empresaId,
      createdAt: dbUser.createdAt || new Date(),
      updatedAt: dbUser.updatedAt || new Date(),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    const dbUser = result[0];
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      name: dbUser.nome,
      email: dbUser.email,
      passwordHash: dbUser.senhaHash,
      image: dbUser.image || null,
      active: dbUser.ativo,
      role: dbUser.role,
      empresaId: dbUser.empresaId,
      createdAt: dbUser.createdAt || new Date(),
      updatedAt: dbUser.updatedAt || new Date(),
    };
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const result = await db
      .insert(usuarios)
      .values({
        nome: user.name || "",
        email: user.email,
        senhaHash: user.passwordHash || "",
        ativo: user.active,
        image: user.image,
        empresaId: "00000000-0000-0000-0000-000000000000", // Fallback padrão
        role: "user",
      })
      .returning();

    const dbUser = result[0];
    return {
      id: dbUser.id,
      name: dbUser.nome,
      email: dbUser.email,
      passwordHash: dbUser.senhaHash,
      image: dbUser.image || null,
      active: dbUser.ativo,
      role: dbUser.role,
      empresaId: dbUser.empresaId,
      createdAt: dbUser.createdAt || new Date(),
      updatedAt: dbUser.updatedAt || new Date(),
    };
  }
}
