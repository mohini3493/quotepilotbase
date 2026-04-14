require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await pool.query(
      "ALTER TABLE door_types ADD COLUMN IF NOT EXISTS product_id INT REFERENCES products(id) ON DELETE SET NULL",
    );
    console.log("OK: product_id column added to door_types");
    await pool.query(
      "ALTER TABLE panel_styles ADD COLUMN IF NOT EXISTS door_type_id INT REFERENCES door_types(id) ON DELETE SET NULL",
    );
    console.log("OK: door_type_id column added to panel_styles");
  } catch (e) {
    console.error("ERR:", e.message);
  } finally {
    await pool.end();
  }
}

run();
