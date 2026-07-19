import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, trainingSignups, confirmationEmails, type InsertTrainingSignup, type TrainingSignup, type ConfirmationEmail } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Ajouter une inscription à un entraînement
export async function addTrainingSignup(signup: InsertTrainingSignup): Promise<TrainingSignup | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add training signup: database not available");
    return null;
  }

  try {
    const result = await db.insert(trainingSignups).values(signup);
    if (result[0]?.insertId) {
      const inserted = await db.select().from(trainingSignups).where(eq(trainingSignups.id, result[0].insertId as number)).limit(1);
      return inserted.length > 0 ? inserted[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to add training signup:", error);
    throw error;
  }
}

// Obtenir les inscriptions pour une date
export async function getSignupsForDate(trainingDate: string): Promise<TrainingSignup[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get signups: database not available");
    return [];
  }

  try {
    return await db.select().from(trainingSignups).where(eq(trainingSignups.trainingDate, trainingDate));
  } catch (error) {
    console.error("[Database] Failed to get signups:", error);
    return [];
  }
}

// Vérifier si un email de confirmation a déjà été envoyé pour une date
export async function hasConfirmationEmailBeenSent(trainingDate: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot check confirmation email: database not available");
    return false;
  }

  try {
    const result = await db.select().from(confirmationEmails).where(eq(confirmationEmails.trainingDate, trainingDate)).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("[Database] Failed to check confirmation email:", error);
    return false;
  }
}

// Enregistrer qu'un email de confirmation a été envoyé
export async function recordConfirmationEmail(trainingDate: string, recipientCount: number): Promise<ConfirmationEmail | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record confirmation email: database not available");
    return null;
  }

  try {
    const result = await db.insert(confirmationEmails).values({
      trainingDate,
      recipientCount,
    });
    if (result[0]?.insertId) {
      const inserted = await db.select().from(confirmationEmails).where(eq(confirmationEmails.id, result[0].insertId as number)).limit(1);
      return inserted.length > 0 ? inserted[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to record confirmation email:", error);
    throw error;
  }
}
