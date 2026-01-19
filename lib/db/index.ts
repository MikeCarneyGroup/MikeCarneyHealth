import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get connection string
const connectionString = process.env.POSTGRES_URL || '';

// Use Neon's HTTP adapter for serverless environments (Vercel, Edge, etc.)
// This works in both local development and production serverless environments
// HTTP adapter handles auto-pause automatically and doesn't require WebSocket support
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
