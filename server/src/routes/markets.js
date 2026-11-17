import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import mongoose from "mongoose";
import Market from "../models/Market.js";


const router = Router();
const todo = (req, res) => res.status(501).json({ todo: true });

// List open markets, closing soonest first. Aadarsh adds search/filter here.
router.get("/", async (req, res) => {
    const markets = await Market.find({
        status: "open",
        closesAt: { $gt: new Date() },
    }).sort({ closesAt: 1 });

    res.json({ markets });
});
// One market by id, any status, so closed markets can still be settled
router.get("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid market id." });
    }

    const market = await Market.findById(req.params.id);
    if (!market) {
        return res.status(404).json({ error: "Market not found." });
    }

    res.json({ market });
});
router.post("/", requireAuth, requireAdmin, todo); // Caden (admin only)
router.post("/:id/bets", todo); // Aadarsh
router.post("/:id/settle", requireAuth, requireAdmin, todo); // Caden (admin only)
router.get("/:id/comments", todo); // Juhn
router.post("/:id/comments", todo); // Juhn

export default router;
