import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let sqlClient: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a Neon SQL execution instance.
 * Database credentials remain strictly on the server and are never exposed to browser bundles.
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not configured.");
  }
  
  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}
