import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { logoutWithRefresh } from "../../models/sessions.models.js";
import jwt from "jsonwebtoken";

const logoutController = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new AppError("accessToken is missing", 401);

  const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

  const dbRefreshToken = await logoutWithRefresh(decode.id);

  const dbTokenDecode = jwt.verify(dbRefreshToken.refreshToken, process.env.REFRESH_TOKEN);

  if (decode.id === dbTokenDecode.id) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    res.status(200).json({status: true, message: "successfully logged out" });
  }
});

export default logoutController;
