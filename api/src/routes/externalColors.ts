import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE external colors */
router.get("/", async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM external_colors WHERE is_active = true ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL external colors */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM external_colors ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/** Admin – get external color by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM external_colors WHERE id = $1",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "External color not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create external color */
router.post("/", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive } = req.body;
  const result = await pool.query(
    `INSERT INTO external_colors (name, slug, image, "order", is_active) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, slug, image, order || 0, isActive ?? true],
  );
  res.json(result.rows[0]);
});

/** Admin – update external color */
router.put("/:id", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive } = req.body;
  const result = await pool.query(
    `UPDATE external_colors SET name = $1, slug = $2, image = $3, "order" = $4, is_active = $5 
     WHERE id = $6 RETURNING *`,
    [name, slug, image, order, isActive, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete external color */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM external_colors WHERE id = $1", [
    req.params.id,
  ]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE external_colors SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder external colors */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE external_colors SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
