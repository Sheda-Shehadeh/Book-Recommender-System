import { users, userBooks, type User, type UpsertUser, type UserBook, type InsertUserBook } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserBooks(userId: string): Promise<UserBook[]>;
  getUserBooksByStatus(userId: string, status: string): Promise<UserBook[]>;
  addUserBook(book: InsertUserBook): Promise<UserBook>;
  removeUserBook(userId: string, bookId: string): Promise<void>;
  updateUserBookStatus(userId: string, bookId: string, status: string): Promise<UserBook | undefined>;
  getUserBook(userId: string, bookId: string): Promise<UserBook | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserBooks(userId: string): Promise<UserBook[]> {
    return await db.select().from(userBooks).where(eq(userBooks.userId, userId));
  }

  async getUserBooksByStatus(userId: string, status: string): Promise<UserBook[]> {
    return await db.select().from(userBooks).where(
      and(eq(userBooks.userId, userId), eq(userBooks.status, status))
    );
  }

  async addUserBook(book: InsertUserBook): Promise<UserBook> {
    const existing = await this.getUserBook(book.userId, book.bookId);
    if (existing) {
      const [updated] = await db
        .update(userBooks)
        .set({ status: book.status, updatedAt: new Date() })
        .where(and(eq(userBooks.userId, book.userId), eq(userBooks.bookId, book.bookId)))
        .returning();
      return updated;
    }
    const [userBook] = await db.insert(userBooks).values(book).returning();
    return userBook;
  }

  async removeUserBook(userId: string, bookId: string): Promise<void> {
    await db.delete(userBooks).where(
      and(eq(userBooks.userId, userId), eq(userBooks.bookId, bookId))
    );
  }

  async updateUserBookStatus(userId: string, bookId: string, status: string): Promise<UserBook | undefined> {
    const [updated] = await db
      .update(userBooks)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(userBooks.userId, userId), eq(userBooks.bookId, bookId)))
      .returning();
    return updated;
  }

  async getUserBook(userId: string, bookId: string): Promise<UserBook | undefined> {
    const [book] = await db.select().from(userBooks).where(
      and(eq(userBooks.userId, userId), eq(userBooks.bookId, bookId))
    );
    return book;
  }
}

export const storage = new DatabaseStorage();
