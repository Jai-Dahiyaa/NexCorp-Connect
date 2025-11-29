import request from 'supertest';
import app from '../src/server.js';
import redisClient from '../src/config/redis.js';
import db from '../src/db/db.js';
import AppError from '../src/utils/appError.js';

const testEmail = `testuser_12@gmail.com`;
const testPassword = 'jai@123';
const testRole = 'admin';

let otpCode;
let accessToken;
let refreshToken;

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
    const loginRefreshToken = cookies.find((c) => c.startsWith('refreshToken')).split(';')[0];

    refreshToken = loginRefreshToken;

    expect(accessToken).toMatch(/^accessToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(refreshToken).toMatch(/^refreshToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  });
});

describe('Refresh Token api test code', () => {
  it('Refresh Token api test code', async () => {
    if (!refreshToken) throw new AppError('No refresh token provided', 401);
    const res = await request(app)
      .post('/auth/refreshToken')
      .set('Cookie', [`${refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('access and refresh token generate successfully');

    expect(res.body.users).toHaveProperty('id');

    const id = res.body.users.id;
    const email = res.body.users.email;
    const password = res.body.users.password;
    const role = res.body.users.role;
    const created_at = res.body.users.created_at;
    const status = res.body.users.status;

    expect(res.body.users).toEqual({
      id: id,
      email: email,
      password: password,
      role: role,
      status: status,
      created_at: created_at,
    });

    const cookies = res.headers['set-cookie'];

    const accessToken = cookies.find((c) => c.startsWith('accessToken')).split(';')[0];
    const testRefreshToken = cookies.find((c) => c.startsWith('refreshToken')).split(';')[0];

    expect(accessToken).toMatch(/^accessToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(testRefreshToken).toMatch(
      /^refreshToken=[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    );
  });
});

let forgetPassOTP;
let forgetPassToken;
let forgetPass1 = '9048945';
let forgetPass2 = '9048945';

describe('Forget Password api test code', () => {
  it('send otp for forget-password api', async () => {
    const res = await request(app).post('/auth/forgetPassword').send({
      email: testEmail,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('otp send successfully your email');
    const otp = await redisClient.get(`otp:forgetPass:${testEmail}`);
    if (!otp) throw new AppError('otp not catch error in server');

    forgetPassOTP = otp;
  });

  it('forget password otp verify with email', async () => {
    const res = await request(app).post('/auth/forget-otp-verify').send({
      email: testEmail,
      otp: forgetPassOTP,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password Reset OTP Verify');

    const cookies = res.headers['set-cookie'];

    const resetSessionCookie = cookies.find((c) => c.startsWith('reset-session')).split(';')[0];
    if (!resetSessionCookie) throw new AppError('forget Password token not find', 404);

    forgetPassToken = resetSessionCookie;
  });

  it('forget password reset successfully', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .set('Cookie', [`${forgetPassToken}`])
      .send({
        pass1: forgetPass1,
        pass2: forgetPass2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Your password change successfull');
  });
});

let loginWithOtpToken;
let loginOTPget;
let loggedOutAccessToken;

describe('login with OTP api test code', () => {
  it('send otp on email with nodemailer api test', async () => {
    const res = await request(app).post('/auth/login-otp').send({
      email: testEmail,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login OTP send your email Successfully');

    const cookies = res.headers['set-cookie'];

    const loginOTPToken = cookies.find((c) => c.startsWith('login-otp')).split(';')[0];
    if (!loginOTPToken) throw new AppError('forget Password token not find', 404);

    loginWithOtpToken = loginOTPToken;

    const loginOTP = await redisClient.get(`otp:loginOTP:${testEmail}`);
    if (!loginOTP) throw new AppError('Login otp not get in test code', 500);

    loginOTPget = loginOTP;
  });

  it('login otp verify api test code', async () => {
    const res = await request(app)
      .post('/auth/otp-login-verify')
      .set('Cookie', [`${loginWithOtpToken}`])
      .send({
        otp: loginOTPget,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User Login SuccessFully');

    expect(res.body.users).toHaveProperty('id');

    const id = res.body.users.id;
    const email = res.body.users.email;
    const role = res.body.users.role;
    const created_at = res.body.users.created_at;
    const status = res.body.users.status;

    expect(res.body.users).toEqual({
      id: id,
      email: email,
      role: role,
      status: status,
      created_at: created_at,
    });

    const cookies = res.headers['set-cookie'];

    const loginOTPAccessToken = cookies.find((c) => c.startsWith('accessToken')).split(';')[0];
    if (!loginOTPAccessToken) throw new AppError('Login with otp Access token is not create', 404);

    loggedOutAccessToken = loginOTPAccessToken;

    const loginOTPRefreshToken = cookies.find((c) => c.startsWith('refreshToken')).split(';')[0];
    if (!loginOTPRefreshToken)
      throw new AppError('Login with otp Refresh token is not create', 404);

    const loginOTPFinalToken = cookies.find((c) => c.startsWith('login-otp')).split(';')[0];
    if (!loginOTPFinalToken) throw new AppError('Login with otp login token is not create', 404);
  });
});

describe('logged out api test code', () => {
  it('logged out test code', async () => {
    const res = await request(app)
      .post('/auth/loggedOut')
      .set('Cookie', [`${loggedOutAccessToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('successfully logged out');

    const cookies = res.headers['set-cookie'];

    expect(cookies.some((c) => c.includes('accessToken=') && c.includes('Expires'))).toBe(true);

    expect(cookies.some((c) => c.includes('refreshToken=') && c.includes('Expires'))).toBe(true);
  });
});

afterAll(async () => {
  try {
    await db.query(`DELETE FROM users WHERE email = '${testEmail}'`);
    await redisClient.del(`otp:${testEmail}`);
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}, 30000);
