/**
 * Setup Neon Test Branch
 * 
 * Creates a test database branch and updates .env.local automatically.
 * This script extracts project info from your existing connection string.
 * 
 * Requirements:
 * - NEON_API_KEY in .env.local or environment (get from Neon dashboard)
 * 
 * Usage:
 *   npm run test:branch:create
 *   or
 *   NEON_API_KEY=your-key npm run test:branch:create
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

// Read .env.local to get existing connection string
const envPath = join(process.cwd(), '.env.local');
let envContent: string;

try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('❌ ERROR: Could not read .env.local file');
  process.exit(1);
}

// Extract connection string
const postgresUrlMatch = envContent.match(/POSTGRES_URL="([^"]+)"/);
if (!postgresUrlMatch) {
  console.error('❌ ERROR: POSTGRES_URL not found in .env.local');
  process.exit(1);
}

const existingConnectionString = postgresUrlMatch[1];
const urlMatch = existingConnectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);

if (!urlMatch) {
  console.error('❌ ERROR: Could not parse POSTGRES_URL connection string');
  process.exit(1);
}

const [, username, password, host, database] = urlMatch;

// Extract project ID from hostname (Neon endpoint format: ep-xxx-xxx-xxx-pooler.region.aws.neon.tech)
// We'll need to get it from the API or user input
// For now, we'll try to get it from the Neon API by listing projects

const NEON_API_KEY = process.env.NEON_API_KEY || envContent.match(/NEON_API_KEY="?([^"\n]+)"?/)?.[1];

if (!NEON_API_KEY) {
  console.error('❌ ERROR: NEON_API_KEY is required');
  console.error('\n📝 To get your API key:');
  console.error('   1. Go to https://console.neon.tech/app/settings/api-keys');
  console.error('   2. Create a new API key');
  console.error('   3. Add it to .env.local: NEON_API_KEY="your-key-here"');
  console.error('   4. Or run: NEON_API_KEY=your-key npm run test:branch:create\n');
  process.exit(1);
}

const BRANCH_NAME = process.env.BRANCH_NAME || 'test-sandbox';
const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID || envContent.match(/NEON_PROJECT_ID="?([^"\n]+)"?/)?.[1];
const NEON_ORG_ID = process.env.NEON_ORG_ID || envContent.match(/NEON_ORG_ID="?([^"\n]+)"?/)?.[1];

async function getProjectId(): Promise<string> {
  console.log('🔍 Finding Neon project...');
  
  try {
    // Build API URL - include org_id if provided or if we get an error asking for it
    let apiUrl = 'https://console.neon.tech/api/v2/projects';
    if (NEON_ORG_ID) {
      apiUrl = `${apiUrl}?org_id=${NEON_ORG_ID}`;
      console.log(`   Using organization ID: ${NEON_ORG_ID}`);
    }
    
    // List all projects to find the one matching our connection string
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${NEON_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to list projects: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      // Provide helpful error messages
      if (response.status === 400) {
        // Check if it's asking for org_id
        if (errorMessage.toLowerCase().includes('org_id') || errorMessage.toLowerCase().includes('organization')) {
          console.error('\n❌ Organization ID Required (400)');
          console.error('   Your API key appears to be an Organization API key that requires an organization ID.');
          console.error('\n📝 How to find your Organization ID:');
          console.error('   1. Go to https://console.neon.tech/app/settings/organization');
          console.error('   2. Look at the URL or organization settings page');
          console.error('   3. The Organization ID is usually visible in the URL or settings');
          console.error('   4. Add it to .env.local: NEON_ORG_ID="your-org-id"');
          console.error('\n💡 Alternative Solutions:');
          console.error('   - Use a Personal API key instead (does not require org_id)');
          console.error('   - Get one from: https://console.neon.tech/app/settings/api-keys');
          console.error('   - Or manually set NEON_PROJECT_ID in .env.local to skip auto-detection');
          console.error(`\n📝 Error details: ${errorMessage}\n`);
        } else {
          console.error('\n❌ Bad Request (400) - Possible causes:');
          console.error('   1. API key is project-scoped (cannot list all projects)');
          console.error('   2. API key is invalid or malformed');
          console.error('   3. API key has been revoked');
          console.error('\n💡 Solutions:');
          console.error('   - Use a Personal API key or Organization API key (not project-scoped)');
          console.error('   - Get a new key from: https://console.neon.tech/app/settings/api-keys');
          console.error('   - Or manually set NEON_PROJECT_ID in .env.local to skip auto-detection');
          console.error(`\n📝 Error details: ${errorMessage}\n`);
        }
      } else if (response.status === 401) {
        console.error('\n❌ Unauthorized (401) - API key is invalid or expired');
        console.error('   Get a new key from: https://console.neon.tech/app/settings/api-keys\n');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { projects } = data;
    
    // Try to match project by checking endpoints
    for (const project of projects) {
      const endpointsResponse = await fetch(
        `https://console.neon.tech/api/v2/projects/${project.id}/endpoints`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${NEON_API_KEY}`,
          },
        }
      );

      if (endpointsResponse.ok) {
        const { endpoints } = await endpointsResponse.json();
        const matchingEndpoint = endpoints.find((ep: any) => 
          ep.host === host || ep.host?.includes(host.split('.')[0])
        );

        if (matchingEndpoint) {
          console.log(`✅ Found project: ${project.name} (${project.id})\n`);
          return project.id;
        }
      }
    }

    // If no match found, use first project or ask user
    if (projects.length > 0) {
      console.log(`⚠️  Could not auto-detect project, using first project: ${projects[0].name}`);
      console.log(`   If this is wrong, set NEON_PROJECT_ID in .env.local\n`);
      return projects[0].id;
    }

    throw new Error('No projects found in Neon account');
  } catch (error) {
    console.error('❌ Error finding project:', error);
    throw error;
  }
}

async function createTestBranch(projectId: string) {
  console.log('🌿 Creating test branch...');
  console.log(`   Branch Name: ${BRANCH_NAME}`);
  console.log(`   Project ID: ${projectId}\n`);

  try {
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/branches`,
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
      const errorText = await response.text();
      let errorMessage = `Neon API error: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      // Handle specific errors
      if (response.status === 403 || errorMessage.toLowerCase().includes('no access') || errorMessage.toLowerCase().includes('access')) {
        console.error('\n❌ Access Denied (403) - Possible causes:');
        console.error('   1. API key does not have access to this project');
        console.error('   2. Project ID is incorrect (check if it starts with "ep-")');
        console.error('   3. Using project-scoped API key with wrong project');
        console.error('\n💡 Solutions:');
        console.error('   - Verify PROJECT ID is correct (not endpoint ID starting with "ep-")');
        console.error('   - Find PROJECT ID in Neon dashboard URL: https://console.neon.tech/app/projects/YOUR-PROJECT-ID');
        console.error('   - Use a Personal or Organization API key (not project-scoped)');
        console.error('   - Remove NEON_PROJECT_ID from .env.local to let script auto-detect');
        console.error(`\n📝 Current Project ID: ${projectId}`);
        if (projectId.startsWith('ep-')) {
          console.error('   ⚠️  This looks like an ENDPOINT ID, not a PROJECT ID!');
        }
        console.error(`📝 Error details: ${errorMessage}\n`);
        throw new Error(errorMessage);
      }

      // Check if branch already exists
      if (response.status === 409 || errorMessage.includes('already exists')) {
        console.log('⚠️  Branch already exists, fetching existing branch...');
        
        // Get existing branch
        const branchesResponse = await fetch(
          `https://console.neon.tech/api/v2/projects/${projectId}/branches`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${NEON_API_KEY}`,
            },
          }
        );

        if (branchesResponse.ok) {
          const { branches } = await branchesResponse.json();
          const existingBranch = branches.find((b: any) => b.name === BRANCH_NAME);
          
          if (existingBranch) {
            // Get endpoint for existing branch
            const endpointsResponse = await fetch(
              `https://console.neon.tech/api/v2/projects/${projectId}/endpoints?branch_id=${existingBranch.id}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${NEON_API_KEY}`,
                },
              }
            );

            if (endpointsResponse.ok) {
              const { endpoints } = await endpointsResponse.json();
              const endpoint = endpoints.find((ep: any) => ep.type === 'read_write') || endpoints[0];
              
              if (endpoint) {
                return {
                  branch: existingBranch,
                  endpoint,
                };
              }
            }
          }
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error creating branch:', error);
    throw error;
  }
}

async function main() {
  try {
    // Get project ID - use manual ID if provided, otherwise auto-detect
    let projectId: string;
    
    if (NEON_PROJECT_ID) {
      // Validate that it's not an endpoint ID
      if (NEON_PROJECT_ID.startsWith('ep-')) {
        console.error('\n❌ ERROR: The ID provided starts with "ep-", which is an ENDPOINT ID, not a PROJECT ID');
        console.error(`   Endpoint ID: ${NEON_PROJECT_ID}`);
        console.error('\n📝 How to find your PROJECT ID:');
        console.error('   1. Go to https://console.neon.tech/app/projects');
        console.error('   2. Click on your project');
        console.error('   3. Look at the URL - it will be: https://console.neon.tech/app/projects/YOUR-PROJECT-ID');
        console.error('   4. The PROJECT ID looks like: "cool-forest-86753099" or "hidden-river-50598307"');
        console.error('      (human-readable name with numbers, NOT starting with "ep-")');
        console.error('\n💡 Project IDs vs Endpoint IDs:');
        console.error('   - Project ID: "cool-forest-86753099" (in project URL)');
        console.error('   - Endpoint ID: "ep-xxx-xxx" (in connection string hostname)');
        console.error('\n   Remove NEON_PROJECT_ID from .env.local to let the script auto-detect it.\n');
        process.exit(1);
      }
      
      console.log(`✅ Using project ID from .env.local: ${NEON_PROJECT_ID}\n`);
      projectId = NEON_PROJECT_ID;
    } else {
      projectId = await getProjectId();
    }

    // Create branch
    const { branch, endpoints } = await createTestBranch(projectId);
    const endpoint = endpoints?.[0];

    if (!endpoint) {
      throw new Error('No endpoint created for branch');
    }

    console.log('✅ Branch created successfully!');
    console.log(`   Branch ID: ${branch.id}`);
    console.log(`   Branch Name: ${branch.name}`);
    console.log(`   Endpoint: ${endpoint.host}\n`);

    // Build new connection string
    const testConnectionString = `postgresql://${username}:${password}@${endpoint.host}/${database}?sslmode=require`;

    // Backup original connection string as comment
    const originalUrlComment = `# Original production URL (backup):\n# POSTGRES_URL="${existingConnectionString}"\n\n# Test branch: ${BRANCH_NAME} (${branch.id})\n`;

    // Update .env.local
    let updatedEnv = envContent;
    
    // Remove any existing test branch comments
    updatedEnv = updatedEnv.replace(/# Test branch:.*\n/g, '');
    updatedEnv = updatedEnv.replace(/# Original production URL.*\n/g, '');
    
    // Replace POSTGRES_URL
    updatedEnv = updatedEnv.replace(
      /POSTGRES_URL="[^"]*"/,
      `POSTGRES_URL="${testConnectionString}"`
    );

    // Add comments before POSTGRES_URL
    if (!updatedEnv.includes('Original production URL')) {
      updatedEnv = updatedEnv.replace(
        /(POSTGRES_URL="[^"]*")/,
        `${originalUrlComment}$1`
      );
    }

    writeFileSync(envPath, updatedEnv, 'utf-8');

    console.log('✅ Updated .env.local with test branch connection');
    console.log(`\n📝 Test Branch Details:`);
    console.log(`   Name: ${branch.name}`);
    console.log(`   ID: ${branch.id}`);
    console.log(`   Endpoint: ${endpoint.host}`);
    console.log(`   Database: ${database}`);
    console.log(`\n💡 Your local environment now uses the test branch.`);
    console.log(`💡 Production database is unchanged.`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Run: npm run db:push (to sync schema to test branch)`);
    console.log(`   2. Run: npm run seed:test (to add test data)`);
    console.log(`   3. Test your changes safely!`);
    console.log(`\n🗑️  To delete this branch later:`);
    console.log(`   npm run test:branch:delete`);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
