import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@skillswap.com',
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Skill Swap Platform!';
  const html = `
    <h1>Welcome ${user.name}!</h1>
    <p>Thank you for joining our Skill Swap Platform. Start connecting with others and exchange skills today!</p>
    <p>Best regards,<br>The Skill Swap Team</p>
  `;
  
  await sendEmail(user.email, subject, html);
};

export const sendSwapRequestEmail = async (recipient, requester, skillOffered, skillRequested) => {
  const subject = 'New Skill Swap Request';
  const html = `
    <h1>New Skill Swap Request</h1>
    <p>Hi ${recipient.name},</p>
    <p>${requester.name} wants to swap skills with you:</p>
    <ul>
      <li><strong>They offer:</strong> ${skillOffered}</li>
      <li><strong>They want:</strong> ${skillRequested}</li>
    </ul>
    <p>Log in to your account to respond to this request.</p>
    <p>Best regards,<br>The Skill Swap Team</p>
  `;
  
  await sendEmail(recipient.email, subject, html);
};