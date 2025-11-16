import request from 'supertest';
import app from '../src/index.js';
import redisClient from '../src/config/redis.js';
import db from '../src/db/db.js';

const testEmail = `testuser_12@gmail.com`;
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

  it('should update status', async () => {
    const res = await request(app)
      .post('/auth/statusChange')
      .set('Cookie', accessToken)
      .send({ status: 'true' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User Status SuccessFull Change');

    const id = res.body.user.id;

    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toEqual({
      id: id,
      email: testEmail,
      status: true,
    });
  });
});

describe('Login Route = /auth/login', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome Back');
    expect(res.body.users).toHaveProperty('id');

    const id = res.body.users.id;
    const password = res.body.users.password;
    const create_at = res.body.users.created_at;

    expect(res.body.users).toEqual({
      id: id,
      email: testEmail,
      password: password,
      role: testRole,
      status: true,
      created_at: create_at,
    });

    const cookies = res.headers['set-cookie'];

    const accessToken = cookies.find((c) => c.startsWith('accessToken')).split(';')[0];
    const refreshToken = cookies.find((c) => c.startsWith('refreshToken')).split(';')[0];

    expect(accessToken).toMatch(/^accessToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(refreshToken).toMatch(/^refreshToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
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
}, 25000);

afterAll(async () => {
  await db.end();        
  await redisClient.quit();
});