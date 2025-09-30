/**
 * Database Seed Example
 * 
 * This file shows how to seed your database with initial data.
 * Run this after deploying to populate content.
 * 
 * Usage:
 * 1. Copy this file to seed.ts
 * 2. Update with your actual content
 * 3. Run: tsx lib/db/seed.ts (requires tsx: npm i -D tsx)
 */

import { db } from './index';
import { announcements, news, events, policies, downloads } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create sample announcements
    await db.insert(announcements).values([
      {
        title: 'Welcome to the Wellbeing Hub!',
        content: 'We\'re excited to launch our new staff wellbeing hub. Explore resources, stay connected, and prioritize your health.',
        isPublic: true,
        published: true,
      },
      {
        title: 'Mike Carney Health Memberships Now Active',
        content: 'All staff members can now activate their complimentary MCH gym membership. Contact HR for your access card.',
        isPublic: false,
        published: true,
      },
    ]);

    console.log('✅ Announcements created');

    // Create sample news articles
    await db.insert(news).values([
      {
        title: 'Q4 2024 Company Update',
        slug: 'q4-2024-company-update',
        excerpt: 'A look back at our achievements this quarter and what\'s ahead.',
        content: `We're proud to share the highlights from Q4 2024. Our team has achieved remarkable growth across all locations.

Key Highlights:
- Record sales across all dealerships
- New partnerships established
- Staff wellbeing initiatives launched
- Community involvement increased

Thank you to all staff for your dedication and hard work.`,
        published: true,
      },
      {
        title: 'New Health Initiatives for 2025',
        slug: 'new-health-initiatives-2025',
        excerpt: 'Exciting new programs launching in the new year.',
        content: `We're thrilled to announce several new health and wellbeing initiatives for 2025:

- Monthly wellness workshops
- Nutrition consultation services  
- Mental health first aid training
- Expanded gym class schedule
- Quarterly health screenings

These programs are designed to support your overall wellbeing.`,
        published: true,
      },
    ]);

    console.log('✅ News articles created');

    // Create sample events
    await db.insert(events).values([
      {
        title: 'Annual Staff BBQ',
        description: 'Join us for our annual staff appreciation BBQ. Food, drinks, and fun activities for the whole family!',
        location: 'Mike Carney Toyota - Townsville',
        startDate: new Date('2025-03-15T17:00:00'),
        endDate: new Date('2025-03-15T20:00:00'),
        published: true,
      },
      {
        title: 'Wellness Workshop: Managing Stress',
        description: 'Learn practical techniques for managing workplace stress. Led by a qualified psychologist.',
        location: 'Mike Carney Health Gym',
        startDate: new Date('2025-02-20T12:00:00'),
        endDate: new Date('2025-02-20T13:00:00'),
        published: true,
      },
      {
        title: 'Team Building Day',
        description: 'A day of team building activities and challenges. All staff welcome!',
        location: 'Pallarenda Beach',
        startDate: new Date('2025-04-10T09:00:00'),
        endDate: new Date('2025-04-10T15:00:00'),
        published: true,
      },
    ]);

    console.log('✅ Events created');

    // Create sample policies
    await db.insert(policies).values([
      {
        title: 'Code of Conduct',
        slug: 'code-of-conduct',
        description: 'Our standards for professional behavior and workplace ethics.',
        category: 'HR Policies',
        published: true,
      },
      {
        title: 'Work Health & Safety Policy',
        slug: 'work-health-safety-policy',
        description: 'Our commitment to maintaining a safe workplace for all staff.',
        category: 'Health & Safety',
        published: true,
      },
      {
        title: 'Leave and Entitlements',
        slug: 'leave-and-entitlements',
        description: 'Information about annual leave, sick leave, and other entitlements.',
        category: 'HR Policies',
        published: true,
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        description: 'How we collect, use, and protect your personal information.',
        category: 'Compliance',
        published: true,
      },
    ]);

    console.log('✅ Policies created');

    // Create sample downloads
    await db.insert(downloads).values([
      {
        title: 'Leave Application Form',
        description: 'Use this form to apply for annual leave, sick leave, or personal leave.',
        category: 'HR Forms',
        fileUrl: '#', // Update with actual file URL
        fileName: 'leave-application-form.pdf',
        published: true,
      },
      {
        title: 'Expense Reimbursement Form',
        description: 'Submit this form to claim reimbursement for work-related expenses.',
        category: 'Finance Forms',
        fileUrl: '#', // Update with actual file URL
        fileName: 'expense-reimbursement-form.pdf',
        published: true,
      },
      {
        title: 'MCH Class Schedule',
        description: 'Current schedule of all fitness classes at Mike Carney Health.',
        category: 'Health & Wellbeing',
        fileUrl: '#', // Update with actual file URL
        fileName: 'mch-class-schedule.pdf',
        published: true,
      },
    ]);

    console.log('✅ Downloads created');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
