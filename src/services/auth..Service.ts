import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils";

export const signupService = async (fullName: string, email: string, password: string, role: "admin" | "user" = "user") => {
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return { success: false, error: "Email already registered." };

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, email, passwordHash, role });

    const accessToken = generateAccessToken(String(newUser.getDataValue("id")), [newUser.getDataValue("role")]);
    const refreshToken = generateRefreshToken(String(newUser.getDataValue("id")), [newUser.getDataValue("role")]);

    return { success: true, user: newUser, accessToken, refreshToken };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Internal server error" };
  }
};

export const loginService = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return { success: false, error: "Invalid credentials" };

    const valid = await bcrypt.compare(password, user.getDataValue("passwordHash"));
    if (!valid) return { success: false, error: "Invalid credentials" };

    const accessToken = generateAccessToken(String(user.getDataValue("id")), [user.getDataValue("role")]);
    const refreshToken = generateRefreshToken(String(user.getDataValue("id")), [user.getDataValue("role")]);

    return { success: true, user, accessToken, refreshToken };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Internal server error" };
  }
};


export const createAdminService = async (fullName: string, email: string, password: string) => {
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return { success: false, error: "Email already registered." };

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({ fullName, email, passwordHash, role: "admin" });

    const accessToken = generateAccessToken(String(newAdmin.getDataValue("id")), [newAdmin.getDataValue("role")]);
    const refreshToken = generateRefreshToken(String(newAdmin.getDataValue("id")), [newAdmin.getDataValue("role")]);

    return { success: true, admin: newAdmin, accessToken, refreshToken };
  } catch (error) {
    console.error("Admin creation error:", error);
    return { success: false, error: "Internal server error" };
  }
};

export const refreshService = async (token: string) => {
  try {
    const decoded = verifyRefreshToken(token);

    if (!decoded || !decoded.userId) {
      return { success: false, error: "Invalid or expired refresh token" };
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] }, 
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Refresh token error:", error);
    return { success: false, error: "Internal server error" };
  }
};