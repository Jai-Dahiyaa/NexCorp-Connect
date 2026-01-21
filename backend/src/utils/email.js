import transporter from '../config/nodemailer.js';

export const sendTestEmail = async (to, subject, otp) => {
  if (!to) {
    throw new Error('Recipient email missing');
  }

  const mailOptions = {
    from: `"SkillBridge 🔧" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50; text-align: center;">🎉 Welcome to SkillBridge</h2>
        
        <p>Hello,</p>
        <p>Thank you for joining <strong>SkillBridge</strong>. We’re excited to have you on board!</p>
        
        <p>To complete your account verification, please use the One-Time Password (OTP) given below:</p>
        
        <div style="
          font-size: 28px;
          font-weight: bold;
          background-color: #eef;
          padding: 12px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          letter-spacing: 4px;
        ">
          ${otp}
        </div>
        
        <p>This OTP is valid for <strong>5 minutes</strong>. Please enter it on the verification screen to activate your account.</p>
        <p>If you did not request this verification, you can safely ignore this email.</p>
        
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #7f8c8d;">
          This is an automated email from <strong>SkillBridge Services</strong>.  
          Please do not reply to this message.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendForgetPasswordEmail = async (to, subject, otp) => {
  if (!to) {
    throw new Error('Recipient email missing');
  }

  const mailOptions = {
    from: `"SkillBridge 🔧" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password on <strong>SkillBridge</strong>.</p>
        <p>Please use the following One-Time Password (OTP) to reset your password:</p>
        
        <div style="
          font-size: 28px;
          font-weight: bold;
          background-color: #eef;
          padding: 12px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          letter-spacing: 4px;
        ">
          ${otp}
        </div>

        <p>This OTP is valid for <strong>15 minutes</strong>. Please enter it on the reset screen.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #7f8c8d;">
          This is an automated message from SkillBridge. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendLoginOtpEmail = async (to, subject, otpCode) => {
  if (!to) {
    throw new Error('Recipient email missing');
  }

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
        
        <div style="
          font-size: 28px;
          font-weight: bold;
          background-color: #eef;
          padding: 12px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          letter-spacing: 4px;
        ">
          ${otpCode}
        </div>

        <p>If you did not attempt to log in, you can safely ignore this email.</p>
        
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #7f8c8d;">
          This is an automated message from SkillBridge. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

