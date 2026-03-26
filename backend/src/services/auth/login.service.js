import bcrypt from "bcrypt";
import * as useraModel from "../../models/users.models.js";
import AppError from "../../utils/appError.js";
import { insertSessionsTokenFromLoginFile } from "../../models/sessions.models.js";

export const loginService = async (email, password) => {
  if (!email) throw new AppError("Please enter your email", 404);

  const registerUser = await useraModel.findByEmail(email);

  if (!registerUser) throw new AppError("User not register Please signUp", 404);

  const loginPassword = await useraModel.getPassworsLogin(email);

  if (!loginPassword) throw new AppError("Password not add Retry signUp", 402);

  const hashPassword = loginPassword.password;
  const originalConvert = JSON.parse(hashPassword);

  if (!bcrypt.compareSync(password, originalConvert)) throw new AppError("Password incorrect", 401);

  const result = await useraModel.loginUserGet(loginPassword.password);

  const users = {
    id: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
    created_at: result.created_at
  };

  return { message: "user login successfully", users };
};

export const loginRefreshToken = async (userId, refreshToken, expiresAt, userAgent, ipAdress) => {
  const dataToken = {
    id: userId,
    token: refreshToken,
    expires_at: expiresAt,
    user_agent: userAgent,
    ip_address: ipAdress
  };

  if (!dataToken.id && !dataToken.token && !dataToken.expires_at) throw new AppError("Token data is missing please again SignUp", 401);

  const tokenInsert = await insertSessionsTokenFromLoginFile(dataToken.id, dataToken.token, dataToken.expires_at, dataToken.user_agent, dataToken.ip_address);

  if (!tokenInsert) throw new AppError("DB Response problem", 500);

  return tokenInsert;
};
