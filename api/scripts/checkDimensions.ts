import "dotenv/config";
import { pool } from "../src/db";

async function checkAndFixDimensions() {
  try {
    // Check table structure
    const cols = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dimensions'",
    );
    console.log("Dimensions table columns:");
    console.table(cols.rows);

    // Test inserting a dimension
    console.log("\nTrying to insert a test dimension...");
    const result = await pool.query(
      `INSERT INTO dimensions (width, height, "order", is_active) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [1000, 2000, 0, true],
    );
    console.log("Insert successful:");
    console.log(result.rows[0]);

    // Clean up test
    await pool.query("DELETE FROM dimensions WHERE id = $1", [
      result.rows[0].id,
    ]);
    console.log("Test dimension deleted");

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAndFixDimensions();
