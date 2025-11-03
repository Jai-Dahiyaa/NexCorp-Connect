import request from 'supertest';
import app from '../src/index.js';
import redisClient from '../src/config/redis.js';
import db from '../src/db/db.js';

const testEmail = 'ok3a11eaqqas22wwd@gmail.com';
const testPassword = 'jai@123';
const testRole = 'admin';

let otpCode;
let accessToken;

describe('Signup Route - /auth/signUp', () => {
  it('should send OTP and set refreshToken in cookie', async () => {
    const res = await request(app)
      .post('/auth/signUp')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Send OTP on your email');

    const otp = await redisClient.get(`otp:${testEmail}`);
    otpCode = otp;

    expect(otp).toBeDefined();
  });

  it('should verify OTP and register user', async () => {
    const res = await request(app).post('/auth/signUpOTP').send({ email: testEmail, otp: otpCode });

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe('OTP Verify user successfully register');

    expect(res.body.users).toBeDefined();
    expect(res.body.users).toHaveProperty('id');
    expect(res.body.users.email).toBe(testEmail);
    expect(res.body.users.message).toBe('OTP verified successfully');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    accessToken = expect(cookies[0]).toMatch(/accessToken/i);

    accessToken = cookies.find((c) => c.startsWith('accessToken=')).split(';')[0];
    expect(accessToken).toMatch(/accessToken=/i);

  });

  it('should assign role and return updated user with tokens', async () => {
    const res = await request(app)
      .post('/auth/roleassign')
      .set('Cookie', accessToken)
      .send({ role: testRole });

    expect(res.statusCode).toBe(200); 

    expect(res.body.message).toBe('User Register Sucessfully');

    expect(res.body.users).toBeDefined();
    expect(res.body.users.email).toBe(testEmail);
    expect(res.body.users.role).toBe(testRole);
    expect(res.body.users).toHaveProperty('id');
    expect(res.body.users).toHaveProperty('created_at');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/accessToken/i);
    expect(cookies[1]).toMatch(/refreshToken/i);
  });
});

afterAll(async () => {
  try {
    await db.query(`DELETE FROM users WHERE email = '${testEmail}'`);
    await redisClient.del(`otp:${testEmail}`);
    await db.release();
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}, 15000);

