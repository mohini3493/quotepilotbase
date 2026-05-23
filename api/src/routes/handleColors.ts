import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE handle colors (optionally filtered by product_id) */
router.get("/", async (req, res) => {
  const { product_id } = req.query;
  let query = "SELECT * FROM handle_colors WHERE is_active = true";
  const params: any[] = [];
  if (product_id) {
    params.push(product_id);
    query += ` AND product_id = $${params.length}`;
  }
  query += ' ORDER BY "order" ASC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL handle colors (with associated product info) */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const result = await pool.query(
    `SELECT hc.*, p.title as product_title
     FROM handle_colors hc
     LEFT JOIN products p ON hc.product_id = p.id
     ORDER BY hc.created_at DESC`,
  );
  res.json(result.rows);
});

/** Admin – get handle color by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM handle_colors WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Handle color not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create handle color */
router.post("/", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive, productId } = req.body;
  const result = await pool.query(
    `INSERT INTO handle_colors (name, slug, image, "order", is_active, product_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, slug, image, order || 0, isActive ?? true, productId || null],
  );
  res.json(result.rows[0]);
});

/** Admin – update handle color */
router.put("/:id", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive, productId } = req.body;
  const result = await pool.query(
    `UPDATE handle_colors SET name = $1, slug = $2, image = $3, "order" = $4, is_active = $5, product_id = $6
     WHERE id = $7 RETURNING *`,
    [name, slug, image, order, isActive, productId || null, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete handle color */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM handle_colors WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE handle_colors SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder handle colors */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE handle_colors SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
