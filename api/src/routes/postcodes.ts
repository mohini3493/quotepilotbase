import { Router } from "express";
import { pool } from "../../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE postcodes */
router.get("/", async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM postcodes WHERE is_active = true ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL postcodes */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM postcodes ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/** Admin – get postcode by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM postcodes WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Postcode not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create postcode */
router.post("/", requireAdmin, async (req, res) => {
  const { code, area, order, isActive } = req.body;
  const result = await pool.query(
    `INSERT INTO postcodes (code, area, "order", is_active) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [code, area, order || 0, isActive ?? true],
  );
  res.json(result.rows[0]);
});

/** Admin – update postcode */
router.put("/:id", requireAdmin, async (req, res) => {
  const { code, area, order, isActive } = req.body;
  const result = await pool.query(
    `UPDATE postcodes SET code = $1, area = $2, "order" = $3, is_active = $4 
     WHERE id = $5 RETURNING *`,
    [code, area, order, isActive, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete postcode */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM postcodes WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE postcodes SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder postcodes */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE postcodes SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
