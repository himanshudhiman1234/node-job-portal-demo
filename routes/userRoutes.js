const express = require("express");
const updateController = require("../controllers/userController");
const userAuth = require('../middleware/authMiddleware')
const router = express.Router();


router.put('/update-user',userAuth,updateController)

module.exports = router