/**
 * Cleanup Test Data Script
 * 
 * Removes all test data from the database.
 * 
 * Safety: This script checks for production environment.
 * 
 * Usage:
 *   npm run test:cleanup
 */

import { cleanupTestData } from '@/lib/test-utils/db-helpers';

cleanupTestData()
  .then(() => {
    console.log('✅ Cleanup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });
