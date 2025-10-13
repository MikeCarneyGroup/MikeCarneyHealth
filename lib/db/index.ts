import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// Use Neon serverless driver for Edge runtime compatibility
const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });
