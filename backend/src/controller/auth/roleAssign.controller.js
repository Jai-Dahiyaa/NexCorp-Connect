import { roleAssignUsers } from "../../services/auth/roleAssign.service.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import utilsToken from "../../utils/token.js";
import { refreshTokenStore } from "../../services/auth/roleAssign.service.js";

const roleAssignController = catchAsync(async (req, res) => {
  const { role } = req.body;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  if (!role) throw new AppError("Required a role", 403);

  const token = req.cookies?.accessToken;

  if (!token) throw new AppError("Token is Expire Please Try Again", 401);

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

  const users = await roleAssignUsers(decoded.email, role);

  const userPayload = {};

  if (decoded?.platform) {
    userPayload.id = users.id;
    userPayload.email = users.email;
    userPayload.role = users.role;
    userPayload.provider = decoded.platform;
  }

  if (!decoded?.platform) {
    userPayload.id = users.id;
    userPayload.email = users.email;
    userPayload.role = users.role;
  }

  if (!userPayload) throw new AppError("Token is not generate successfully please try again", 401);

  const accessToken = utilsToken.accessTokenGenerate(userPayload);
  const refreshToken = utilsToken.refreshTokenGenerate(userPayload);

  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 3);


  const refreshTokenInsert = await refreshTokenStore(userPayload.id, refreshToken, tokenExpiresAt, userAgent, ipAddress);

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

  res.status(200).json({ status: true, message: "User Register Sucessfully", users: users });
});

export default roleAssignController;
