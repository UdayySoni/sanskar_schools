import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const content = sqliteTable("content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    studentName: text("student_name").notNull(),
    parentName: text("parent_name").notNull().default(""),
    phone: text("phone").notNull(),
    email: text("email").notNull().default(""),
    grade: text("grade").notNull(),
    wing: text("wing").notNull(),
    city: text("city").notNull().default(""),
    message: text("message").notNull().default(""),
    source: text("source").notNull().default("website"),
    status: text("status").notNull().default("new"),
    emailStatus: text("email_status").notNull().default("pending"),
    ipHash: text("ip_hash").notNull().default(""),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    index("idx_leads_created_at").on(table.createdAt),
    index("idx_leads_status_created_at").on(table.status, table.createdAt),
    index("idx_leads_ip_hash_created_at").on(table.ipHash, table.createdAt),
  ],
)

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    objectKey: text("object_key").notNull().unique(),
    fileName: text("file_name").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    altText: text("alt_text").notNull().default(""),
    category: text("category").notNull().default("Campus"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_media_created_at").on(table.createdAt)],
)

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: text("id").primaryKey(),
    ipHash: text("ip_hash").notNull(),
    successful: integer("successful", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_login_attempts_ip_created_at").on(table.ipHash, table.createdAt)],
)

export const adminConfig = sqliteTable("admin_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull(),
})

export const adminUsers = sqliteTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    displayName: text("display_name").notNull().default(""),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    lastLoginAt: integer("last_login_at"),
  },
  (table) => [index("idx_admin_users_active_username").on(table.active, table.username)],
)

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    action: text("action").notNull(),
    details: text("details").notNull().default(""),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_audit_log_created_at").on(table.createdAt)],
)

export const adminSessions = sqliteTable("admin_sessions", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, table => [
  index("idx_admin_sessions_username").on(table.username),
  index("idx_admin_sessions_expires_at").on(table.expiresAt),
])
