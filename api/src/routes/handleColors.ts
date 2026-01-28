import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE handle colors */
router.get("/", async (_, res) => {
  const handleColors = await prisma.handleColor.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(handleColors);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL handle colors */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const handleColors = await prisma.handleColor.findMany({
    orderBy: { order: "asc" },
  });
  res.json(handleColors);
});

/** Admin – get handle color by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const handleColor = await prisma.handleColor.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!handleColor) {
    return res.status(404).json({ error: "Handle color not found" });
  }

  res.json(handleColor);
});

/** Admin – create handle color */
router.post("/", requireAdmin, async (req, res) => {
  const handleColor = await prisma.handleColor.create({
    data: req.body,
  });
  res.json(handleColor);
});

/** Admin – update handle color */
router.put("/:id", requireAdmin, async (req, res) => {
  const handleColor = await prisma.handleColor.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(handleColor);
});

/** Admin – delete handle color */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.handleColor.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const handleColor = await prisma.handleColor.findUnique({ where: { id } });
  if (!handleColor) return res.status(404).json({});

  const updated = await prisma.handleColor.update({
    where: { id },
    data: { isActive: !handleColor.isActive },
  });

  res.json(updated);
});

/** Admin – reorder handle colors */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.handleColor.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
