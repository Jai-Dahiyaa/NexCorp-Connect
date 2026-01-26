// import request from 'supertest';
// import app from '../src/server.js';
// import redisClient, { closeRedis } from '../src/config/redis.js';
// import testPool from '../src/db/dbTest.js';
// import AppError from '../src/utils/appError.js';

// beforeAll(async () => {
//   await testPool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
// });

// const testEmail = `testuser_123@gmail.com`;
// const testPassword = 'jai@123';

// describe('Signup Route - /auth/signUp', () => {
//   it('should send OTP and set refreshToken in cookie', async () => {
//     const res = await request(app)
//       .post('/auth/signUp')
//       .send({ email: testEmail, password: testPassword });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe('Send OTP on your email');
//   });
// });

// afterAll(async () => {
//   await testPool.end();
//   await closeRedis();
// });

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import redisClient, { closeRedis } from '../src/config/redis.js';
import testPool from '../src/db/dbTest.js';

jest.setTimeout(30000); // 30s for slow I/O

beforeAll(async () => {
  // Clean DB and Redis
  await testPool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  if (redisClient.isOpen) {
    await redisClient.flushDb(); // clear test Redis DB index
  }
});

const testEmail = 'testuser_123@gmail.com';
const testPassword = 'jai@123';

describe('Signup Route - /auth/signUp', () => {
  it('should send OTP and set refreshToken in cookie', async () => {
    const res = await request(app)
      .post('/auth/signUp')
      .send({ email: testEmail, password: testPassword });

    // Debug on failure
    if (res.statusCode !== 200) {
      // eslint-disable-next-line no-console
      console.log('Signup error payload:', res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Send OTP on your email');

    // Optional: verify OTP stored in Redis
    const otp = await redisClient.get(`otp:${testEmail}`);
    expect(otp).toBeTruthy();

    // Optional: verify refreshToken cookie set
    const setCookie = res.headers['set-cookie'] || [];
    const hasRefresh = setCookie.some((c) => c.includes('refreshToken='));
    expect(hasRefresh).toBe(true);
  });
});

afterAll(async () => {
  await testPool.end();
  await closeRedis(); 
});
