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

async function migrateVerificationTable() {
  console.log('Migrating verification_tokens table to Better Auth schema...\n');

  try {
    // Check current table structure
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'verification_tokens'
      ORDER BY ordinal_position;
    `;

    console.log('Current columns:', columns.map((r: any) => r.column_name));

    // Check if 'id' column exists
    const hasId = columns.some((r: any) => r.column_name === 'id');
    const hasValue = columns.some((r: any) => r.column_name === 'value');
    const hasExpiresAt = columns.some((r: any) => r.column_name === 'expires_at');

    if (hasId && hasValue && hasExpiresAt) {
      console.log('✅ Table already has the correct structure!');
      return;
    }

    console.log('⚠️  Table structure needs migration...');

    // Drop the old table and recreate with new structure
    console.log('Dropping old table...');
    await sql`DROP TABLE IF EXISTS verification_tokens CASCADE;`;

    console.log('Creating new table with Better Auth schema...');
    await sql`
      CREATE TABLE verification_tokens (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateVerificationTable()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
