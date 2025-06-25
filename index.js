const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const NewUser = require('./Models/user');  // Correctly import the model

const PORT = 7000;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Function to send promotional email
const sendPromotionalEmail = async (email) => {  // Removed req, res arguments for standalone function
  if (!email) {
    console.error('Email address is required');
    return { success: false, message: 'Email address is required' };
  }

  try {
    const user = await NewUser.findOne({ email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return { success: false, message: 'User not found' };
    }

    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "valiantrajz09@gmail.com",
        pass: "kjsi rpwv tlpp egoz"
      }
    });

    const mailDetails = {
      from: "valiantrajz09@gmail.com",
      to: email,
      subject: 'Special Promotion from RealEstate!',
      html: `
        <html>
          <head>
            <title>List Your Property</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
              }
              .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              h1 {
                color: #4CAF50;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                font-size: 16px;
                color: #fff;
                background-color: #4CAF50;
                border: none;
                border-radius: 5px;
                text-decoration: none;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>List Your Property for Free!</h1>
              <p>Dear ${user.firstName},</p>
              <p>You can now list your house for sale or rent easily on our platform. Just follow a simple process of filling out a form and your property will be available for thousands of potential buyers or renters to see.</p>
              <a href="http://localhost:4200/user/sell" class="button">List Your Property Now</a>
              <p>Thank you for choosing RealEstate!</p>
              <p class="footer">RealEstate Team</p>
            </div>
          </body>
        </html>
      `
    };

    await mailTransporter.sendMail(mailDetails);
    console.log(`Promotional email sent successfully to ${email} at:`, new Date());
    return { success: true };
  } catch (error) {
    console.error(`Error sending promotional email to ${email}:`, error);
    return { success: false, message: 'Internal server error' };
  }
};

// List of emails to send the promotional email to
const emailsToSend = ['rajviadesara09@gmail.com']; // Replace with actual email list

// Cron job to send promotional emails every 2 minutes
cron.schedule('*/1 * * * *', async () => {
  console.log('Cron job started:', new Date());

  for (const email of emailsToSend) {
    const result = await sendPromotionalEmail(email);
    if (result.success) {
      console.log('Promotional email sent successfully to via cronjob:', email);
    } else {
      console.log('Failed to send promotional email to via cronjob:', email, 'Error:', result.message);
    }
  }

  console.log('Cron job completed:', new Date());
});

mongoose
  .connect('mongodb+srv://rajzad912:rajvi912@cluster0.cwhcege.mongodb.net/pro1')
  .then(() => {
    console.log("Connected to MongoDB Atlas.");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
