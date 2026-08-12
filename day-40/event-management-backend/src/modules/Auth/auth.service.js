// auth.service.js
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role: "user",
  });

  return user;
}

export async function loginUser({ email, password }) {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(
    password,
    existingUser.passwordHash,
  );
  if (!validPassword) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  return existingUser;
}
