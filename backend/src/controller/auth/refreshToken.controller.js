import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import refreshTokenService from "../../services/auth/refreshToken.service.js";
import jwt from "jsonwebtoken";
import utilsToken from "../../utils/token.js";

const refreshTokenController = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) throw new AppError("Token is missing", 401);

  const decode = jwt.verify(token, process.env.REFRESH_TOKEN);

  const users = await refreshTokenService(decode.id);

  const dbRefreshTokenVerify = jwt.verify(users.refreshTokenFromDB.refreshToken, process.env.REFRESH_TOKEN);

  if (token === users.refreshTokenFromDB.refreshToken) {

    const newPayload = {
      id: dbRefreshTokenVerify.id,
      email: dbRefreshTokenVerify.email,
      role: dbRefreshTokenVerify.role,
    };

    const newAccessToken = utilsToken.accessTokenGenerate(newPayload);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 25 * 60 * 1000,
    });

    res
      .status(200)
      .json({status: true, message: "New access token issued"});
  }
});

export default refreshTokenController;
