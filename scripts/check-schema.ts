import { sql } from '@vercel/postgres';

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
    result.rows.forEach((row: any) => {
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
    constraints.rows.forEach((row: any) => {
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
    if (primaryKey.rows.length === 0) {
      console.log('  ❌ NO PRIMARY KEY FOUND!');
    } else {
      primaryKey.rows.forEach((row: any) => {
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

