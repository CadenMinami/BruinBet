import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

router.get("/", todo); // Caden (list) + Aadarsh (search/filter)
router.get("/:id", todo); // Caden
router.post("/", requireAuth, requireAdmin, todo); // Caden (admin only)
router.post("/:id/bets", todo); // Aadarsh
router.post("/:id/settle", requireAuth, requireAdmin, todo); // Caden (admin only)
router.get("/:id/comments", todo); // Juhn
router.post("/:id/comments", todo); // Juhn

export default router;
