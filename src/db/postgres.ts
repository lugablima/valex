import "../setup";
import { Pool } from "pg";

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
