require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Resume = require("./models/resume");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-vercel-app.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

/* ================= RESUME ROUTES ================= */

// CREATE or UPDATE resume
app.post("/api/resume", auth, async (req, res) => {
  try {
    const { resumeId, title, data } = req.body;

    // UPDATE
    if (resumeId) {
      const updated = await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.userId },
        { title, data },
        { new: true }
      );
      return res.json(updated);
    }

    // CREATE
    const resume = new Resume({
      userId: req.userId,
      title: title || "Untitled Resume",
      data,
    });

    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
});

// GET ALL resumes
app.get("/api/resumes", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Failed to load resumes" });
  }
});

// GET ONE resume (FULL OBJECT)
app.get("/api/resume/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) return res.status(404).json(null);
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: "Failed to load resume" });
  }
});

// RENAME resume
app.patch("/api/resume/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title: req.body.title },
      { new: true }
    );

    if (!resume) return res.status(404).json(null);
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: "Rename failed" });
  }
});

// DELETE resume
app.delete("/api/resume/:id", auth, async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ================= AUTH ROUTES ================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "User registered successfully" });
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const name = User.name;

  const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

  res.json({ token, userId: user._id, name: user.name });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
