/**
 * Create Neon Test Branch Script
 * 
 * Creates a new Neon database branch for testing and updates .env.local
 * with the test branch connection string.
 * 
 * Requirements:
 * - NEON_API_KEY environment variable (get from Neon dashboard)
 * - NEON_PROJECT_ID environment variable (extracted from connection string or dashboard)
 * 
 * Usage:
 *   NEON_API_KEY=your-key NEON_PROJECT_ID=your-project-id tsx scripts/create-test-branch.ts
 *   or
 *   dotenv -e .env.local -- tsx scripts/create-test-branch.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const NEON_API_KEY = process.env.NEON_API_KEY;
const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID;
const BRANCH_NAME = process.env.BRANCH_NAME || 'test-sandbox';

if (!NEON_API_KEY) {
  console.error('❌ ERROR: NEON_API_KEY environment variable is required');
  console.error('   Get your API key from: https://console.neon.tech/app/settings/api-keys');
  process.exit(1);
}

if (!NEON_PROJECT_ID) {
  console.error('❌ ERROR: NEON_PROJECT_ID environment variable is required');
  console.error('   You can find your project ID in the Neon dashboard URL or connection string');
  process.exit(1);
}

async function createTestBranch() {
  console.log('🌿 Creating Neon test branch...');
  console.log(`   Project ID: ${NEON_PROJECT_ID}`);
  console.log(`   Branch Name: ${BRANCH_NAME}\n`);

  try {
    // Create branch via Neon API
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${NEON_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: {
            name: BRANCH_NAME,
            init_source: 'parent-data', // Copy schema + data from parent
          },
          endpoints: [
            {
              type: 'read_write',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to create branch:', error);
      throw new Error(`Neon API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const branch = data.branch;
    const endpoint = data.endpoints?.[0];

    if (!endpoint) {
      throw new Error('No endpoint created for branch');
    }

    console.log('✅ Branch created successfully!');
    console.log(`   Branch ID: ${branch.id}`);
    console.log(`   Branch Name: ${branch.name}`);
    console.log(`   Endpoint ID: ${endpoint.id}`);
    console.log(`   Host: ${endpoint.host}\n`);

    // Extract connection details from existing POSTGRES_URL
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    
    // Extract username and password from existing connection string
    const existingUrlMatch = envContent.match(/POSTGRES_URL="postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
    
    if (!existingUrlMatch) {
      throw new Error('Could not parse existing POSTGRES_URL from .env.local');
    }

    const [, username, password, , database] = existingUrlMatch;
    
    // Build new connection string for test branch
    const testConnectionString = `postgresql://${username}:${password}@${endpoint.host}/${database}?sslmode=require`;
    
    // Update .env.local
    const updatedEnv = envContent.replace(
      /POSTGRES_URL="[^"]*"/,
      `POSTGRES_URL="${testConnectionString}"`
    );

    // Add comment about test branch
    if (!updatedEnv.includes('# Test branch connection')) {
      const postgresUrlLine = updatedEnv.match(/POSTGRES_URL="[^"]*"/);
      if (postgresUrlLine) {
        const updatedWithComment = updatedEnv.replace(
          /(POSTGRES_URL="[^"]*")/,
          `# Test branch: ${BRANCH_NAME} (${branch.id})\n$1`
        );
        writeFileSync(envPath, updatedWithComment, 'utf-8');
      } else {
        writeFileSync(envPath, updatedEnv, 'utf-8');
      }
    } else {
      writeFileSync(envPath, updatedEnv, 'utf-8');
    }

    console.log('✅ Updated .env.local with test branch connection string');
    console.log(`\n📝 Test Branch Details:`);
    console.log(`   Branch Name: ${branch.name}`);
    console.log(`   Branch ID: ${branch.id}`);
    console.log(`   Connection: ${endpoint.host}`);
    console.log(`\n💡 Your .env.local now points to the test branch.`);
    console.log(`💡 To switch back to production, update POSTGRES_URL in .env.local`);
    console.log(`💡 To delete this branch, use: npm run test:branch:delete`);
    
    return {
      branchId: branch.id,
      branchName: branch.name,
      connectionString: testConnectionString,
      endpoint: endpoint.host,
    };
  } catch (error) {
    console.error('❌ Error creating test branch:', error);
    throw error;
  }
}

// Run the script
createTestBranch()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
