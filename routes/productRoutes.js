const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/all", async (req, res) => {
  const products = await Product.find().sort({ _id: -1 });

  res.json({
    total: products.length,
    products,
  });
});

module.exports = router;