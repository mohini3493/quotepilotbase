import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);
    const admin = result.rows[0];

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
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      path: "/",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", requireAdmin, async (req, res) => {
  res.json({ authenticated: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

export default router;
