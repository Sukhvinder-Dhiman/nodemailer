require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (if your form is part of an HTML file)
app.use(express.static('public'));

// Route to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, email, subject, comments } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: `"${name}" <${email}>`, // sender address
        to: process.env.EMAIL_USER, // your email address to receive the messages
        subject: subject || 'New Contact Form Submission', // subject line
        text: `You have received a new message from your website contact form.\n\n` +
              `Here are the details:\n\n` +
              `Name: ${name}\n\n` +
              `Email: ${email}\n\n` +
              `Subject: ${subject}\n\n` +
              `Message: ${comments}\n\n`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
