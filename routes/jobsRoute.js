const express = require("express");
const userAuth = require("../middleware/authMiddleware")
const {createJobController, getAlljobsController,updateJobController,deleteJobController} = require("../controllers/jobsController")

const router =express.Router()

router.post("/create-job",userAuth,createJobController)
router.post("get-jobs",userAuth,getAlljobsController)


router.patch("/update-job/:id",userAuth,updateJobController)


router.delete("/delete-job/:id",userAuth,deleteJobController)


router.get("/job-stats",userAuth,jobStatsController)

module.exports = router