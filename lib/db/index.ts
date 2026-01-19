import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';

// Configure WebSocket for Node.js (required for Neon serverless driver in Node.js < v22)
neonConfig.webSocketConstructor = ws;

// Get connection string
const connectionString = process.env.POSTGRES_URL || '';

// Use Neon's serverless Pool which handles auto-pause and connection pooling automatically
// This driver is specifically designed to handle Neon's scale-to-zero feature
const pool = new Pool({
  connectionString,
  // Neon serverless driver handles SSL automatically via connection string
  // Connection pool settings optimized for Neon auto-pause
  max: 10, // Maximum number of connections in the pool
});

// Handle connection errors gracefully (Neon auto-pause can cause temporary connection issues)
pool.on('error', (err: Error) => {
  console.error('Unexpected Neon database pool error:', err);
});

export const db = drizzle(pool, { schema });
