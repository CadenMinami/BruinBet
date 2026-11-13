import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        market: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
        outcomeIndex: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 1 },
        odds: { type: Number, required: true },
        potentialPayout: { type: Number, required: true },
        result: { type: String, enum: ["pending", "won", "lost"], default: "pending" },
    },
    { timestamps: true }
);

export default mongoose.model("Bet", betSchema);