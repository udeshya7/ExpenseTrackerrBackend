const nodemailer = require('nodemailer');

// Assuming your EMAIL and PASSWORD are in env
const { EMAIL, PASSWORD } = require('../env.js');

let otpStore = {}; // Temporary storage for OTPs

// Generate a 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOtpEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    let message = {
        from: EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    return transporter.sendMail(message);
};

// Endpoint to request OTP
const requestOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOtp();

    otpStore[email] = otp; // Store OTP in memory

    try {
        await sendOtpEmail(email, otp);
        return res.status(200).json({ message: 'OTP sent to your email!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Error sending OTP' });
    }
};


// Endpoint to verify OTP
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email]; // Remove OTP after verification
        return res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
};
 

// Export the functions
module.exports = {
    requestOtp,
    verifyOtp
};
