import AppError from "../../utils/appError.js";
import oauthServiceFunction from "../../services/oauth/oauth.service.js";
import catchAsync from "../../utils/catchAsync.js";
import token from "../../utils/token.js";

const oauthController = catchAsync(async (req, res) => {
    const profile = req.user;
    if (!profile) throw new AppError("Your not register this platform please try again", 404);

    const users = await oauthServiceFunction(profile);

    if (!users) throw new AppError("User not find please try again", 404);

    const payload = {
      id: users.id,
      email: users.email,
      platform: users.provider,
    };

    if (!payload) throw new AppError("Payload not create plaease try again", 401);

    const tokenGenerate = token.accessTokenGenerate(payload);

    if (!tokenGenerate) throw new AppError("Token is not generate please try again", 404);

    res.cookie("accessToken", tokenGenerate, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 25 * 60 * 1000,
    });

    res.status(200).json({status: true, message: "Users successfully register", user: users });
});

export default oauthController;
