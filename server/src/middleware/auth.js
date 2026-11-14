import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authorization = req.get("Authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: "A Bearer token is required." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    return res.status(500).json({ error: "Authentication is not configured." });
  }

  let payload;
  try {
    payload = jwt.verify(match[1], jwtSecret, {
      algorithms: ["HS256"],
      issuer: "bruinbet-api",
      audience: "bruinbet-client",
    });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.sub !== "string" ||
    !/^[a-f0-9]{24}$/i.test(payload.sub) ||
    !Number.isFinite(payload.exp)
  ) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  try {
    const user = await User.findById(payload.sub)
      .select("_id username email balance isAdmin");

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    req.userId = user._id.toString();
  } catch {
    return res.status(500).json({ error: "Unable to check your account. Please try again." });
  }

  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication is required." });
  }

  if (req.user.isAdmin !== true) {
    return res.status(403).json({ error: "Admin access is required." });
  }

  return next();
}