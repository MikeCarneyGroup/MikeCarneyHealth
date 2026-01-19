/**
 * Delete Neon Test Branch
 * 
 * Deletes the test branch created for local development.
 * 
 * Requirements:
 * - NEON_API_KEY in .env.local or environment
 * - Test branch name (defaults to 'test-sandbox')
 * 
 * Usage:
 *   npm run test:branch:delete
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

const envPath = join(process.cwd(), '.env.local');
let envContent: string;

try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('❌ ERROR: Could not read .env.local file');
  process.exit(1);
}

const NEON_API_KEY = process.env.NEON_API_KEY || envContent.match(/NEON_API_KEY="?([^"\n]+)"?/)?.[1];
const BRANCH_NAME = process.env.BRANCH_NAME || 'test-sandbox';

if (!NEON_API_KEY) {
  console.error('❌ ERROR: NEON_API_KEY is required');
  process.exit(1);
}

async function getProjectAndBranch() {
  console.log('🔍 Finding project and branch...\n');

  try {
    const projectsResponse = await fetch('https://console.neon.tech/api/v2/projects', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${NEON_API_KEY}`,
      },
    });

    if (!projectsResponse.ok) {
      throw new Error(`Failed to list projects: ${projectsResponse.status}`);
    }

    const { projects } = await projectsResponse.json();

    // Find branch in all projects
    for (const project of projects) {
      const branchesResponse = await fetch(
        `https://console.neon.tech/api/v2/projects/${project.id}/branches`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${NEON_API_KEY}`,
          },
        }
      );

      if (branchesResponse.ok) {
        const { branches } = await branchesResponse.json();
        const testBranch = branches.find((b: any) => b.name === BRANCH_NAME);

        if (testBranch) {
          return { projectId: project.id, branchId: testBranch.id, branchName: testBranch.name };
        }
      }
    }

    throw new Error(`Branch "${BRANCH_NAME}" not found`);
  } catch (error) {
    console.error('❌ Error finding branch:', error);
    throw error;
  }
}

async function deleteBranch(projectId: string, branchId: string) {
  console.log(`🗑️  Deleting branch "${BRANCH_NAME}" (${branchId})...\n`);

  try {
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${NEON_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete branch: ${response.status} - ${errorText}`);
    }

    console.log('✅ Branch deleted successfully!');
    console.log('\n💡 Remember to update .env.local POSTGRES_URL back to production if needed.');
  } catch (error) {
    console.error('❌ Error deleting branch:', error);
    throw error;
  }
}

async function main() {
  try {
    const { projectId, branchId, branchName } = await getProjectAndBranch();
    await deleteBranch(projectId, branchId);
  } catch (error) {
    console.error('\n❌ Deletion failed:', error);
    process.exit(1);
  }
}

main();
