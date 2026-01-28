import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE dimensions */
router.get("/", async (_, res) => {
  const dimensions = await prisma.dimension.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(dimensions);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL dimensions */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const dimensions = await prisma.dimension.findMany({
    orderBy: { order: "asc" },
  });
  res.json(dimensions);
});

/** Admin – get dimension by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const dimension = await prisma.dimension.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!dimension) {
    return res.status(404).json({ error: "Dimension not found" });
  }

  res.json(dimension);
});

/** Admin – create dimension */
router.post("/", requireAdmin, async (req, res) => {
  const dimension = await prisma.dimension.create({
    data: req.body,
  });
  res.json(dimension);
});

/** Admin – update dimension */
router.put("/:id", requireAdmin, async (req, res) => {
  const dimension = await prisma.dimension.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(dimension);
});

/** Admin – delete dimension */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.dimension.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const dimension = await prisma.dimension.findUnique({ where: { id } });
  if (!dimension) return res.status(404).json({});

  const updated = await prisma.dimension.update({
    where: { id },
    data: { isActive: !dimension.isActive },
  });

  res.json(updated);
});

/** Admin – reorder dimensions */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.dimension.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
