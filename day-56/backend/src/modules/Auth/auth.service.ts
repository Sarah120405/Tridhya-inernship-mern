import { performance } from "node:perf_hooks";
import prisma from "../../config/db.config";
import bcrypt from "bcrypt";

export async function register(userData: any) {
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPwd = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPwd;
  const newUser = await prisma.user.create({
    data: userData,
  });
  return newUser;
}

export async function login(userData: any) {
  const totalStart = performance.now();
  const dbStart = performance.now();
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  console.log(
    `[Login Timing] Database lookup: ${(performance.now() - dbStart).toFixed(2)} ms`,
  );

  if (!user) {
    throw { status: 409, message: "User does not exist" };
  }
  const validPassword = await bcrypt.compare(userData.password, user.password);

  if (!validPassword) {
    throw { status: 401, message: "Invalid password" };
  }
  const { password, ...userWithoutPassword } = user;
  console.log(
    `[Login Timing] Service total: ${(performance.now() - totalStart).toFixed(2)} ms`,
  );
  return userWithoutPassword;
}
