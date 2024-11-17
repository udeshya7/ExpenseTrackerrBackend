const router = require('express').Router();
const { requestOtp, verifyOtp } = require('../controller/appController.js');

router.post('/user/request-otp', requestOtp);   // Route for requesting OTP
router.post('/user/verify-otp', verifyOtp);     // Route for verifying OTP

module.exports = router;
