import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Market from "../models/Market.js";
import Bet from "../models/Bet.js";

// Dev helper: joebruin bets on Yes, josiebruin bets on No, 100 each,
// on the chicken tenders demo market. Run after `npm run seed`.
await mongoose.connect(process.env.MONGODB_URI);

const market = await Market.findOne({ question: /chicken tenders/i });
const picks = [
    ["joebruin", 0],
    ["josiebruin", 1],
];

for (const [username, outcomeIndex] of picks) {
    const user = await User.findOne({ username });
    const amount = 100;
    const odds = market.outcomes[outcomeIndex].odds;

    await User.updateOne({ _id: user._id }, { $inc: { balance: -amount } });
    await Bet.create({
        user: user._id,
        market: market._id,
        outcomeIndex,
        amount,
        odds,
        potentialPayout: amount * odds,
    });
}

console.log("Added 2 bets on:", market.question);
console.log("Market id:", market._id.toString());
await mongoose.disconnect();