import { loginService } from "../../services/auth/login.service.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import utilsToken from "../../utils/token.js";
import { loginRefreshToken } from "../../services/auth/login.service.js";

const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;
  if (!email || !password) throw new AppError("Email and Password Both Required", 402);

  const users = await loginService(email, password);

  const payload = {
    id: users.users.id,
    email: users.users.email,
    role: users.users.role,
  };

  const accessToken = utilsToken.accessTokenGenerate(payload);
  const refreshToken = utilsToken.refreshTokenGenerate(payload);

  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 3);

  const refreshTokenInsert = await loginRefreshToken(payload.id, refreshToken, tokenExpiresAt, userAgent, ipAddress);

  if (!refreshTokenInsert.refreshToken) throw new AppError("Token is missing please try again: ", 401);

  if (!accessToken) throw new AppError("new token is not generate please try again", 500);
  if (!refreshToken) throw new AppError("new token is not generate please try again", 500);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 25 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshTokenInsert.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({status: true, message: "Welcome Back", users: users.users });
});

export default loginController;
