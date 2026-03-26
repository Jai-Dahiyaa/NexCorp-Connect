import request from 'supertest';
import app from '../src/server.js';
import redisClient from '../src/config/redis.js';
import testPool from '../src/db/dbTest.js';

beforeAll(async () => {
  await testPool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  await redisClient.flushDb();
});

const testEmail = "Test@gmail.com";
const testPass = "9k93293";

describe("Local Auth Test", () => {

  let accessToken;
  let refreshToken;

  describe("SignUp Route Test", () => {

    let signUpOTP;

    it("SigUp api test", async () => {
      const res = await request(app)
        .post("/auth/signUp")
        .send({
          email: testEmail,
          password: testPass
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Send OTP on your email");

      const otp = await redisClient.get(`otp:${testEmail}`);
      signUpOTP = otp;
    });

    it("SignUp OTP Verify", async () => {
      const res = await request(app)
        .post("/auth/signUpOTP")
        .send({
          email: testEmail,
          otp: signUpOTP
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("OTP Verify user successfully register")

      const CookieToken = res.headers['set-cookie'][0];
      accessToken = CookieToken.split("=")[1];
    })

    it("SignUp User Role Assign", async () => {
      const res = await request(app)
        .post("/auth/roleassign")
        .set("Cookie", `accessToken=${accessToken}`)
        .set("User-Agent", "Supertest")
        .set("X-Forwarded-For", "127.0.0.1")
        .send({
          role: "admin"
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("User Register Sucessfully");
      expect(res.body.users.role).toBe("admin")

      const cookieTokenAccess = res.headers['set-cookie'].find(c => c.startsWith("accessToken="));
      const accessTokenGet = cookieTokenAccess.split(";")[0];
      accessToken = accessTokenGet.split("=")[1]

      const cookieTokenRefresh = res.headers['set-cookie'].find(c => c.startsWith("refreshToken="));
      const refreshTokenGet = cookieTokenRefresh.split(";")[0];
      refreshToken = refreshTokenGet.split("=")[1]
    })

    it("User True Status Change Api", async () => {
      const res = await request(app)
        .post("/auth/statusChange")
        .set("Cookie", `accessToken=${accessToken}`)
        .send({
          status: "true"
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("User Status SuccessFull Change");
      expect(res.body.user.status).toBe(true)
    })

    it("User False Status Change Api", async () => {
      const res = await request(app)
        .post("/auth/statusChange")
        .set("Cookie", `accessToken=${accessToken}`)
        .send({
          status: "false"
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("User Status SuccessFull Change");
      expect(res.body.users.status).toBe(false)
    })
  })

  describe("Login Route Test", () => {

    let loginOTP;
    let loginOTPToken;

    it("Login APIs test", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: testEmail,
          password: testPass
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Welcome Back");
      expect(res.body.users.email).toBe(testEmail);

      const cookieAccessGet = res.headers['set-cookie'].find(c => c.startsWith("accessToken="))
      const accessTokenGet = cookieAccessGet.split(";")[0];
      accessToken = accessTokenGet.split("=")[1]

      const cookieRefreshGet = res.headers['set-cookie'].find(c => c.startsWith("refreshToken="));
      const refreshTokenGet = cookieRefreshGet.split(";")[0];
      refreshToken = refreshTokenGet.split("=")[1]
    })

    it("Login With OTP", async () => {
      const res = await request(app)
        .post("/auth/login-otp")
        .send({
          email: testEmail
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Login OTP send your email Successfully")

      const loginOTPGet = await redisClient.get(`otp:loginOTP:${testEmail}`);
      loginOTP = loginOTPGet;

      const cookieLoginOTPToken = res.headers['set-cookie'].find(c => c.startsWith("login-otp="));
      const tokenString = cookieLoginOTPToken.split(";")[0];
      loginOTPToken = tokenString.split("=")[1];
    })

    it("Login OTP Verify", async () => {
      const res = await request(app)
        .post("/auth/otp-login-verify")
        .set("Cookie", `login-otp=${loginOTPToken}`)
        .set("User-Agent", "Supertest")
        .set("X-Forwarded-For", "127.0.0.1")
        .send({
          otp: loginOTP
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("User Login SuccessFully");
      expect(res.body.users.email).toBe(testEmail);

      const cookieAccessGet = res.headers['set-cookie'].find(c => c.startsWith("accessToken="))
      const accessTokenGet = cookieAccessGet.split(";")[0];
      accessToken = accessTokenGet.split("=")[1]

      const cookieRefreshGet = res.headers['set-cookie'].find(c => c.startsWith("refreshToken="));
      const refreshTokenGet = cookieRefreshGet.split(";")[0];
      refreshToken = refreshTokenGet.split("=")[1]
    })
  })

  describe("Password Forget APIs Route", () => {

    let forgetOTP;
    let passForgetToken;
    let testPassForget = "oiwjnx09282-";

    it("Forget Password APIs test", async () => {
      const res = await request(app)
        .post("/auth/forgetPassword")
        .send({
          email: testEmail
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("otp send successfully your email");

      const forgetOTPCatch = await redisClient.get(`otp:forgetPass:${testEmail}`);
      forgetOTP = forgetOTPCatch;
    })

    it("Forget Password OTP Verify APIs", async () => {
      const res = await request(app)
        .post("/auth/forget-otp-verify")
        .send({
          email: testEmail,
          otp: forgetOTP
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Password Reset OTP Verify");

      const cookiePassForgetGet = res.headers['set-cookie'].find(c => c.startsWith("reset-session="));
      const passForgetString = cookiePassForgetGet.split(";")[0];
      passForgetToken = passForgetString.split("=")[1]
    })

    it("New Password Add APIs test", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .set("Cookie", `reset-session=${passForgetToken}`)
        .send({
          pass1: testPassForget,
          pass2: testPassForget
        })

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Your password change successfull");
    })
  })

  describe("Refresh Token Generate APIs Route", () => {
    it("Refresh Token Generate APIs test", async () => {
      const res = await request(app)
        .post("/auth/refreshToken")
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("New access token issued");
    })
  })

  describe("Logged Out Route", () => {
    it("Logged Out APIs test", async () => {
      const res = await request(app)
        .post("/auth/loggedOut")
        .set("Cookie", `accessToken=${accessToken}; refreshToken=${refreshToken}`);

      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken=;"),
          expect.stringContaining("refreshToken=;")
        ])
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("successfully logged out");
    })
  })
})

afterAll(async () => {
  if (testPool) {
    await testPool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
    await testPool.end();
  }
  if (redisClient.isOpen) {
    await redisClient.flushDb();
  }
});
