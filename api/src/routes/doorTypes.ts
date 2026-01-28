import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Get ACTIVE door types */
router.get("/", async (_, res) => {
  const doorTypes = await prisma.doorType.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  res.json(doorTypes);
});

/* ===============================
   ADMIN ROUTES
================================ */

/** Admin – get ALL door types */
router.get("/admin/all", requireAdmin, async (_, res) => {
  const doorTypes = await prisma.doorType.findMany({
    orderBy: { order: "asc" },
  });
  res.json(doorTypes);
});

/** Admin – get door type by ID */
router.get("/admin/:id", requireAdmin, async (req, res) => {
  const doorType = await prisma.doorType.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!doorType) {
    return res.status(404).json({ error: "Door type not found" });
  }

  res.json(doorType);
});

/** Admin – create door type */
router.post("/", requireAdmin, async (req, res) => {
  const doorType = await prisma.doorType.create({
    data: req.body,
  });
  res.json(doorType);
});

/** Admin – update door type */
router.put("/:id", requireAdmin, async (req, res) => {
  const doorType = await prisma.doorType.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(doorType);
});

/** Admin – delete door type */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.doorType.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

/** Admin – toggle active/inactive */
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const doorType = await prisma.doorType.findUnique({ where: { id } });
  if (!doorType) return res.status(404).json({});

  const updated = await prisma.doorType.update({
    where: { id },
    data: { isActive: !doorType.isActive },
  });

  res.json(updated);
});

/** Admin – reorder door types */
router.post("/reorder", requireAdmin, async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item: { id: number; order: number }) =>
      prisma.doorType.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  res.json({ success: true });
});

export default router;
