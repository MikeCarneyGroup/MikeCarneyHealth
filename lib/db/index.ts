import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'postgres';
import * as schema from './schema';

// Use the postgres package directly with the connection string
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
