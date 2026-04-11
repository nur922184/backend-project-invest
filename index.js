// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Import routes
// const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productRoutes");
// const investmentRoutes = require("./routes/investmentRoutes");
// const bonusRoutes = require("./routes/bonusRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const accountRoutes = require('./routes/accountRoutes');
// const withdrawalRoutes = require("./routes/withdrawalRoutes");
// const authRoutes = require("./routes/authRoutes");

// // ✅ Use routes
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/investments", investmentRoutes);
// app.use("/api/bonus", bonusRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use('/api/accounts', accountRoutes);
// app.use("/api/withdrawals", withdrawalRoutes);                     
// app.use("/api/auth", authRoutes);                     

// // test route
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running...");
// });

// const PORT = process.env.PORT || 5000;

// // ✅ Start server AFTER DB connect
// const startServer = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB Connected");
    
//     // Create indexes for better performance
//     await mongoose.connection.db.collection("users").createIndex({ email: 1 });
//     await mongoose.connection.db.collection("users").createIndex({ referralCode: 1 });
//     await mongoose.connection.db.collection("investments").createIndex({ userId: 1 });
//     await mongoose.connection.db.collection("transactions").createIndex({ userId: 1 });
//     await mongoose.connection.db.collection("bonus").createIndex({ userId: 1 });
//     await mongoose.connection.db.collection("accounts").createIndex({ userId: 1 });
//     await mongoose.connection.db.collection("withdrawals").createIndex({ userId: 1 });
//     await mongoose.connection.db.collection("auth").createIndex({ userId: 1 });
    
//     console.log("✅ Database indexes created");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.log("❌ DB Error:", err);
//   }
// };

// startServer();
// -----------------------------------------------------------------

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/bonus", require("./routes/bonusRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/accounts", require("./routes/accountRoutes"));
app.use("/api/withdrawals", require("./routes/withdrawalRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// MongoDB connect (cached for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// middleware DB connect
app.use(async (req, res, next) => {
  await dbConnect();
  next();
});

module.exports = app;