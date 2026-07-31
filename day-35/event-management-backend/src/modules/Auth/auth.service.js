// auth.service.js
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export async function registerUser({ name, email, password }) {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already in use");
      error.status = 409; // Conflict
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "user",
    });

    return user;
  } catch (error) {
    return error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email doesn't exist");
      error.status = 401;
      throw error;
    }
    const validPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );
    if (!validPassword) {
      const error = new Error("Invalid password");
      error.status = 401;
      throw error;
    }
    return existingUser;
  } catch (error) {
    return error;
  }
}
