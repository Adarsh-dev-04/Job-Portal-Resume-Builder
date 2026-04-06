const employerOnly = require("../middleware/employerOnly");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const jobController = require("../controllers/jobController");

/* employer only */
router.post("/", auth, employerOnly, jobController.createJob);

/* public */
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJob);

/* employer owner */
router.delete("/:id", auth, employerOnly, jobController.deleteJob);

module.exports = router;