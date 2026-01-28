import "dotenv/config";
import { pool } from "../src/db";
import * as fs from "fs";
import * as path from "path";

async function runSchema() {
  const schemaPath = path.join(__dirname, "../sql/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  try {
    await pool.query(sql);
    console.log("✅ All tables created successfully!");
  } catch (error: any) {
    console.error("❌ Error creating tables:", error);
  } finally {
    await pool.end();
  }
}

runSchema();
