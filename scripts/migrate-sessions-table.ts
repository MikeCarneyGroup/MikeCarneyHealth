import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL is not set in environment variables');
  process.exit(1);
}

const sql = neon(POSTGRES_URL);

async function migrateSessionsTable() {
  console.log('Migrating sessions table to Better Auth schema...\n');

  try {
    // Check current table structure
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'sessions'
      ORDER BY ordinal_position;
    `;

    console.log('Current columns:', columns.map((r: any) => r.column_name));

    // Check if required columns exist
    const hasCreatedAt = columns.some((r: any) => r.column_name === 'created_at');
    const hasUpdatedAt = columns.some((r: any) => r.column_name === 'updated_at');

    if (hasCreatedAt && hasUpdatedAt) {
      console.log('✅ Table already has the correct structure!');
      return;
    }

    console.log('⚠️  Table structure needs migration...');

    // Add missing columns if they don't exist
    if (!hasCreatedAt) {
      console.log('Adding created_at column...');
      await sql`
        ALTER TABLE sessions
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
      `;
    }

    if (!hasUpdatedAt) {
      console.log('Adding updated_at column...');
      await sql`
        ALTER TABLE sessions
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
      `;
    }

    // Update existing rows to have timestamps (use expires as fallback for created_at)
    console.log('Updating existing rows with timestamps...');
    await sql`
      UPDATE sessions
      SET created_at = COALESCE(created_at, expires - INTERVAL '7 days'),
          updated_at = COALESCE(updated_at, expires)
      WHERE created_at IS NULL OR updated_at IS NULL;
    `;

    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateSessionsTable()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
