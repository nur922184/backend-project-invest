const express = require("express");
const router = express.Router();
const Bonus = require("../models/Bonus");

router.get("/status/:userId", async (req, res) => {
  const bonus = await Bonus.findOne({ userId: req.params.userId });
  res.json({ claimed: bonus?.claimed || false });
});

router.post("/claim", async (req, res) => {
  const { userId } = req.body;

  let bonus = await Bonus.findOne({ userId });

  if (bonus && bonus.claimed) {
    return res.status(400).json({ message: "Already claimed" });
  }

  if (!bonus) {
    bonus = new Bonus({ userId, claimed: true });
  } else {
    bonus.claimed = true;
  }

  await bonus.save();

  res.json({ success: true });
});

module.exports = router;