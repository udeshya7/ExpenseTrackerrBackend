const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const secret = 'Uddeshya@123';

app.post('/verification', (req, res) => {
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(body);
    const digest = shasum.digest('hex');

    console.log('Received Signature:', razorpaySignature);
    console.log('Calculated Signature:', digest);
    console.log('Full Request Body:', req.body);

    if (digest === razorpaySignature) {
        console.log('Payment signature verified successfully!');
        fs.writeFileSync('paymentDetails.json', body, 'utf8');
        res.status(200).json({ status: 'success' });
    } else {
        console.error('Invalid payment signature!');
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
