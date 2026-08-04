import "dotenv/config";
import { pool } from "../src/db";

const IMAGE_URL =
  "https://res.cloudinary.com/dwpdjwzgz/image/upload/v1773914351/quotepilot/products/jb95rzpqjt34ozotx9lg.png";

async function run() {
  try {
    // Find the door type(s) whose name contains "aluminium doors" (case-insensitive)
    const dtRes = await pool.query(
      `SELECT id, name FROM door_types WHERE LOWER(name) LIKE '%aluminium%doors%' OR LOWER(name) LIKE '%aluminum%doors%'`
    );
    console.log("Matching door types:", dtRes.rows);

    if (dtRes.rows.length === 0) {
      // Fallback: list all door types so user can pick
      const all = await pool.query(`SELECT id, name FROM door_types ORDER BY id`);
      console.log("No aluminium door types found. All door types:");
      console.table(all.rows);
      return;
    }

    const doorTypeIds = dtRes.rows.map((r: any) => r.id);

    // Find panel styles linked to those door types
    const psRes = await pool.query(
      `SELECT DISTINCT ps.id, ps.name, ps.image
       FROM panel_styles ps
       JOIN panel_style_door_types psdt ON psdt.panel_style_id = ps.id
       WHERE psdt.door_type_id = ANY($1)
       ORDER BY ps.id`,
      [doorTypeIds]
    );
    console.log(`\nPanel styles linked to aluminium door types (${psRes.rows.length} found):`);
    console.table(psRes.rows);

    if (psRes.rows.length === 0) {
      console.log("No panel styles found for these door types.");
      return;
    }

    // Update image for all of them
    const panelStyleIds = psRes.rows.map((r: any) => r.id);
    const updateRes = await pool.query(
      `UPDATE panel_styles SET image = $1 WHERE id = ANY($2) RETURNING id, name, image`,
      [IMAGE_URL, panelStyleIds]
    );
    console.log(`\n✅ Updated ${updateRes.rows.length} panel styles:`);
    console.table(updateRes.rows);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
