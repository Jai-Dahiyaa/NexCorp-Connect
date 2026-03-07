import jwt from "jsonwebtoken";
const accessTokenString = process.env.ACCESS_TOKEN || "djncomskm";
const refreshTokenString = process.env.REFRESH_TOKEN || "kcnjsia";

function accessTokenGenerate(payload) {
  return jwt.sign(payload, accessTokenString, { expiresIn: process.env.ACCESS_EXPIRE });
}

function refreshTokenGenerate(payload) {
  return jwt.sign(payload, refreshTokenString, { expiresIn: process.env.REFRESH_EXPIRE });
}

export default {
  accessTokenGenerate,
  refreshTokenGenerate,
};
