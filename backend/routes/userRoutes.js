const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");

// GET USER PROFILE
router.get("/profile", auth, userController.getProfile);

// UPDATE USER PROFILE
router.put("/profile", auth, userController.updateProfile);

// GET COMPANY PROFILE
router.get("/company", auth, userController.getCompany);

// UPDATE COMPANY PROFILE
router.put("/company", auth, userController.updateProfile);

// GET ALL USERS (ADMIN ONLY)
router.get("/", auth, adminController.getAllUsers);

// DELETE USER (ADMIN ONLY)
router.delete("/:id", auth, adminController.deleteUserByAdmin);

module.exports = router;