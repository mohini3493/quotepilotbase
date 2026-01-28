import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE products (homepage, listings) */
router.get("/", async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM products WHERE is_active = true ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/** Get product by SLUG (frontend detail page) */
router.get("/slug/:slug", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE slug = $1 AND is_active = true",
    [req.params.slug],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(result.rows[0]);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** ✅ Admin – get ALL products (active + inactive) */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const result = await pool.query(
    'SELECT * FROM products ORDER BY "order" ASC',
  );
  res.json(result.rows);
});

/** ✅ Admin – get product by ID (EDIT PAGE) */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – create product */
router.post("/", requireAdmin, async (req, res) => {
  const { title, slug, description, image, order, isActive } = req.body;
  const result = await pool.query(
    `INSERT INTO products (title, slug, description, image, "order", is_active) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, slug, description, image, order || 0, isActive ?? true],
  );
  res.json(result.rows[0]);
});

/** Admin – update product */
router.put("/:id", requireAdmin, async (req, res) => {
  const { title, slug, description, image, order, isActive } = req.body;
  const result = await pool.query(
    `UPDATE products SET title = $1, slug = $2, description = $3, image = $4, "order" = $5, is_active = $6 
     WHERE id = $7 RETURNING *`,
    [title, slug, description, image, order, isActive, req.params.id],
  );
  res.json(result.rows[0]);
});

/** Admin – delete product */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "UPDATE products SET is_active = NOT is_active WHERE id = $1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({});
  }

  res.json(result.rows[0]);
});

/** Admin – reorder products */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      pool.query('UPDATE products SET "order" = $1 WHERE id = $2', [
        item.order,
        item.id,
      ]),
    ),
  );

  res.json({ success: true });
});

export default router;
