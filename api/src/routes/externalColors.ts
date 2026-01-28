import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE external colors */
router.get("/", async (_, res) => {
  const externalColors = await prisma.externalColor.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(externalColors);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL external colors */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const externalColors = await prisma.externalColor.findMany({
    orderBy: { order: "asc" },
  });
  res.json(externalColors);
});

/** Admin – get external color by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const externalColor = await prisma.externalColor.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!externalColor) {
    return res.status(404).json({ error: "External color not found" });
  }

  res.json(externalColor);
});

/** Admin – create external color */
router.post("/", requireAdmin, async (req, res) => {
  const externalColor = await prisma.externalColor.create({
    data: req.body,
  });
  res.json(externalColor);
});

/** Admin – update external color */
router.put("/:id", requireAdmin, async (req, res) => {
  const externalColor = await prisma.externalColor.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(externalColor);
});

/** Admin – delete external color */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.externalColor.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const externalColor = await prisma.externalColor.findUnique({
    where: { id },
  });
  if (!externalColor) return res.status(404).json({});

  const updated = await prisma.externalColor.update({
    where: { id },
    data: { isActive: !externalColor.isActive },
  });

  res.json(updated);
});

/** Admin – reorder external colors */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.externalColor.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
