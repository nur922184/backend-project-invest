const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const User = require("../models/User");


// 👉 CREATE TRANSACTION (React থেকে আসবে)
router.post("/create", async (req, res) => {
    try {
        const {
            userId,
            amount,
            transactionId,
            paymentMethod,
            phoneNumber,
        } = req.body;

        // 🔒 validation
        if (!userId || !amount || !transactionId) {
            return res.status(400).json({
                message: "সব তথ্য দিন",
            });
        }

        // 🔥 duplicate check (optional but important)
        const exist = await Transaction.findOne({ transactionId });

        if (exist) {
            return res.status(400).json({
                message: "এই ট্রানজেকশন আইডি আগে ব্যবহার হয়েছে",
            });
        }

        const newTransaction = new Transaction({
            userId,
            amount,
            transactionId,
            paymentMethod,
            phoneNumber,
            status: "pending",
        });

        await newTransaction.save();

        res.json({
            success: true,
            message: "Transaction submitted",
            transaction: newTransaction,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "সার্ভার সমস্যা হয়েছে" });
    }
});


// 👉 GET ALL TRANSACTIONS (Admin panel)
router.get("/all", async (req, res) => {
    try {
        const list = await Transaction.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            transactions: list,
        });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
});

// Add this GET route to your existing transaction router

// 👉 GET USER TRANSACTIONS (For transaction history page)
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }

        // Get all transactions for this user, sorted by newest first
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            transactions: transactions,
            count: transactions.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "সার্ভার সমস্যা হয়েছে" });
    }
});

// 👉 GET SINGLE TRANSACTION DETAILS
router.get("/details/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({
            success: true,
            transaction: transaction
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "সার্ভার সমস্যা হয়েছে" });
    }
});


// 👉 APPROVE TRANSACTION (🔥 MAIN LOGIC)
router.patch("/approve/:id", async (req, res) => {
    try {
        const trx = await Transaction.findById(req.params.id);

        if (!trx) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (trx.status !== "pending") {
            return res.status(400).json({
                message: "Already processed",
            });
        }

        // 👉 user update
        const user = await User.findById(trx.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += trx.amount;
        await user.save();

        // 👉 transaction update
        trx.status = "approved";
        await trx.save();

        res.json({
            success: true,
            message: "Approved & Balance Added",
            newBalance: user.balance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// router.get("/admin/stats", async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();

//         const totalDeposit = await Transaction.aggregate([
//             { $match: { status: "approved" } },
//             { $group: { _id: null, total: { $sum: "$amount" } } },
//         ]);

//         const totalWithdraw = await Withdraw.aggregate([
//             { $match: { status: "approved" } },
//             { $group: { _id: null, total: { $sum: "$amount" } } },
//         ]);

//         res.json({
//             totalUsers,
//             totalDeposit: totalDeposit[0]?.total || 0,
//             totalWithdraw: totalWithdraw[0]?.total || 0,
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Error" });
//     }
// });

// 👉 REJECT TRANSACTION
router.patch("/reject/:id", async (req, res) => {
    try {
        const trx = await Transaction.findById(req.params.id);

        if (!trx) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        trx.status = "rejected";
        await trx.save();

        res.json({
            success: true,
            message: "Transaction rejected",
        });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
});

module.exports = router;