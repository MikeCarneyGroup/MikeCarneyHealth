import { sql } from '@vercel/postgres';

async function checkTokens() {
  console.log('Checking verification tokens in database...\n');
  
  try {
    const result = await sql`
      SELECT 
        identifier,
        token,
        expires,
        NOW() as current_time,
        expires > NOW() as is_valid
      FROM verification_tokens
      ORDER BY expires DESC;
    `;
    
    console.log(`Found ${result.rows.length} tokens:\n`);
    
    if (result.rows.length === 0) {
      console.log('✅ No tokens in database');
    } else {
      result.rows.forEach((row, index: number) => {
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

