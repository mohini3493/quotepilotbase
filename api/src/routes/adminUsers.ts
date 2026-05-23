import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const VALID_ROLES = ["superadmin", "admin", "lead_manager", "product_manager"];

/** List all admin users (superadmin only) */
router.get("/", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }
  const result = await pool.query(
    "SELECT id, email, role, created_at FROM admins ORDER BY created_at ASC",
  );
  res.json(result.rows);
});

/** Create a new admin user (superadmin only) */
router.post("/", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }

  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO admins (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
      [email, hashed, role || "admin"],
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

/** Update user email + role (superadmin only) */
router.put("/:id", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }

  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const result = await pool.query(
      "UPDATE admins SET email = $1, role = $2 WHERE id = $3 RETURNING id, email, role, created_at",
      [email, role, req.params.id],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already exists" });
    res.status(500).json({ error: "Failed to update user" });
  }
});

/** Change password (superadmin only) */
router.patch("/:id/password", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }

  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "UPDATE admins SET password = $1 WHERE id = $2 RETURNING id",
    [hashed, req.params.id],
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
  res.json({ success: true });
});

/** Update user role (superadmin only) */
router.patch("/:id/role", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }

  const { role } = req.body;
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const result = await pool.query(
    "UPDATE admins SET role = $1 WHERE id = $2 RETURNING id, email, role, created_at",
    [role, req.params.id],
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(result.rows[0]);
});

/** Delete a user (superadmin only) */
router.delete("/:id", requireAdmin, async (req, res) => {
  const adminId = (req as any).admin?.adminId;
  const self = await pool.query("SELECT role FROM admins WHERE id = $1", [adminId]);
  if (self.rows[0]?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin access required" });
  }

  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM admins WHERE role = 'superadmin'",
  );
  const superadminCount = parseInt(rows[0].count, 10);
  const target = await pool.query("SELECT role FROM admins WHERE id = $1", [req.params.id]);
  if (target.rows[0]?.role === "superadmin" && superadminCount <= 1) {
    return res.status(400).json({ error: "Cannot delete the only superadmin" });
  }

  await pool.query("DELETE FROM admins WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

export default router;
