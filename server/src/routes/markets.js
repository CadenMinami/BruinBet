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
const CATEGORIES = Market.schema.path("category").enumValues;

// Create a market admins
router.post("/", requireAuth, requireAdmin, async (req, res) => {
    const { question, category, outcomes, closesAt } = req.body ?? {};

    if (typeof question !== "string" || !question.trim() || question.trim().length > 200) {
        return res.status(400).json({ error: "Question is required (max 200 characters)." });
    }

    if (!CATEGORIES.includes(category)) {
        return res.status(400).json({ error: `Category must be one of: ${CATEGORIES.join(", ")}.` });
    }

    if (!Array.isArray(outcomes) || outcomes.length < 2 || outcomes.length > 6) {
        return res.status(400).json({ error: "A market needs 2 to 6 outcomes." });
    }

    const cleanOutcomes = [];
    for (const outcome of outcomes) {
        const label = typeof outcome?.label === "string" ? outcome.label.trim() : "";
        const odds = outcome?.odds === undefined ? 2.0 : Number(outcome.odds);

        if (!label) {
            return res.status(400).json({ error: "Every outcome needs a label." });
        }
        if (!Number.isFinite(odds) || odds <= 1) {
            return res.status(400).json({ error: "Odds must be greater than 1." });
        }
        cleanOutcomes.push({ label, odds });
    }

    const labels = cleanOutcomes.map((o) => o.label.toLowerCase());
    if (new Set(labels).size !== labels.length) {
        return res.status(400).json({ error: "Outcome labels must be unique." });
    }

    const closeDate = new Date(closesAt);
    if (Number.isNaN(closeDate.getTime()) || closeDate <= new Date()) {
        return res.status(400).json({ error: "Closing time must be a valid future date." });
    }

    const market = await Market.create({
        question: question.trim(),
        category,
        outcomes: cleanOutcomes,
        closesAt: closeDate,
        createdBy: req.userId,
    });

    res.status(201).json({ market });
});
router.post("/:id/bets", todo); // Aadarsh
router.post("/:id/settle", requireAuth, requireAdmin, todo); // Caden (admin only)
router.get("/:id/comments", todo); // Juhn
router.post("/:id/comments", todo); // Juhn

export default router;
