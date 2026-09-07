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
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (!user) {
    throw { status: 409, message: "User does not exist" };
  }
  const validPassword = await bcrypt.compare(userData.password, user.password);
  if (!validPassword) {
    throw { status: 401, message: "Invalid password" };
  }
  return user;
}
