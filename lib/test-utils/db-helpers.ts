/**
 * Test Database Utilities
 * 
 * Reusable utilities for creating and managing test data in the database.
 * Use these helpers in your tests to maintain consistency and reduce boilerplate.
 */

import { db } from '@/lib/db';
import { users, announcements, news, events, policies, submissions } from '@/lib/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq, sql, and, like, or } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

// Safety check helper
export function ensureTestEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Test utilities cannot be used in production environment');
  }
}

/**
 * Create a test user with default values
 */
export async function createTestUser(
  overrides?: Partial<InferInsertModel<typeof users>>
): Promise<InferInsertModel<typeof users>> {
  ensureTestEnvironment();

  const testUser = {
    id: createId(),
    email: `test-${createId()}@mikecarneytoyota.com.au`,
    name: 'Test User',
    role: 'staff' as const,
    ...overrides,
  };

  const [inserted] = await db.insert(users).values(testUser).returning();
  return inserted;
}

/**
 * Create multiple test users at once
 */
export async function createTestUsers(
  count: number,
  role: 'staff' | 'editor' | 'admin' = 'staff'
): Promise<InferInsertModel<typeof users>[]> {
  ensureTestEnvironment();

  const testUsers = Array.from({ length: count }, (_, i) => ({
    id: `test-user-${role}-${i + 1}`,
    email: `test-${role}-${i + 1}@mikecarneytoyota.com.au`,
    name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)} User ${i + 1}`,
    role,
  }));

  return await db.insert(users).values(testUsers).returning();
}

/**
 * Create a test announcement
 */
export async function createTestAnnouncement(
  overrides?: Partial<InferInsertModel<typeof announcements>>
): Promise<InferInsertModel<typeof announcements>> {
  ensureTestEnvironment();

  let authorId: string | null | undefined = overrides?.authorId;
  if (!authorId) {
    const testUser = await createTestUser({ role: 'admin' });
    authorId = testUser.id!; // id is always present after insert
  }

  const { authorId: _, ...restOverrides } = overrides || {};
  const testAnnouncement = {
    id: createId(),
    title: `[TEST] Test Announcement ${createId()}`,
    content: 'This is a test announcement for development and testing.',
    authorId: authorId || undefined,
    isPublic: true,
    published: true,
    ...restOverrides,
  };

  const [inserted] = await db.insert(announcements).values([testAnnouncement]).returning();
  return inserted;
}

/**
 * Create a test news article
 */
export async function createTestNews(
  overrides?: Partial<InferInsertModel<typeof news>>
): Promise<InferInsertModel<typeof news>> {
  ensureTestEnvironment();

  let authorId: string | null | undefined = overrides?.authorId;
  if (!authorId) {
    const testUser = await createTestUser({ role: 'editor' });
    authorId = testUser.id!; // id is always present after insert
  }

  const { authorId: _, ...restOverrides } = overrides || {};
  const slug = restOverrides.slug || `test-news-${createId()}`;
  const testNews = {
    id: createId(),
    title: `[TEST] Test News Article ${createId()}`,
    slug,
    excerpt: 'This is a test news article excerpt.',
    content: 'This is the full content of a test news article.',
    authorId: authorId || undefined,
    published: true,
    ...restOverrides,
  };

  const [inserted] = await db.insert(news).values([testNews]).returning();
  return inserted;
}

/**
 * Create a test event
 */
export async function createTestEvent(
  overrides?: Partial<InferInsertModel<typeof events>>
): Promise<InferInsertModel<typeof events>> {
  ensureTestEnvironment();

  const testEvent = {
    id: createId(),
    title: `[TEST] Test Event ${createId()}`,
    description: 'This is a test event for development and testing.',
    location: 'Test Location',
    startDate: new Date('2025-12-31T10:00:00'),
    endDate: new Date('2025-12-31T14:00:00'),
    published: true,
    ...overrides,
  };

  const [inserted] = await db.insert(events).values([testEvent]).returning();
  return inserted;
}

/**
 * Create a test submission
 */
export async function createTestSubmission(
  overrides?: Partial<InferInsertModel<typeof submissions>>
): Promise<InferInsertModel<typeof submissions>> {
  ensureTestEnvironment();

  // Ensure authorId is set - create a test user if not provided
  // Note: authorId is required for submissions, so it must be a string
  let authorId: string;
  if (overrides?.authorId) {
    authorId = overrides.authorId;
  } else {
    const testUser = await createTestUser({ role: 'staff' });
    authorId = testUser.id!; // id is always present after insert
  }

  const { authorId: _, ...restOverrides } = overrides || {};
  const testSubmission = {
    id: createId(),
    type: 'story' as const,
    title: `[TEST] Test Submission ${createId()}`,
    content: 'This is a test submission for development and testing.',
    authorId, // Required field, guaranteed to be defined
    status: 'pending' as const,
    ...restOverrides,
  };

  const [inserted] = await db.insert(submissions).values([testSubmission]).returning();
  return inserted;
}

/**
 * Clean up all test data from the database
 * 
 * WARNING: This deletes all data with test identifiers.
 * Only use in test/development environments.
 */
export async function cleanupTestData() {
  ensureTestEnvironment();

  console.log('🧹 Cleaning up test data...');

  try {
    await db.transaction(async (tx) => {
      // Delete test submissions
      const deletedSubmissions = await tx
        .delete(submissions)
        .where(like(submissions.title, '[TEST]%'))
        .returning();
      console.log(`   Deleted ${deletedSubmissions.length} test submissions`);

      // Delete test policies
      const deletedPolicies = await tx
        .delete(policies)
        .where(like(policies.title, '[TEST]%'))
        .returning();
      console.log(`   Deleted ${deletedPolicies.length} test policies`);

      // Delete test events
      const deletedEvents = await tx
        .delete(events)
        .where(like(events.title, '[TEST]%'))
        .returning();
      console.log(`   Deleted ${deletedEvents.length} test events`);

      // Delete test news
      const deletedNews = await tx
        .delete(news)
        .where(like(news.title, '[TEST]%'))
        .returning();
      console.log(`   Deleted ${deletedNews.length} test news articles`);

      // Delete test announcements
      const deletedAnnouncements = await tx
        .delete(announcements)
        .where(like(announcements.title, '[TEST]%'))
        .returning();
      console.log(`   Deleted ${deletedAnnouncements.length} test announcements`);

      // Delete test users (by email pattern)
      const deletedUsers = await tx
        .delete(users)
        .where(
          or(
            like(users.email, 'test-%@%'),
            sql`${users.id} LIKE 'test-%'`
          )
        )
        .returning();
      console.log(`   Deleted ${deletedUsers.length} test users`);
    });

    console.log('✅ Test data cleanup complete');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
    throw error;
  }
}

/**
 * Delete a specific test user by ID
 */
export async function deleteTestUser(userId: string) {
  ensureTestEnvironment();
  await db.delete(users).where(eq(users.id, userId));
}

/**
 * Delete a specific test record by ID and table
 */
export async function deleteTestRecord(
  table: 'announcements' | 'news' | 'events' | 'policies' | 'submissions',
  id: string
) {
  ensureTestEnvironment();

  switch (table) {
    case 'announcements':
      await db.delete(announcements).where(eq(announcements.id, id));
      break;
    case 'news':
      await db.delete(news).where(eq(news.id, id));
      break;
    case 'events':
      await db.delete(events).where(eq(events.id, id));
      break;
    case 'policies':
      await db.delete(policies).where(eq(policies.id, id));
      break;
    case 'submissions':
      await db.delete(submissions).where(eq(submissions.id, id));
      break;
  }
}

// Re-export for convenience
export { db } from '@/lib/db';
