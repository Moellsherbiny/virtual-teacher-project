import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    "postgres://default:hUxj1JPDctw3@ep-lively-field-a443gi0x-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require?sslmode=require",
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
