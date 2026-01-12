import { Router } from "express";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

/** GET ALL PRODUCTS (ACTIVE + INACTIVE)
 * Admin only
 */
router.get("/", requireAdmin, async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { order: "asc" },
  });

  res.json(products);
});

export default router;
