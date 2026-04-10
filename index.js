const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const bonusRoutes = require("./routes/bonusRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
// const withdrawalRoutes = require("./routes/withdrawalRoutes");

// ✅ Use routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/bonus", bonusRoutes);
app.use("/api/transactions", transactionRoutes);
// app.use("/api/withdrawals", withdrawalRoutes);

// test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

const PORT = process.env.PORT || 5000;

// ✅ Start server AFTER DB connect
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    
    // Create indexes for better performance
    await mongoose.connection.db.collection("users").createIndex({ email: 1 });
    await mongoose.connection.db.collection("users").createIndex({ referralCode: 1 });
    await mongoose.connection.db.collection("investments").createIndex({ userId: 1 });
    await mongoose.connection.db.collection("transactions").createIndex({ userId: 1 });
    await mongoose.connection.db.collection("bonus").createIndex({ userId: 1 });
    
    console.log("✅ Database indexes created");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("❌ DB Error:", err);
  }
};

startServer();

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