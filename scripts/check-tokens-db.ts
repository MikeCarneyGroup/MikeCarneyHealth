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

async function checkTokens() {
  console.log('Checking verification tokens in database...\n');
  
  try {
    const result = await sql`
      SELECT 
        identifier,
        value as token,
        expires_at as expires,
        NOW() as current_time,
        expires > NOW() as is_valid
      FROM verification_tokens
      ORDER BY expires DESC;
    `;
    
    console.log(`Found ${result.length} tokens:\n`);
    
    if (result.length === 0) {
      console.log('✅ No tokens in database');
    } else {
      result.forEach((row: any, index: number) => {
        console.log(`Token ${index + 1}:`);
        console.log(`  Email: ${row.identifier}`);
        console.log(`  Token: ${row.token.substring(0, 20)}...`);
        console.log(`  Expires: ${row.expires}`);
        console.log(`  Current: ${row.current_time}`);
        console.log(`  Valid: ${row.is_valid ? '✅ YES' : '❌ NO (expired)'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking tokens:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

checkTokens();

