import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function regenerateSession(req: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const userId = req.session.userId;
    req.session.regenerate((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }
      req.session.userId = userId;
      req.session.save((saveErr: Error | null) => {
        if (saveErr) {
          reject(saveErr);
          return;
        }
        resolve();
      });
    });
  });
}

export function getSession() {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session && (req.session as any).userId) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
