import { Router } from "express";
const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

router.get("/me", todo); // Haruto (profile + stats)
router.patch("/me", todo); // Haruto
router.get("/me/bets", todo); // Aadarsh

export default router;