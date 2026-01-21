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

async function checkSchema() {
  console.log('Checking verification_tokens table structure...\n');
  
  try {
    // Check table structure
    const result = await sql`
      SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'verification_tokens'
      ORDER BY ordinal_position;
    `;
    
    console.log('Table columns:');
    result.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check constraints
    const constraints = await sql`
      SELECT 
        constraint_name,
        constraint_type
      FROM information_schema.table_constraints 
      WHERE table_name = 'verification_tokens';
    `;
    
    console.log('\nTable constraints:');
    constraints.forEach((row: any) => {
      console.log(`  - ${row.constraint_name}: ${row.constraint_type}`);
    });
    
    // Check primary key
    const primaryKey = await sql`
      SELECT 
        a.attname as column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'verification_tokens'::regclass
      AND i.indisprimary;
    `;
    
    console.log('\nPrimary key columns:');
    if (primaryKey.length === 0) {
      console.log('  ❌ NO PRIMARY KEY FOUND!');
    } else {
      primaryKey.forEach((row: any) => {
        console.log(`  ✅ ${row.column_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

checkSchema();

