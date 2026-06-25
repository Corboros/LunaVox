import pg from "pg";

export async function runMigrations({ databaseUrl }: { databaseUrl: string }): Promise<void> {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  await client.end();
  // Migrations handled via drizzle-kit push; this is a no-op health check
}
