// routes/withdrawalRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Account = require("../models/Account");
const Withdrawal = require("../models/Withdrawal");

// ➕ Withdraw request
router.post("/request", async (req, res) => {
  try {
    const { userId, amount, accountId, password } = req.body;

    if (!userId || !amount || !accountId || !password) {
      return res.status(400).json({
        success: false,
        message: "সব তথ্য দিন"
      });
    }

    // 🔍 user check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ইউজার পাওয়া যায়নি"
      });
    }

    // 🔐 password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "পাসওয়ার্ড ভুল"
      });
    }

    // 💳 account check
    const account = await Account.findOne({
      _id: accountId,
      userId,
      isActive: true
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "অ্যাকাউন্ট পাওয়া যায়নি"
      });
    }

    // 💸 balance check (assume user.balance আছে)
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "পর্যাপ্ত ব্যালেন্স নেই"
      });
    }

    // ➖ deduct balance
    user.balance -= amount;
    await user.save();

    // 💾 save withdrawal
    const withdrawal = new Withdrawal({
      userId,
      amount,
      accountId,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      status: "pending"
    });

    await withdrawal.save();

    res.json({
      success: true,
      message: "Withdraw request সফল হয়েছে"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "সার্ভার সমস্যা হয়েছে"
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ডাটা লোড করতে সমস্যা হয়েছে"
    });
  }
});

// routes/withdrawalRoutes.js

// 👨‍💼 Admin - get all withdrawals
router.get("/admin/all", async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "ডাটা লোড ব্যর্থ"
    });
  }
});

// 👨‍💼 Admin approve/reject
router.put("/admin/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdraw পাওয়া যায়নি"
      });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already processed"
      });
    }

    withdrawal.status = status;
    await withdrawal.save();

    res.json({
      success: true,
      message: `Withdraw ${status} হয়েছে`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "আপডেট ব্যর্থ"
    });
  }
});

module.exports = router;