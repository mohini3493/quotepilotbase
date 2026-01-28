import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE internal colors */
router.get("/", async (_, res) => {
  const internalColors = await prisma.internalColor.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(internalColors);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL internal colors */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const internalColors = await prisma.internalColor.findMany({
    orderBy: { order: "asc" },
  });
  res.json(internalColors);
});

/** Admin – get internal color by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const internalColor = await prisma.internalColor.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!internalColor) {
    return res.status(404).json({ error: "Internal color not found" });
  }

  res.json(internalColor);
});

/** Admin – create internal color */
router.post("/", requireAdmin, async (req, res) => {
  const internalColor = await prisma.internalColor.create({
    data: req.body,
  });
  res.json(internalColor);
});

/** Admin – update internal color */
router.put("/:id", requireAdmin, async (req, res) => {
  const internalColor = await prisma.internalColor.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(internalColor);
});

/** Admin – delete internal color */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.internalColor.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const internalColor = await prisma.internalColor.findUnique({
    where: { id },
  });
  if (!internalColor) return res.status(404).json({});

  const updated = await prisma.internalColor.update({
    where: { id },
    data: { isActive: !internalColor.isActive },
  });

  res.json(updated);
});

/** Admin – reorder internal colors */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.internalColor.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
