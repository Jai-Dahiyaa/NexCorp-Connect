import AppError from "../../utils/appError.js";
import * as userModel from "../../models/users.models.js";
import { insertSessionsTokenFromLoginOTPFile } from "../../models/sessions.models.js";

export const loginOTPService = async (email) => {
  if (!email) throw new AppError("email is missing", 404);

  const result = await userModel.userLoginOTPQuery(email);
  if(!result) throw new AppError("user not find please try again", 404);

  return { result };
};

export const loginOTPRefreshToken = async (userId, refreshToken, expiresAt, userAgent, ipAdress) => {
  const dataToken = {
    id: userId,
    token: refreshToken,
    expires_at: expiresAt,
    user_agent: userAgent,
    ip_address: ipAdress
  };

  if (!dataToken.id && !dataToken.token && !dataToken.expires_at) throw new AppError("Token data is missing please again SignUp", 401);

  const tokenInsert = await insertSessionsTokenFromLoginOTPFile(dataToken.id, dataToken.token, dataToken.expires_at, dataToken.user_agent, dataToken.ip_address);

  if (!tokenInsert) throw new AppError("DB Response problem", 500);

  return tokenInsert;
};