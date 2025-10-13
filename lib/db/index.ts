import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createClient } from '@vercel/postgres';
import * as schema from './schema';

// Create a Postgres client explicitly
const client = createClient();

export const db = drizzle(client, { schema });
