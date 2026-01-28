import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/* ===============================
   PUBLIC ROUTES (FRONTEND)
================================ */

/** Create customer (quote submission) */
router.post("/", async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: req.body,
    });
    res.json(customer);
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
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(customers);
});

/** Admin – get customer by ID */
router.get("/:id", requireAdmin, async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json(customer);
});

/** Admin – delete customer */
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.customer.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ success: true });
});

export default router;
