import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE products (homepage, listings) */
router.get("/", async (_, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(products);
});

/** Get product by SLUG (frontend detail page) */
router.get("/slug/:slug", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
  });

  if (!product || !product.isActive) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** ✅ Admin – get ALL products (active + inactive) */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const products = await prisma.product.findMany({
    orderBy: { order: "asc" },
  });
  res.json(products);
});

/** ✅ Admin – get product by ID (EDIT PAGE) */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

/** Admin – create product */
router.post("/", requireAdmin, async (req, res) => {
  const product = await prisma.product.create({
    data: req.body,
  });
  res.json(product);
});

/** Admin – update product */
router.put("/:id", requireAdmin, async (req, res) => {
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(product);
});

/** Admin – delete product */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.product.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({});

  const updated = await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  res.json(updated);
});

/** Admin – reorder products */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body; // [{ id, order }]

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.product.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  res.json({ success: true });
});

export default router;
