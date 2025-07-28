const express = require("express");
const router = express.Router();
const {handleUserSignup} = require("../controller/registration")

router.post("/", handleUserSignup);

module.exports = router;