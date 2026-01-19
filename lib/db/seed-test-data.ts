/**
 * Test Data Seed Script
 * 
 * Seeds the database with test data for development and testing.
 * 
 * Safety: This script checks for production environment and uses clearly
 * identifiable test data (prefixed with 'test-').
 * 
 * Usage:
 *   npm run seed:test
 *   or
 *   dotenv -e .env.local -- tsx lib/db/seed-test-data.ts
 */

import { db } from './index';
import { users, announcements, news, events, policies, submissions } from './schema';
import { createId } from '@paralleldrive/cuid2';
import { eq, sql } from 'drizzle-orm';

// Safety check: Never run in production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: Cannot seed test data in production environment!');
  process.exit(1);
}

// Verify we're using a test database (optional but recommended)
const postgresUrl = process.env.POSTGRES_URL || '';
if (postgresUrl.includes('production') || postgresUrl.includes('prod')) {
  console.error('❌ ERROR: POSTGRES_URL appears to point to production database!');
  console.error('   Use a test database or Neon branch for test data.');
  process.exit(1);
}

async function seedTestData() {
  console.log('🌱 Seeding test data...');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database: ${postgresUrl ? 'Connected' : 'Not configured'}\n`);

  try {
    // Use transaction for atomic operations
    await db.transaction(async (tx) => {
      // Create test users with different roles
      const testUsers = await tx.insert(users).values([
        {
          id: 'test-user-staff-1',
          email: 'test-staff-1@mikecarneytoyota.com.au',
          name: 'Test Staff User 1',
          role: 'staff',
        },
        {
          id: 'test-user-staff-2',
          email: 'test-staff-2@inghamtoyota.com.au',
          name: 'Test Staff User 2',
          role: 'staff',
        },
        {
          id: 'test-user-editor-1',
          email: 'test-editor-1@mikecarneytoyota.com.au',
          name: 'Test Editor User',
          role: 'editor',
        },
        {
          id: 'test-user-admin-1',
          email: 'test-admin-1@mikecarneytoyota.com.au',
          name: 'Test Admin User',
          role: 'admin',
        },
      ]).returning();

      console.log(`✅ Created ${testUsers.length} test users`);

      // Create test announcements
      const testAnnouncements = await tx.insert(announcements).values([
        {
          id: 'test-announcement-1',
          title: '[TEST] Welcome to Test Environment',
          content: 'This is a test announcement for development and testing purposes.',
          authorId: 'test-user-admin-1',
          isPublic: true,
          published: true,
        },
        {
          id: 'test-announcement-2',
          title: '[TEST] Internal Test Announcement',
          content: 'This is a test internal announcement.',
          authorId: 'test-user-editor-1',
          isPublic: false,
          published: true,
        },
        {
          id: 'test-announcement-3',
          title: '[TEST] Unpublished Test Announcement',
          content: 'This test announcement is not published.',
          authorId: 'test-user-editor-1',
          isPublic: true,
          published: false,
        },
      ]).returning();

      console.log(`✅ Created ${testAnnouncements.length} test announcements`);

      // Create test news articles
      const testNews = await tx.insert(news).values([
        {
          id: 'test-news-1',
          title: '[TEST] Test News Article 1',
          slug: 'test-news-article-1',
          excerpt: 'This is a test news article excerpt.',
          content: 'This is the full content of test news article 1. Used for development and testing.',
          authorId: 'test-user-editor-1',
          published: true,
        },
        {
          id: 'test-news-2',
          title: '[TEST] Unpublished Test News',
          slug: 'test-unpublished-news',
          excerpt: 'This test news article is not published.',
          content: 'This test news article is not published and should not appear in public listings.',
          authorId: 'test-user-editor-1',
          published: false,
        },
      ]).returning();

      console.log(`✅ Created ${testNews.length} test news articles`);

      // Create test events
      const testEvents = await tx.insert(events).values([
        {
          id: 'test-event-1',
          title: '[TEST] Test Event - Future',
          description: 'This is a test event scheduled for the future.',
          location: 'Test Location',
          startDate: new Date('2025-12-31T10:00:00'),
          endDate: new Date('2025-12-31T14:00:00'),
          published: true,
        },
        {
          id: 'test-event-2',
          title: '[TEST] Test Event - Past',
          description: 'This is a test event that has already occurred.',
          location: 'Test Location',
          startDate: new Date('2024-01-01T10:00:00'),
          endDate: new Date('2024-01-01T14:00:00'),
          published: true,
        },
      ]).returning();

      console.log(`✅ Created ${testEvents.length} test events`);

      // Create test policies
      const testPolicies = await tx.insert(policies).values([
        {
          id: 'test-policy-1',
          title: '[TEST] Test Policy Document',
          slug: 'test-policy-document',
          description: 'This is a test policy document for development.',
          category: 'HR Policies',
          published: true,
        },
      ]).returning();

      console.log(`✅ Created ${testPolicies.length} test policies`);

      // Create test submissions
      const testSubmissions = await tx.insert(submissions).values([
        {
          id: 'test-submission-1',
          type: 'story',
          title: '[TEST] Test Story Submission',
          content: 'This is a test story submission from a staff member.',
          authorId: 'test-user-staff-1',
          status: 'pending',
        },
        {
          id: 'test-submission-2',
          type: 'idea',
          title: '[TEST] Test Idea Submission',
          content: 'This is a test idea submission for improvement suggestions.',
          authorId: 'test-user-staff-2',
          status: 'approved',
          reviewedBy: 'test-user-admin-1',
        },
      ]).returning();

      console.log(`✅ Created ${testSubmissions.length} test submissions`);
    });

    console.log('\n🎉 Test data seeded successfully!');
    console.log('\n📝 Test Users:');
    console.log('   - test-staff-1@mikecarneytoyota.com.au (staff)');
    console.log('   - test-staff-2@inghamtoyota.com.au (staff)');
    console.log('   - test-editor-1@mikecarneytoyota.com.au (editor)');
    console.log('   - test-admin-1@mikecarneytoyota.com.au (admin)');
    console.log('\n💡 All test data is prefixed with "[TEST]" or "test-" for easy identification.');
    console.log('💡 Use npm run test:cleanup to remove all test data.');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}

// Run the seed function
seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
