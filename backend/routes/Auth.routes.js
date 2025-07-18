const express = require("express");

const router = express.Router();


const {signup,login,logout,sendOtp,checkAuth} = require("../controllers/Auth")
const {verifyToken} = require("../middleware/VerifyToken")

router.post("/signup",signup);

router.post("/login",login);

router.post("/sendotp",sendOtp);

router.post("/logout",logout)

router.get("/check",verifyToken,checkAuth);



module.exports = router;