import mongoose from "mongoose";

const outcomeSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        odds: { type: Number, default: 2.0, min: 1.01 },
    },
    { _id: false }
);

const marketSchema = new mongoose.Schema(
    {
        question: { type: String, required: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: ["D1 Sports", "IM Sports", "Dining", "Campus", "Other"],
        },
        outcomes: {
            type: [outcomeSchema],
            validate: [(v) => v.length >= 2, "A market needs at least 2 outcomes"],
        },
        closesAt: { type: Date, required: true },
        status: { type: String, enum: ["open", "settled"], default: "open" },
        winningOutcome: { type: Number, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

marketSchema.index({ question: "text" });

export default mongoose.model("Market", marketSchema);