const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function sendUser(user) {
  return {
    _id: user._id,
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    donorType: user.donorType,
    image: user.image,
    totalDonations: user.totalDonations,
    totalMealsDonated: user.totalMealsDonated,
    totalFoodReceived: user.totalFoodReceived,
    totalPeopleHelped: user.totalPeopleHelped,
    phone: user.phone,
    address: user.address,
    restaurant: user.restaurant,
    createdAt: user.createdAt,
  };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address, donorType, restaurant } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "সব ঘর পূরণ করুন।" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "এই ইমেইল দিয়ে আগে থেকেই একটা অ্যাকাউন্ট আছে।" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6ba368&color=fff`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      status: "pending",
      phone,
      address,
      donorType,
      image,
      restaurant,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: sendUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভালের অপেক্ষায় আছে।" });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: sendUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(sendUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/users/:id
router.patch("/users/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(sendUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/auth/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
