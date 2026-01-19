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

async function migrateSessionsOptionalFields() {
  console.log('Adding optional fields (ip_address, user_agent) to sessions table...\n');

  try {
    // Check current table structure
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'sessions'
      ORDER BY ordinal_position;
    `;

    console.log('Current columns:', columns.map((r: any) => r.column_name));

    // Check if optional columns exist
    const hasIpAddress = columns.some((r: any) => r.column_name === 'ip_address');
    const hasUserAgent = columns.some((r: any) => r.column_name === 'user_agent');

    if (hasIpAddress && hasUserAgent) {
      console.log('✅ Table already has the optional fields!');
      return;
    }

    console.log('⚠️  Adding missing optional fields...');

    // Add missing columns if they don't exist
    if (!hasIpAddress) {
      console.log('Adding ip_address column...');
      await sql`
        ALTER TABLE sessions
        ADD COLUMN IF NOT EXISTS ip_address TEXT;
      `;
    }

    if (!hasUserAgent) {
      console.log('Adding user_agent column...');
      await sql`
        ALTER TABLE sessions
        ADD COLUMN IF NOT EXISTS user_agent TEXT;
      `;
    }

    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateSessionsOptionalFields()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
