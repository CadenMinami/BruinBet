// wipes the db and loads sample users + markets for the demo
//
// npm run seed        demo markets close 10 min after seeding
// npm run seed -- 5   demo markets close 5 min after seeding

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Market from "./models/Market.js";
import Bet from "./models/Bet.js";
import Comment from "./models/Comment.js";
import users from "./data/seedUsers.js";
import seedMarkets from "./data/seedMarkets.js";

async function seed() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing, check server/.env");
    }

    // how many min until the demo markets close
    const closeInMinutes = Number(process.argv[2]) || 10;

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to", mongoose.connection.name, "- clearing old data");

    // bets and comments point to users/markets so they have to go too
    await User.deleteMany({});
    await Market.deleteMany({});
    await Bet.deleteMany({});
    await Comment.deleteMany({});

    let admin;
    for (const user of users) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        const saved = await User.create({
            username: user.username,
            email: user.email,
            passwordHash: passwordHash,
            isAdmin: user.isAdmin,
        });
        if (saved.isAdmin) admin = saved;
    }

    // turn closesInHours into a real date
    const now = Date.now();
    const marketDocs = seedMarkets.map((market) => {
        const minutes = market.closesSoon ? closeInMinutes : market.closesInHours * 60;
        return {
            question: market.question,
            category: market.category,
            outcomes: market.outcomes.map((label) => ({ label: label })),
            closesAt: new Date(now + minutes * 60 * 1000),
            createdBy: admin._id,
        };
    });
    const markets = await Market.insertMany(marketDocs);

    console.log("\nLogins (everyone starts with 1000 B-Coins):");
    for (const user of users) {
        const role = user.isAdmin ? "admin" : "user ";
        console.log(`  ${role}  ${user.email}  /  ${user.password}`);
    }

    console.log(`\nAdded ${markets.length} markets. Closing soon (use these for the demo):`);
    for (const market of markets) {
        if (market.closesAt - now <= closeInMinutes * 60 * 1000) {
            console.log(`  ${market.closesAt.toLocaleTimeString()}  ${market.question}`);
        }
    }
}

seed()
    .catch((err) => {
        console.error("Seed failed:", err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
