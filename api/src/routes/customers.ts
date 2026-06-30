import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Create customer (quote submission) */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      products,
      doorType,
      panelStyle,
      dimension,
      externalColor,
      internalColor,
      glazingOption,
      handleColor,
    } = req.body;

    const productsArray = Array.isArray(products) ? products : [];
    const firstProduct = productsArray[0] || {
      doorType,
      panelStyle,
      dimension,
      externalColor,
      internalColor,
      glazingOption,
      handleColor,
    };

    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, door_type, panel_style, dimension, external_color, internal_color, glazing_option, handle_color, products_config)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        email,
        phone,
        firstProduct.doorType || "",
        firstProduct.panelStyle || "",
        firstProduct.dimension || "",
        firstProduct.externalColor || "",
        firstProduct.internalColor || "",
        firstProduct.glazingOption || "",
        firstProduct.handleColor || "",
        productsArray.length > 0 ? JSON.stringify(productsArray) : null,
      ],
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL customers */
router.get("/", requireAdmin, async (_, res) => {
  const result = await pool.query(
    "SELECT * FROM customers ORDER BY created_at DESC",
  );
  res.json(result.rows);
});

/** Admin – get customer by ID */
router.get("/:id", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json(result.rows[0]);
});

/** Admin – delete customer */
router.delete("/:id", requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM customers WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

export default router;
