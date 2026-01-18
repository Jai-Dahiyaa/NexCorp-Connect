import transporter from '../config/nodemailer.js';

export const sendTestEmail = async (to, subject, otp) => {
  if (!to) {
    throw new Error('Recipient email missing');
  }
  const mailOptions = {
    from: `"SkillBridge 🔧" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: ` <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;"> <h2 style="color: #2c3e50;">🔐 Your OTP Code</h2> <p>Hello,</p> <p>Use the following OTP to verify your signup on <strong>SkillBridge</strong>. Valid for <strong>5 minutes</strong>.</p> <div style="font-size: 28px; font-weight: bold; background-color: #eef; padding: 12px; text-align: center; border-radius: 8px; margin: 20px 0;"> ${otp} </div> <p style="text-align:center;"> <a href="${process.env.VERIFY_LINK}" style="background:#3498db;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;"> ✅ Verify OTP </a> </p> <hr style="margin-top:30px;"> <p style="font-size:12px;color:#7f8c8d;">This is an automated message from SkillBridge. Do not reply.</p> </div> `,
  };
  await transporter.sendMail(mailOptions);
};

const sendForgetPasswordEmail = async (to, subject, resetLink) => {
  const mailOptions = {
    from: `"SkillBridge 🔧" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: ` <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;"> <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2> <p>Hello,</p> <p>You requested to reset your password on <strong>SkillBridge</strong>.</p> <p>Please click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p> <div style="text-align: center; margin: 20px 0;"> <a href="${resetLink}" style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;"> 🔑 Reset Password — Click Here </a> </div> <p>If you did not request this, you can safely ignore this email.</p> <hr style="margin-top: 30px;"> <p style="font-size: 12px; color: #7f8c8d;">This is an automated message from SkillBridge. Please do not reply.</p> </div> `,
  };
  return mailOptions;
};

const sendLoginOtpEmail = async (to, subject, otpCode) => {
  const mailOptions = {
    from: `"SkillBridge 🔧" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #2c3e50;">🔐 Login Verification Code</h2>
    <p>Hello,</p>
    <p>You are trying to log in to <strong>SkillBridge</strong>.</p>
    <p>Please use the following One-Time Password (OTP) to verify your login. This code is valid for <strong>5 minutes</strong>.</p>
    <div style="font-size: 28px; font-weight: bold; background-color: #ecf0f1; padding: 12px; text-align: center; border-radius: 8px; margin: 20px 0;">
      ${otpCode}
    </div>
    <p>If you did not attempt to log in, you can safely ignore this email.</p>
    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #7f8c8d;">This is an automated message from SkillBridge. Please do not reply.</p>
  </div>
`,
  };

  return mailOptions;
};

export default { sendForgetPasswordEmail, sendLoginOtpEmail };
