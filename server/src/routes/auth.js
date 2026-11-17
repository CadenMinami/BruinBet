import { requireAuth } from "../middleware/auth.js";
import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body ?? {};

  if (![username, email, password].every((value) => typeof value === "string")) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    return res.status(400).json({ error: "Username must be 3–30 characters." });
  }

  if (cleanEmail.length > 254 || !/^[^\s@]+@(g\.)?ucla\.edu$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Use a valid UCLA email address." });
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({ error: "Password must be at least 8 characters and at most 72 bytes." });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username or email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
    });

    return res.status(201).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username or email is already registered." });
    }

    return res.status(500).json({ error: "Unable to create account. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || cleanEmail.length > 254 || !password || Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({ error: "Enter a valid email and password." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    return res.status(500).json({ error: "Authentication is not configured." });
  }

  try {
    const user = await User.findOne({ email: cleanEmail }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      {},
      jwtSecret,
      {
        subject: user._id.toString(),
        algorithm: "HS256",
        expiresIn: "1h",
        issuer: "bruinbet-api",
        audience: "bruinbet-client",
      }
    );

    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
    });
  } catch {
    return res.status(500).json({ error: "Unable to log in. Please try again." });
  }
});
router.get("/me", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.json({
    user: {
      id: req.user._id.toString(),
      username: req.user.username,
      email: req.user.email,
      balance: req.user.balance,
      isAdmin: req.user.isAdmin,
    },
  });
});
export default router;