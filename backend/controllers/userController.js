const User = require("../models/User");
const Resume = require("../models/resume");

/* ================= GET CURRENT USER PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ================= UPDATE CURRENT USER PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email; // Email changes might need verification
    delete updates.role; // Role changes should be admin only

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ================= DELETE CURRENT USER ACCOUNT ================= */
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all user's resumes first
    await Resume.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

/* ================= GET COMPANY DETAILS ================= */
exports.getCompany = async (req, res) => {
  try {
    const user = await User.findById(req.params.employerId).select("-password");

    if (!user || user.role !== "employer") {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get company error:", err);
    res.status(500).json({ message: "Failed to load company details" });
  }
};