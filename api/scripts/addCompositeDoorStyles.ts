import "dotenv/config";
import { pool } from "../src/db";

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS composite_door_styles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        "order" INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await pool.query(`
      INSERT INTO composite_door_styles (name, slug, "order") VALUES
        ('Contemporary', 'contemporary', 1),
        ('Designers', 'designers', 2),
        ('Traditional', 'traditional', 3)
      ON CONFLICT (slug) DO NOTHING;
    `);

    await pool.query(`
      ALTER TABLE panel_styles
        ADD COLUMN IF NOT EXISTS composite_style_id INT REFERENCES composite_door_styles(id) ON DELETE SET NULL;
    `);

    await pool.query(`
      ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS composite_door_style TEXT DEFAULT NULL;
    `);

    console.log("✅ composite_door_styles table created and seeded");
    console.log("✅ panel_styles.composite_style_id column added");
    console.log("✅ customers.composite_door_style column added");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
