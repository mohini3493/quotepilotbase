import { pool } from "../db";

async function checkProducts() {
  try {
    const all = await pool.query(
      'SELECT id, title, is_active FROM products ORDER BY "order" ASC'
    );
    console.log("All products in database:");
    console.table(all.rows);
    
    const active = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE is_active = true'
    );
    console.log("\nActive products count:", active.rows[0].count);
    
    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkProducts();
