import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/** GET ALL PRODUCTS (ACTIVE + INACTIVE)
 * Admin only
 */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY "order" ASC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
