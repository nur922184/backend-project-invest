const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

const products = [
  {
    id: 2,
    name: "শসা প্যাকেজ",
    price: 400,
    dailyIncome: 20,
    duration: "45 দিন",
    totalIncome: 900,
    image: "https://i.ibb.co.com/v6f2ts25/5.jpg",
    description: "শসা চাষে স্বল্পমেয়াদী বিনিয়োগ। দ্রুত রিটার্ন এবং সহজ ব্যবস্থাপনা।"
  },
  {
    id: 3,
    name: "টমেটো প্যাকেজ",
    price: 1000,
    dailyIncome: 45,
    duration: "60 দিন",
    totalIncome: 2700,
    image: "https://i.ibb.co.com/Sqsjwd8/8.jpg",
    description: "টমেটো চাষে লাভজনক বিনিয়োগ। বাজারে চাহিদা বেশি হওয়ায় ভালো আয়ের সুযোগ।"
  },
  {
    id: 4,
    name: "বেগুন প্যাকেজ",
    price: 2500,
    dailyIncome: 120,
    duration: "90 দিন",
    totalIncome: 10800,
    image: "https://i.ibb.co.com/sp4rwqYv/2.jpg",
    description: "বেগুন চাষে মধ্যমেয়াদী বিনিয়োগ। নিয়মিত আয় এবং ভালো লাভের সম্ভাবনা।"
  },
  {
    id: 5,
    name: "গাজর প্যাকেজ",
    price: 6000,
    dailyIncome: 290,
    duration: "120 দিন",
    totalIncome: 34800,
    image: "https://i.ibb.co.com/294sbN4/3.jpg",
    description: "গাজর চাষে উন্নত প্রযুক্তির ব্যবহার। দীর্ঘমেয়াদী স্থিতিশীল আয় নিশ্চিত।"
  },
  {
    id: 6,
    name: "আলু প্যাকেজ",
    price: 15000,
    dailyIncome: 780,
    duration: "180 দিন",
    totalIncome: 140400,
    image: "https://i.ibb.co.com/vvjxXdWJ/4.jpg",
    description: "আলু চাষে বৃহৎ পরিসরের বিনিয়োগ। বেশি মূলধনে বেশি লাভের সুযোগ।"
  },
  {
    id: 7,
    name: "পেঁয়াজ প্যাকেজ",
    price: 30000,
    dailyIncome: 1470,
    duration: "365 দিন",
    totalIncome: 536550,
    image: "https://i.ibb.co.com/rfxkhV4k/6.jpg",
    description: "পেঁয়াজ চাষে দীর্ঘমেয়াদী বিনিয়োগ। সারা বছর বাজারে চাহিদা থাকায় লাভজনক।"
  },
  {
    id: 8,
    name: "রসুন প্যাকেজ",
    price: 50000,
    dailyIncome: 2850,
    duration: "365 দিন",
    totalIncome: 18250000,
    image: "https://i.ibb.co.com/Kxr4mkyM/10.jpg",
    description: "রসুন চাষে উচ্চ লাভজনক বিনিয়োগ। বড় পরিসরে উৎপাদনে বিশাল আয়ের সম্ভাবনা।"
  },
  {
    id: 9,
    name: "সরিষা প্যাকেজ",
    price: 100000,
    dailyIncome: 6000,
    duration: "365 দিন",
    totalIncome: 600000000,
    image: "https://i.ibb.co.com/Gvzs2JT7/9.jpg",
    description: "সরিষা চাষে প্রিমিয়াম বিনিয়োগ। তেল উৎপাদনের জন্য অত্যন্ত লাভজনক প্রকল্প।"
  },
  {
    id: 10,
    name: "মাশরুম প্যাকেজ",
    price: 300000,
    dailyIncome: 19500,
    duration: "365 দিন",
    totalIncome: 585000000,
    image: "https://i.ibb.co.com/JhvzjC8/1.jpg",
    description: "মাশরুম চাষে অত্যাধুনিক বিনিয়োগ। উচ্চ মূল্যের ফসল হওয়ায় আয়ের সম্ভাবনা বেশি।"
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();