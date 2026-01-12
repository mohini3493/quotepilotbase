import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma";

async function createAdmin() {
  const email = "admin@quotepilot.com";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin created successfully");
}

createAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
