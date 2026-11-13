import { Router } from "express";
const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

router.post("/signup", todo); // Haruto
router.post("/login", todo); // Haruto
router.get("/me", todo); // Haruto

export default router;