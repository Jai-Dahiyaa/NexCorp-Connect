import { createUser } from "../../services/auth/localAuth.service.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";

const signUpController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("Required email and password both");

  const otpGnerateResult = await createUser(email, password);

  if(!otpGnerateResult) throw new AppError("OTP not generate for signup please try again", 500);

  res.status(200).json({status: true, message: "Send OTP on your email"});
});

export default signUpController; 