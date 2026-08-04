import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC
================================ */

router.get("/", async (_req, res) => {
  const result = await pool.query(
    `SELECT * FROM composite_door_styles WHERE is_active = true ORDER BY "order" ASC`
  );
  res.json(result.rows);
});

/* ===============================
   ADMIN
================================ */

router.get("/admin/all", requireAdmin, async (_req, res) => {
  const result = await pool.query(
    `SELECT * FROM composite_door_styles ORDER BY "order" ASC`
  );
  res.json(result.rows);
});

router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM composite_door_styles WHERE id = $1`,
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, image, isActive, order } = req.body;
  const slug = (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const result = await pool.query(
    `INSERT INTO composite_door_styles (name, slug, image, is_active, "order") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, slug, image || null, isActive ?? true, order ?? 0]
  );
  res.json(result.rows[0]);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const { name, image, isActive, order } = req.body;
  const slug = (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const result = await pool.query(
    `UPDATE composite_door_styles SET name = $1, slug = $2, image = $3, is_active = $4, "order" = $5 WHERE id = $6 RETURNING *`,
    [name, slug, image || null, isActive, order, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query(`DELETE FROM composite_door_styles WHERE id = $1`, [req.params.id]);
  res.json({ success: true });
});

router.put("/reorder", requireAdmin, async (req, res) => {
  const { order } = req.body;
  await Promise.all(
    (order as { id: number; order: number }[]).map((item) =>
      pool.query(`UPDATE composite_door_styles SET "order" = $1 WHERE id = $2`, [item.order, item.id])
    )
  );
  res.json({ success: true });
});

export default router;
