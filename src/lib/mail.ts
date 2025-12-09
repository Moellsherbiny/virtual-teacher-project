import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Missing SMTP environment variables");
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // use true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export async function sendOTP(to: string, otp: string) {
  const mailOptions = {
    from: `"OTP Verification Service" `,
    to,
    subject: "Your One-Time Password (OTP) for Verification",
    text: `Your OTP is: ${otp}. This code is valid for 10 minutes. Do not share this code.`,
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto; border-radius: 8px;">
                <h2 style="color: #333;">Account Verification</h2>
                <p>Hello,</p>
                <p>You requested a one-time password (OTP) to verify your account. Use the code below to complete your verification:</p>
                <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <strong style="font-size: 24px; color: #007bff;">${otp}</strong>
                </div>
                <p>This code is valid for a limited time (e.g., 5 minutes).</p>
                <p style="color: #ff0000; font-weight: bold;">Do not share this code with anyone.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p style="font-size: 12px; color: #777; margin-top: 30px;">Thank you,<br>The Verification Team</p>
            </div>
        `,
  };

  try {
    console.log(`Attempting to send OTP to ${to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    // console.log('Preview URL:', nodemailer.getTestMessageUrl(info)); // Useful if you were using a testing mail service
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    console.error("Details:", error);
  }
}
