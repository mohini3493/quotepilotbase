import "dotenv/config";
import { pool } from "../src/db";

async function run() {
  try {
    await pool.query(`
      ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS glazing_type VARCHAR(20) DEFAULT NULL;
    `);
    console.log("✅ Added glazing_type column to customers table");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
