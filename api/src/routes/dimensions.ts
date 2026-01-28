import { Router } from "express";
import { pool } from "../db";
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
  try {
    const { width, height, order, isActive } = req.body;

    const result = await pool.query(
      `INSERT INTO dimensions (width, height, "order", is_active) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [width, height, order || 0, isActive ?? true],
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating dimension:", error);
    res.status(500).json({ error: error.message });
  }
});

/** Admin – update dimension */
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { width, height, order, isActive } = req.body;

    const result = await pool.query(
      `UPDATE dimensions SET width = $1, height = $2, "order" = $3, is_active = $4 
       WHERE id = $5 RETURNING *`,
      [width, height, order || 0, isActive, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating dimension:", error);
    res.status(500).json({ error: error.message });
  }
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
