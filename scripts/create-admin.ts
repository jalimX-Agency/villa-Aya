import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if (!email || !pass) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  const password = await bcrypt.hash(pass, 12);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, password, name: "Admin", role: "admin" },
  });
  console.log("Admin created");
}
main().finally(() => db.$disconnect());
