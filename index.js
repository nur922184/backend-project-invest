const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const bonusRoutes = require("./routes/bonusRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const accountRoutes = require("./routes/accountRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const authRoutes = require("./routes/authRoutes");

// ================= USE ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/bonus", bonusRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/auth", authRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ================= DB CONNECT =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    // indexes (safe check)
    await db.collection("users").createIndex({ email: 1 });
    await db.collection("users").createIndex({ referralCode: 1 });

    await db.collection("investments").createIndex({ userId: 1 });
    await db.collection("transactions").createIndex({ userId: 1 });
    await db.collection("bonus").createIndex({ userId: 1 });
    await db.collection("accounts").createIndex({ userId: 1 });
    await db.collection("withdrawals").createIndex({ userId: 1 });

    console.log("✅ Database indexes created");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};

// ================= STARTUP =================
connectDB();

// ================= VERCEL EXPORT =================
// ❗ IMPORTANT: Vercel uses this instead of app.listen()
module.exports = app;

// ================= LOCAL SERVER SUPPORT =================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
// -----------------------------------------------------

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

// // test route
// app.get("/", (req, res) => {
//   res.send("Server is running 🚀");
// });

// // ✅ DB connect (no listen)
// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     isConnected = true;
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.log("❌ DB Error:", err);
//   }
// };

// // every request এ DB connect check হবে
// app.use(async (req, res, next) => {
//   await connectDB();
//   next();
// });

// // ❌ app.listen REMOVE
// // ✅ export app
// module.exports = app;