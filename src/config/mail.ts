import nodemailer from "nodemailer";

// Transporter configuration
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Function to send OTP email
export const sendEmailOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your HealthHub OTP",
    html: `<h2>HealthHub OTP</h2><p>Your OTP: <strong>${otp}</strong></p><p>Expires in 30 minutes.</p>`,
    text: `Your HealthHub OTP is: ${otp}. It will expire in 30 minutes.`,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent:', result.messageId);
  return result;
};
