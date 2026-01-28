import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE panel styles */
router.get("/", async (_, res) => {
  const panelStyles = await prisma.panelStyle.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(panelStyles);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL panel styles */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const panelStyles = await prisma.panelStyle.findMany({
    orderBy: { order: "asc" },
  });
  res.json(panelStyles);
});

/** Admin – get panel style by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const panelStyle = await prisma.panelStyle.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!panelStyle) {
    return res.status(404).json({ error: "Panel style not found" });
  }

  res.json(panelStyle);
});

/** Admin – create panel style */
router.post("/", requireAdmin, async (req, res) => {
  const panelStyle = await prisma.panelStyle.create({
    data: req.body,
  });
  res.json(panelStyle);
});

/** Admin – update panel style */
router.put("/:id", requireAdmin, async (req, res) => {
  const panelStyle = await prisma.panelStyle.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(panelStyle);
});

/** Admin – delete panel style */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.panelStyle.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const panelStyle = await prisma.panelStyle.findUnique({ where: { id } });
  if (!panelStyle) return res.status(404).json({});

  const updated = await prisma.panelStyle.update({
    where: { id },
    data: { isActive: !panelStyle.isActive },
  });

  res.json(updated);
});

/** Admin – reorder panel styles */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.panelStyle.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
