const express = require("express");
const { testPostController } = require("../controllers/testController");
const userAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/test",userAuth,testPostController)



module.exports = router