import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const accessTokenSecret = process.env.ACCESS_TOKEN || "djncomskm";
const refreshToken = process.env.REFRESH_TOKEN || "kcnjsia";

export function verifyAccessToken(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError("Access Token Missing", 401));

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid or Expired Token", 403));
    }
    req.user = decoded;
    next();
  });
}

export function verifyRefreshToken(req, res, next) {
  const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

  if (!token) throw next(new AppError("Refresh token is missing", 401));

  jwt.verify(token, refreshToken, (err, decoded) => {
    if (err) throw next(new AppError("Invalid or Expire Token", 403));
    req.payload = decoded;
    next();
  });
}
