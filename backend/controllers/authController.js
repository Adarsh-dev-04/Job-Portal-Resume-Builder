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

    const normalizedRole = (role || "candidate").toString().trim().toLowerCase();
    if (!name || !name.toString().trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.toString().trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!['candidate', 'employer', 'admin'].includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (normalizedRole === "employer" && (!companyName || !companyName.toString().trim())) {
      return res.status(400).json({ message: "Company name is required for employers" });
    }

    const normalizedCompanySize = ['1-10', '11-50', '51-200', '200+'].includes(companySize)
      ? companySize
      : "1-10";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.toString().trim(),
      email: email.toString().trim().toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      // candidate fields
      ...(normalizedRole === "candidate" && {
        phone: phone || "",
        city: city || "",
        headline: headline || "",
        experience: experience || "fresher",
      }),
      // employer fields
      ...(normalizedRole === "employer" && {
        companyName: companyName || "",
        companyWebsite: companyWebsite || "",
        industry: industry || "",
        companySize: normalizedCompanySize,
        companyCity: companyCity || "",
      }),
    });

    await user.save();

    res.json({ message: "User registered successfully", userId: user._id, role: user.role });
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
/* ================= UPDATE USER CREDENTIALS ================= */
exports.updateCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = req.userId;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      userId,
      { email, password: hashedPassword },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Credentials updated successfully", user });
  } catch (err) {
    console.error("Update credentials error:", err);
    res.status(500).json({ message: "Failed to update credentials" });
  }
};

/* ================= VERIFY PASSWORD ================= */
exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ message: "Password verified successfully" });
  } catch (err) {
    console.error("Verify password error:", err);
    res.status(500).json({ message: "Password verification failed" });
  }
};
