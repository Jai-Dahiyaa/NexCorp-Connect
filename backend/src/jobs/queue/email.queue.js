import { Queue } from 'bullmq';

const connection =  { host: '127.0.0.1', port: 6379 };

export const emailQueue = new Queue('emailQueue', {
  connection
});

export const forgetPassEmailOTPQueue = new Queue("ForgetPasswordEmailQueue", {
  connection
})

export const loginOTPQueue = new Queue("Login OTP queue", {
  connection
})