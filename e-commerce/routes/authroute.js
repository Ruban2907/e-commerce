const express = require("express");
const router = express.Router();
const {handleUserlogin} = require("../controller/login")

router.post("/", handleUserlogin);

module.exports = router;