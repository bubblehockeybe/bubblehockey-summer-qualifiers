import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Table pour les inscriptions aux entraînements
export const trainingSignups = mysqlTable("training_signups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  trainingDate: varchar("trainingDate", { length: 10 }).notNull(), // Format: "19/07"
  acceptsContact: int("acceptsContact").default(1).notNull(), // 1 = true, 0 = false
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrainingSignup = typeof trainingSignups.$inferSelect;
export type InsertTrainingSignup = typeof trainingSignups.$inferInsert;

// Table pour tracker les emails de confirmation envoyés
export const confirmationEmails = mysqlTable("confirmation_emails", {
  id: int("id").autoincrement().primaryKey(),
  trainingDate: varchar("trainingDate", { length: 10 }).notNull(), // Format: "19/07"
  emailSentAt: timestamp("emailSentAt").defaultNow().notNull(),
  recipientCount: int("recipientCount").notNull(), // Nombre de personnes qui ont reçu l'email
});

export type ConfirmationEmail = typeof confirmationEmails.$inferSelect;
export type InsertConfirmationEmail = typeof confirmationEmails.$inferInsert;