const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 👉 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, referredBy } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
    }

    const exist = await User.findOne({ phone });
    if (exist) {
      return res.status(400).json({ message: "এই নাম্বার আগে থেকেই আছে" });
    }

    const myRefCode = "REF" + Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name,
      phone,
      password,
      refCode: myRefCode,
      referredBy: referredBy || null,
      balance: 50,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created 🎉 ৳50 bonus added",
      user: newUser,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }); // latest first

    res.json({
      total: users.length,
      users,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
// 👉 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful ✅",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;