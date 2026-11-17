import mongoose from "mongoose";
import Market from "../models/Market.js";
import Bet from "../models/Bet.js";
import User from "../models/User.js";

export class SettlementError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// settle market and pay out in 1 transaction (All or nothing)

export async function settleMarket(marketId, winningOutcome) {
    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            //only if market is open, closed by time and actual outcome exists 
            const market = await Market.findOneAndUpdate(
                {
                    _id: marketId,
                    status: "open",
                    closesAt: { $lte: new Date() },
                    [`outcomes.${winningOutcome}`]: { $exists: true },
                },
                { $set: { status: "settled", winningOutcome } },
                { new: true, session }
            );

            if (!market) {
                throw await explainWhyNotSettled(marketId, winningOutcome, session);
            }

            const winningBets = await Bet.find({
                market: market._id,
                outcomeIndex: winningOutcome,
                result: "pending",
            }).session(session);

            await Bet.updateMany(
                { market: market._id, outcomeIndex: winningOutcome, result: "pending" },
                { $set: { result: "won" } },
                { session }
            );

            await Bet.updateMany(
                { market: market._id, result: "pending" },
                { $set: { result: "lost" } },
                { session }
            );

            //only balance update per user, even when they have many bets 
            const payoutByUser = new Map();
            for (const bet of winningBets) {
                const userId = bet.user.toString();
                payoutByUser.set(userId, (payoutByUser.get(userId) ?? 0) + bet.potentialPayout);
            }

            if (payoutByUser.size > 0) {
                await User.bulkWrite(
                    [...payoutByUser].map(([userId, amount]) => ({
                        updateOne: { filter: { _id: userId }, update: { $inc: { balance: amount } } },
                    })),
                    { session }
                );
            }

            const totalPaid = [...payoutByUser.values()].reduce((sum, amount) => sum + amount, 0);
            result = { market, winners: winningBets.length, totalPaid };
        });

        return result;
    } finally {
        await session.endSession();
    }
}

async function explainWhyNotSettled(marketId, winningOutcome, session) {
    const market = await Market.findById(marketId).session(session);

    if (!market) return new SettlementError(404, "Market not found.");
    if (market.status === "settled") return new SettlementError(409, "Market is already settled.");
    if (winningOutcome >= market.outcomes.length) {
        return new SettlementError(400, "That outcome doesn't exist for this market.");
    }
    return new SettlementError(409, "Market hasn't closed yet.");
}