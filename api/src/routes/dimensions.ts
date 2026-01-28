import { Router } from "express";
import { pool } from "../../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE dimensions */
router.get("/", async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM dimensions WHERE is_active = true ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL dimensions */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM dimensions ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/** Admin – get dimension by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM dimensions WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Dimension not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create dimension */
router.post("/", requireAdmin, async (req, res) => {
  const { name, slug, width, height, image, order, isActive } = req.body;
  const result = await pool.query(
    `INSERT INTO dimensions (name, slug, width, height, image, "order", is_active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, slug, width, height, image, order || 0, isActive ?? true],
  );
  res.json(result.rows[0]);
});

/** Admin – update dimension */
router.put("/:id", requireAdmin, async (req, res) => {
  const { name, slug, width, height, image, order, isActive } = req.body;
  const result = await pool.query(
    `UPDATE dimensions SET name = $1, slug = $2, width = $3, height = $4, image = $5, "order" = $6, is_active = $7 
     WHERE id = $8 RETURNING *`,
    [name, slug, width, height, image, order, isActive, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete dimension */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM dimensions WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE dimensions SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder dimensions */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE dimensions SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
