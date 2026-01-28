import bcrypt from "bcryptjs";
import { pool } from "../db";

async function createAdmin() {
  const email = "admin@quotepilot.com";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [
    email,
    hashedPassword,
  ]);

  console.log("✅ Admin created successfully");
}

createAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await pool.end();
  });
