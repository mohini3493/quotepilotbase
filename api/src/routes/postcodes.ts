import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE postcodes */
router.get("/", async (_, res) => {
  const postcodes = await prisma.postcode.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(postcodes);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL postcodes */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const postcodes = await prisma.postcode.findMany({
    orderBy: { order: "asc" },
  });
  res.json(postcodes);
});

/** Admin – get postcode by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const postcode = await prisma.postcode.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!postcode) {
    return res.status(404).json({ error: "Postcode not found" });
  }

  res.json(postcode);
});

/** Admin – create postcode */
router.post("/", requireAdmin, async (req, res) => {
  const postcode = await prisma.postcode.create({
    data: req.body,
  });
  res.json(postcode);
});

/** Admin – update postcode */
router.put("/:id", requireAdmin, async (req, res) => {
  const postcode = await prisma.postcode.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(postcode);
});

/** Admin – delete postcode */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.postcode.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const postcode = await prisma.postcode.findUnique({ where: { id } });
  if (!postcode) return res.status(404).json({});

  const updated = await prisma.postcode.update({
    where: { id },
    data: { isActive: !postcode.isActive },
  });

  res.json(updated);
});

/** Admin – reorder postcodes */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.postcode.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
