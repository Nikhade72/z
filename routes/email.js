const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'harshanikhade72@gmail.com', // Replace with your email address
    pass: 'vfdb ewxs mekz toso',   // Replace with your email password
  },
});

router.post('/sendEmail', (req, res) => {
  const { email, bookingId, seatNumbers  } = req.body;

  // Compose the email
  const mailOptions = {
    from: 'harshanikhade72@gmail.com',
    to: 'harshanikhade72@gmail.com', // Use the 'to' parameter from the request body
    subject: 'Booking Confirmation', // Use the 'subject' parameter from the request body
    text: `Thank you for booking! Your booking ID is ${bookingId}. Your seat number(s) are: ${seatNumbers}`, // Use the 'text' parameter from the request body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Email sending failed' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
});

module.exports = router;
