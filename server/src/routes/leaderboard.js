import { Router } from "express";
const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

router.get("/", todo); // Aadarsh (?type=balance or monthly)

export default router;