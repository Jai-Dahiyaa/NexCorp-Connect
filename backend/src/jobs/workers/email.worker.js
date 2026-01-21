import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import { sendTestEmail, sendForgetPasswordEmail, sendLoginOtpEmail } from '../../utils/email.js';
dotenv.config();

const connection =  { host: '127.0.0.1', port: 6379 };

const worker = new Worker(
  'emailQueue',
  async (job) => {
    const { to, subject, otp } = job.data;
    await sendTestEmail(to, subject, otp);
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

const passForgetWorker = new Worker(
  'ForgetPasswordEmailQueue',
  async (job) => {
    const {to, subject, otp} = job.data;
    await sendForgetPasswordEmail(to, subject, otp)
  },
   { connection }
)

passForgetWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

const loginOTPEmailWorker = new Worker (
  "Login OTP queue",
  async (job) => {
    const {to, subject, otpCode} = job.data;
    await sendLoginOtpEmail(to, subject, otpCode)
  },
  {connection }
)

loginOTPEmailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
