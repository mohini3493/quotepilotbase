import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE product types (optionally filtered by product_id) */
router.get("/", async (req, res) => {
  const { product_id } = req.query;
  let query = "SELECT * FROM door_types WHERE is_active = true";
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

/** Admin – get ALL product types (with associated product info) */
router.get("/admin/all", requireAdmin, async (_, res) => {
  // Get all door types with product info
  const result = await pool.query(
    `SELECT dt.*, p.id as product_id, p.title as product_title
     FROM door_types dt
     LEFT JOIN products p ON dt.product_id = p.id
     ORDER BY dt.created_at DESC`
  );
  const doorTypes = result.rows.map(dt => ({
    ...dt,
    product: dt.product_id ? { id: dt.product_id, title: dt.product_title } : null,
  }));
  res.json(doorTypes);
});

/** Admin – get product type by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM door_types WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product type not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create product type */
router.post("/", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive, productId } = req.body;
  const result = await pool.query(
    `INSERT INTO door_types (name, slug, image, "order", is_active, product_id) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, slug, image, order || 0, isActive ?? true, productId || null],
  );
  res.json(result.rows[0]);
});

/** Admin – update product type */
router.put("/:id", requireAdmin, async (req, res) => {
  const { name, slug, image, order, isActive, productId } = req.body;
  const result = await pool.query(
    `UPDATE door_types SET name = $1, slug = $2, image = $3, "order" = $4, is_active = $5, product_id = $6 
     WHERE id = $7 RETURNING *`,
    [name, slug, image, order, isActive, productId || null, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete product type */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM door_types WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE door_types SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder product types */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE door_types SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
