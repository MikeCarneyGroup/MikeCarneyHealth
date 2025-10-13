import { pgTable, text, timestamp, boolean, integer, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const roleEnum = pgEnum('role', ['staff', 'editor', 'admin']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'approved', 'rejected']);
export const submissionTypeEnum = pgEnum('submission_type', ['story', 'idea']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: roleEnum('role').notNull().default('staff'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Accounts table (for OAuth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Verification tokens (for email OTP)
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
}));

// Announcements
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').references(() => users.id),
  isPublic: boolean('is_public').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// News articles
export const news = pgTable('news', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  authorId: text('author_id').references(() => users.id),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Policies
export const policies = pgTable('policies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  category: text('category').notNull(),
  fileUrl: text('file_url'),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Events
export const events = pgTable('events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Staff Submissions
export const submissions = pgTable('submissions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  type: submissionTypeEnum('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  status: submissionStatusEnum('status').default('pending').notNull(),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewNote: text('review_note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Downloads (forms and documents)
export const downloads = pgTable('downloads', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size'),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
