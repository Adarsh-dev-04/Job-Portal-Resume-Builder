const employerOnly = require("../middleware/employerOnly");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const jobController = require("../controllers/jobController");

/* employer only */
router.post("/", auth, employerOnly, jobController.createJob);
router.patch("/:id", auth, employerOnly, jobController.updateJob);

/* public */
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJob);

/* employer owner */
router.delete("/:id", auth, employerOnly, jobController.deleteJob);

router.post("/:id/close", auth, employerOnly, jobController.closeJob);
router.post("/:id/reopen", auth, employerOnly, jobController.reopenJob);

router.get("/employer/:employerId", auth, employerOnly, jobController.getEmployerJobs);
router.get("/employer/:employerId/job/:id", auth, employerOnly, jobController.getJobDetailsForEmployer);

module.exports = router;