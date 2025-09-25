import  nodemailer from "nodemailer";

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
    from: `"HealthHub Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your HealthHub OTP",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h1 style="color: #4CAF50;">HealthHub.com</h1>
        <h2 style="color: #555;">Your OTP Code</h2>
        <p style="font-size: 18px;">Use the OTP below to complete your action:</p>
        <p style="font-size: 24px; font-weight: bold; color: #000; background-color: #f2f2f2; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</p>
        <p style="margin-top: 20px; font-size: 14px; color: #888;">
          This OTP will expire in <strong>30 minutes</strong>.
        </p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
    text: `HealthHub OTP: ${otp}. It will expire in 30 minutes. If you did not request this, please ignore this email.`,
  };
  
  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent:', result.messageId);
  return result;
};
