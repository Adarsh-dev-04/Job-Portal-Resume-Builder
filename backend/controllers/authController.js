const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      // candidate fields
      phone,
      city,
      headline,
      experience,
      // employer fields
      companyName,
      companyWebsite,
      industry,
      companySize,
      companyCity,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "candidate",
      // candidate fields
      ...(role === "candidate" && {
        phone: phone || "",
        city: city || "",
        headline: headline || "",
        experience: experience || "fresher",
      }),
      // employer fields
      ...(role === "employer" && {
        companyName: companyName || "",
        companyWebsite: companyWebsite || "",
        industry: industry || "",
        companySize: companySize || "1-10",
        companyCity: companyCity || "",
      }),
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: "User already exists or invalid data" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName || "",
      isVerified: user.isVerified || false,
      isSuspended: user.isSuspended || false
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
