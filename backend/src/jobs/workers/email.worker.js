import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import { sendTestEmail } from '../../utils/email.js';

const worker = new Worker(
  'emailQueue',
  async (job) => {
    console.log('📥 Job received by worker:', job.data);
    const { to, subject, otp } = job.data;
    await sendTestEmail(to, subject, otp);
  },
  { connection: { host: '127.0.0.1', port: 6379 } }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});
