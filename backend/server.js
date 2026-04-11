require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const userRoutes = require("./routes/userRoutes");
const userController = require("./controllers/userController");

const app = express();

// Needed for secure cookies behind proxies (Vercel/Render/etc.)
app.set("trust proxy", 1);

const devOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? envOrigins
    : Array.from(new Set([...devOrigins, ...envOrigins]));

const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin / non-browser requests (no Origin header)
    if (!origin) return callback(null, true);

    // If no allowlist configured, default allow in development.
    if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(
  cors(corsOptions),
);

app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

connectDB().catch(() => {
  // If DB connection fails, exit so the app doesn't run half-alive.
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

/* ================= JOB & APPLICATION ROUTES ================= */
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes); // Alias for plural endpoint
app.use("/api/users", userRoutes);
app.get("/api/companies/:employerId", userController.getCompany);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
