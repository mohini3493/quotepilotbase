import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.json({ success: true });
});

router.get("/me", requireAdmin, async (req, res) => {
  res.json({ authenticated: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

export default router;
