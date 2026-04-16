import "dotenv/config";
import { pool } from "../src/db";

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS panel_style_door_types (
        panel_style_id INT NOT NULL REFERENCES panel_styles(id) ON DELETE CASCADE,
        door_type_id INT NOT NULL REFERENCES door_types(id) ON DELETE CASCADE,
        PRIMARY KEY (panel_style_id, door_type_id)
      );
    `);

    // Migrate existing door_type_id data into junction table
    await pool.query(`
      INSERT INTO panel_style_door_types (panel_style_id, door_type_id)
      SELECT id, door_type_id FROM panel_styles WHERE door_type_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);

    console.log(
      "✅ Migration complete: panel_style_door_types table created and data migrated",
    );
  } catch (e) {
    console.error("❌ Migration error:", e);
  } finally {
    await pool.end();
  }
}

migrate();
