import { Client } from "https://deno.land/x/postgres/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

// database connection
export const client = new Client({
    user: Deno.env.get("PGUSER")!,
    password: Deno.env.get("PGPASSWORD")!,
    database: Deno.env.get("PGDATABASE")!,
    hostname: Deno.env.get("PGHOST")!,
    port: Number(Deno.env.get("PGPORT") ?? 5432),
  });
  
  try {
    await client.connect();
    console.log("Successfully connected to PostgreSQL");
  } catch (error) {
    console.log("Error connecting to PostgreSQL");
    console.log(error);
    Deno.exit();
  }