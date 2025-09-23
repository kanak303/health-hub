import nodemailer from "nodemailer";

// Transporter configuration
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
export const sendEmailOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your HealthHub OTP",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
