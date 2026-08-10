import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecretkey123";

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (normalizedUsername.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ where: { username: normalizedUsername } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: { id: user.id, username: user.username },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const user = await User.findOne({ where: { username: normalizedUsername } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user.id, username: user.username },
      },
    });
  } catch (err) {
    next(err);
  }
};
